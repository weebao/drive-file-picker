"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Folder, FileIcon, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

import type { FileItem } from "@/types/file"
import { getFiles, toggleIndex } from "@/services/file-client"

interface GridViewProps {
  path: string
  searchQuery: string
  onNavigate: (path: string) => void
}

export function GridView({ path, searchQuery, onNavigate }: GridViewProps) {
  const queryClient = useQueryClient()

  // 1) Load data with React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["fileList", path],
    queryFn: () => getFiles(path),
  })

  // 2) Mutation for toggling isIndexed (optimistic updates)
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
    onError: (err, fileId, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["fileList", path], context.prevData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList", path] })
    },
  })

  // 3) Skeleton if loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }
  if (isError) {
    return <div className="text-red-500">Error loading files!</div>
  }

  // 4) Filter by search
  const filtered = (data || []).filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 5) Render
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {filtered.map((file) => (
        <div key={file.id} className="relative group">
          {/* isIndexed checkbox */}
          {/* <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={file.isIndexed}
              onCheckedChange={() => toggleMutation.mutate(file.id)}
            />
          </div> */}

          {/* actions */}
          {/* <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => console.log("Download", file)}>
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Copy link", file)}>
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Delete", file)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}

          <Button
            variant="ghost"
            className="w-full h-full p-4 flex flex-col items-center gap-2 hover:bg-accent"
            onClick={() => file.kind === "Folder" && onNavigate(file.path)}
          >
            {file.thumbnail ? (
              <img
                src={file.thumbnail}
                alt={file.name}
                className="w-20 h-20 object-cover rounded"
              />
            ) : file.kind === "Folder" ? (
              <Folder className="w-20 h-20" />
            ) : (
              <FileIcon className="w-20 h-20" />
            )}
            <span className="text-sm text-center break-words">{file.name}</span>
          </Button>
        </div>
      ))}
      {filtered.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground">
          No files found.
        </div>
      )}
    </div>
  )
}
