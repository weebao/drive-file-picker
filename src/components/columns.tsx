"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { FileItem } from "@/types/file"

// Example columns to show name, date, etc., using TanStack Table
export const fileColumns: ColumnDef<FileItem>[] = [
  // isIndexed column
  {
    id: "indexed",
    header: "Indexed",
    cell: ({ row }) => {
      const file = row.original
      return (
        <Checkbox
          checked={file.isIndexed}
          onCheckedChange={() => console.log("Toggle index", file.id)}
        />
      )
    },
    enableSorting: false,
    enableColumnFilter: false,
  },

  // Name column
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const file = row.original
      return file.name
    },
  },

  // Date Modified
  {
    accessorKey: "dateModified",
    header: "Date Modified",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateModified"))
      return date.toLocaleString()
    },
  },

  // Kind
  {
    accessorKey: "kind",
    header: "Kind",
    cell: ({ row }) => {
      const kind = row.getValue("kind") as string
      return kind
    },
  },

  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const file = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("Delete", file)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
