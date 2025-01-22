"use client";

import { useFileManagerContext } from "@/context/file-manager-context";
import { DataTable } from "./data-table";
import { fileColumns } from "./columns";
import type { FileItem, SortField, SortDirection, FolderItem } from "@/types/file";
import { Skeleton } from "@/components/ui/skeleton";
import { useFiles } from "@/hooks/use-files";
import { useEffect } from "react";
import { FileIcon } from "./file-icon";

interface ListViewProps {
  root?: FileItem;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  searchQuery: string;
  onNavigate: (folder: FolderItem) => void;
}

export function ListView({
  root,
  sortField,
  sortDirection,
  onSort,
  searchQuery,
  onNavigate,
}: ListViewProps) {
  const { setFiles, displayed } = useFileManagerContext();
  const { files, isLoading, isSuccess, isError, setRoot, toggleIndexOptimistic } = useFiles();

  // Override the "indexed" and "name" columns
  const columns = fileColumns.map((col) => {
    // if (col.id === "indexed") {
    //   return {
    //     ...col,
    //     cell: ({ row }: any) => {
    //       const file = row.original as FileItem;
    //       return (
    //         <input
    //           type="checkbox"
    //           checked={file.isIndexed}
    //           onChange={() => toggleIndexOptimistic(file.id)}
    //         />
    //       );
    //     },
    //   };
    // }
    if (col.id === "name") {
      return {
        ...col,
        cell: ({ row }: any) => {
          const file = row.original as FileItem;
          return (
            <div className="flex items-center">
              <FileIcon file={file} className="!h-5 !w-5 mr-2 stroke-[1.5] opacity-70" />
              <span
                className={file.kind === "Folder" ? "cursor-pointer text-blue-600" : ""}
                onClick={() => file.kind === "Folder" && onNavigate(file as FolderItem)}
              >
                {file.name}
              </span>
            </div>
          );
        },
      };
    }
    return col;
  });

  return (
    <DataTable
      columns={columns}
      data={displayed}
      filterPlaceholder="Search files..."
      defaultColumnFilter="name"
    />
  );
}
