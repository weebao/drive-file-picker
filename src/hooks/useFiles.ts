import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFiles } from "@/services/FileService";
import {
  getFilesFromKb,
  removeFileFromKb,
} from "@/services/KnowledgeBaseService";
import type { FileItem } from "@/types/file";
import { useKnowledgeBaseContext } from "@/context/KnowledgeBaseContext";

export function useFiles() {
  const [root, setRoot] = useState<FileItem>();
  const { selectedKb: kb } = useKnowledgeBaseContext();
  const queryClient = useQueryClient();

  const { data, isLoading, isRefetching, isSuccess, isError, refetch } =
    useQuery({
      queryKey: ["fileList", root?.id, kb],
      queryFn: () => {
        return kb ? getFilesFromKb(kb, root?.path || "/") : getFiles(root?.id);
      },
    });

  const removeIndexMutation = useMutation({
    mutationFn: (file: FileItem) => removeFileFromKb(root?.id || "", file.path),
    onMutate: async (file) => {
      await queryClient.cancelQueries({
        queryKey: ["fileList", root?.id, kb],
      });
      const prevData = queryClient.getQueryData<FileItem[]>([
        "fileList",
        root?.id,
        kb,
      ]);
      if (prevData) {
        const nextData = prevData.filter((f) => f.id !== file.id);
        queryClient.setQueryData(["fileList", root?.id, kb], nextData);
      }
      return { prevData };
    },
    onError: (_err, _file, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["fileList", root?.id, kb], context.prevData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["fileList", root?.id, kb],
      });
    },
  });

  const removeIndex = (file: FileItem) => removeIndexMutation.mutate(file);

  return {
    root,
    setRoot,
    files: data || [],
    isLoading,
    isRefetching,
    isSuccess,
    isError,
    removeIndex,
    reload: refetch,
  };
}
