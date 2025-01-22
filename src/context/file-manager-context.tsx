"use client"

import React, { createContext, useContext, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { FileItem } from "@/types/file"
import { getFiles, toggleIndex } from "@/services/file-client"

interface FileManagerProviderProps {
  path: string
  searchQuery: string
  children: React.ReactNode
}

interface FileManagerContextValue {
  files: FileItem[] | undefined
  displayed: FileItem[]
  isLoading: boolean
  isError: boolean
  toggleIndexOptimistic: (fileId: string) => void
}

// Converted to arrow function
export const FileManagerProvider: React.FC<FileManagerProviderProps> = ({
  path,
  searchQuery,
  children,
}) => {
  const queryClient = useQueryClient()

  const { data: files, isLoading, isError } = useQuery<FileItem[]>({
    queryKey: ["fileList", path],
    queryFn: () => getFiles(path),
  })

  const toggleMutation = useMutation({
    mutationFn: (fileId: string) => toggleIndex(fileId),
    onMutate: async (fileId) => {
      await queryClient.cancelQueries({ queryKey: ["fileList", path] })
      const prevData = queryClient.getQueryData<FileItem[]>(["fileList", path])
      if (prevData) {
        const nextData = prevData.map((f) =>
          f.id === fileId ? { ...f, isIndexed: !f.isIndexed } : f
        )
        queryClient.setQueryData(["fileList", path], nextData)
      }
      return { prevData }
    },
    onError: (_err, _fileId, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["fileList", path], context.prevData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList", path] })
    },
  })

  const toggleIndexOptimistic = (fileId: string) => {
    toggleMutation.mutate(fileId)
  }

  const displayed = useMemo(() => {
    if (!files) return []
    return files
      .filter((f) => f.path !== "/")
      .filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [files, searchQuery])

  const value: FileManagerContextValue = {
    files,
    displayed,
    isLoading,
    isError,
    toggleIndexOptimistic,
  }

  return (
    <FileManagerContext.Provider value={value}>
      {children}
    </FileManagerContext.Provider>
  )
}

const FileManagerContext = createContext<FileManagerContextValue | undefined>(undefined)

export const useFileManagerContext = () => {
  const ctx = useContext(FileManagerContext)
  if (!ctx) {
    throw new Error("useFileManagerContext must be used within a <FileManagerProvider>")
  }
  return ctx
}
