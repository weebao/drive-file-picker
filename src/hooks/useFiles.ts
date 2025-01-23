import { useEffect, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getFiles } from "@/services/FileService";
import {
  getFilesFromKb,
  removeFileFromKb,
  createKnowledgeBase,
} from "@/services/KnowledgeBaseService";
import type { FileItem, RootData } from "@/types/file";
import { useKnowledgeBaseContext } from "@/context/KnowledgeBaseContext";
import { useFileManagerContext } from "@/context/FileManagerContext";

export const useFiles = (root: RootData, setRoot: (root: RootData) => void) => {
  // const [root, setRoot] = useState<RootData>({
  //   id: "",
  //   path: "/",
  // });
  const { setFiles } = useFileManagerContext();
  const {
    selectedKb: kb,
    kbList,
    setKbList,
    setSelectedKb,
    setIsCreating,
    setIsSelecting,
  } = useKnowledgeBaseContext();
  const queryClient = useQueryClient();

  const { data, isLoading, isRefetching, isSuccess, isError, refetch } =
    useQuery({
      queryKey: ["fileList", root.id, root.path, kb],
      queryFn: () => {
        return kb ? getFilesFromKb(kb, root.path) : getFiles(root.id);
      },
      staleTime: 30000,
    });

  useEffect(() => {
    if (data) {
      setFiles(data);
    }
  }, [data]);

  const createKbMutation = useMutation({
    mutationFn: (selectedIds: string[]) => createKnowledgeBase(selectedIds),
    onMutate: async (selectedIds) => {
      setIsCreating(true);
      // setRoot({ id: "", path: "/" });
      await queryClient.cancelQueries({ queryKey: ["fileList", root.id, root.path, kb] });
      const prevFiles = queryClient.getQueryData<FileItem[]>([
        "fileList",
        root.id, root.path,
        kb,
      ]);
      const prevKbList = kbList;
      if (prevFiles) {
        const nextFiles = prevFiles.filter((f) => selectedIds.includes(f.id));
        queryClient.setQueryData(["fileList", root.id, root.path, kb], nextFiles);
      }
      setKbList([...kbList, "loading-id"]);
      return { prevKbList, prevFiles };
    },
    onError: (_err, _selectedIds, context) => {
      if (context?.prevFiles) {
        queryClient.setQueryData(["fileList", root.id, root.path, kb], context.prevFiles);
      }
      if (context?.prevKbList) {
        setKbList(context.prevKbList);
      }
      setIsCreating(false);
    },
    onSuccess: (kbId, _selectedIds, context) => {
      if (context?.prevKbList) {
        setKbList([...context.prevKbList, kbId]);
      }
      setSelectedKb(kbId);
      setIsCreating(false);
      setIsSelecting(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList", root.id, root.path, kb] });
    },
  });

  const removeIndexMutation = useMutation({
    mutationFn: (file: FileItem) => removeFileFromKb(kb ?? "", file.path),
    onMutate: async (file) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["fileList", root.id, root.path, kb],
      });
      // Snapshot the previous value
      const prevData = queryClient.getQueryData<FileItem[]>([
        "fileList",
        root.id, root.path,
        kb,
      ]);
      if (prevData) {
        const nextData = prevData.filter((f) => f.id !== file.id);
        queryClient.setQueryData(["fileList", root.id, root.path, kb], nextData);
      }
      return { prevData };
    },
    onError: (_err, _file, context) => {
      // Roll back to the previous value if error
      if (context?.prevData) {
        queryClient.setQueryData(["fileList", root.id, root.path, kb], context.prevData);
      }
    },
    onSettled: () => {
      // Refetch if success
      queryClient.invalidateQueries({
        queryKey: ["fileList", root.id, root.path, kb],
      });
    },
  });

  const removeIndex = (file: FileItem) => removeIndexMutation.mutate(file);
  const createKb = (selectedIds: string[]) =>
    createKbMutation.mutate(selectedIds);

  return {
    root,
    files: data || [],
    isLoading,
    isRefetching,
    isSuccess,
    isError,
    setRoot,
    removeIndex,
    reload: refetch,
    createKb,
  };
}
