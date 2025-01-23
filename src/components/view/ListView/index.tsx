"use client";

import { CellContext } from "@tanstack/react-table";
import { Check, X } from "lucide-react";

import { useFileManagerContext } from "@/context/FileManagerContext";

import { FileIcon } from "@/components/FileIcon";
import { DataTable } from "@/components/ui/data-table";
import { fileColumns } from "./Columns";

import { useFiles } from "@/hooks/useFiles";

import type {
  FileItem,
  SortField,
  SortDirection,
  FolderItem,
} from "@/types/file";
import { ToggleIndexBtn } from "@/components/ToggleIndexBtn";

interface ListViewProps {
  root?: FileItem;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  searchQuery: string;
  onNavigate: (folder: FolderItem) => void;
}

export function ListView({ onNavigate }: ListViewProps) {
  const { setFiles, displayed } = useFileManagerContext();
  const {
    files,
    isLoading,
    isSuccess,
    isError,
    setRoot,
    toggleIndexOptimistic,
  } = useFiles();

  // Toggle index function
  const columns = fileColumns.map((col) => {
    if (col.id === "indexed") {
      return {
        ...col,
        cell: ({ row }: CellContext<FileItem, unknown>) => {
          const file = row.original;
          return (
            <ToggleIndexBtn
              isIndexed={file.isIndexed}
              onToggle={() => toggleIndexOptimistic(file.id)}
            />
          );
        },
      };
    }
    return col;
  });

  // Navigate through folder function or open file
  const handleNavigateToFolder = (file: FileItem) => {
    if (file.kind === "Folder") {
      onNavigate(file as FolderItem);
    } else {
      window.open(file.webUrl, "_blank")?.focus();
    }
  };

  return (
    <DataTable
      columns={columns}
      data={displayed}
      rowFunction={handleNavigateToFolder}
    />
  );
}
