import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFiles, toggleIndex } from "@/services/file-client";
import type { FileItem } from "@/types/file";

export function useFiles() {
  const [root, setRoot] = useState<FileItem>();
  const queryClient = useQueryClient();

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["fileList", root?.resourceId],
    queryFn: () => getFiles(root?.resourceId),
  });

  const toggleMutation = useMutation({
    mutationFn: (fileId: string) => toggleIndex(fileId),
    onMutate: async (fileId) => {
      await queryClient.cancelQueries({ queryKey: ["fileList", root?.resourceId] });
      const prevData = queryClient.getQueryData<FileItem[]>([
        "fileList",
        root?.resourceId,
      ]);
      if (prevData) {
        const nextData = prevData.map((f) =>
          f.id === fileId ? { ...f, isIndexed: !f.isIndexed } : f,
        );
        queryClient.setQueryData(["fileList", root?.resourceId], nextData);
      }
      return { prevData };
    },
    onError: (_err, _fileId, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["fileList", root?.resourceId], context.prevData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList", root?.resourceId] });
    },
  });

  const toggleIndexOptimistic = (fileId: string) => toggleMutation.mutate(fileId);

  return {
    root,
    setRoot,
    files: data || [],
    isLoading,
    isSuccess,
    isError,
    toggleIndexOptimistic,
  };
}