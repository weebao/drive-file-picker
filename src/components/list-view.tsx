"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "./data-table"
import { fileColumns } from "./columns"
import type { FileItem, SortField, SortDirection } from "@/types/file"
import { Skeleton } from "@/components/ui/skeleton"
import { getFiles, toggleIndex } from "@/services/file-client"

interface ListViewProps {
  path: string
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  searchQuery: string
  onNavigate: (path: string) => void
}

export function ListView({
  path,
  sortField,
  sortDirection,
  onSort,
  searchQuery,
  onNavigate,
}: ListViewProps) {
  const queryClient = useQueryClient()

  // 1) Load data
  const { data, isLoading, isError } = useQuery<FileItem[]>({
    queryKey: ["fileList", path],
    queryFn: () => getFiles(path),
  })

  // 2) Mutation for toggling isIndexed
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

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    )
  }
  if (isError) {
    return <p className="text-red-500">Error loading files!</p>
  }

  // Filter
  const filteredFiles = (data || []).filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Override the "indexed" column to do real toggling
  const customColumns = fileColumns.map((col) => {
    if (col.id === "indexed") {
      return {
        ...col,
        cell: ({ row }: any) => {
          const file = row.original as FileItem
          return (
            <input
              type="checkbox"
              checked={file.isIndexed}
              onChange={() => toggleMutation.mutate(file.id)}
            />
          )
        },
      }
    }
    return col
  })

  return (
    <DataTable
      columns={customColumns}
      data={filteredFiles}
      filterPlaceholder="Search files..."
      defaultColumnFilter="name"
    />
  )
}
