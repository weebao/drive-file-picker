"use client";

import { useEffect, useState } from "react";
import {
  CellContext,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type OnChangeFn,
  type RowSelectionState,
} from "@tanstack/react-table";
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
  isSelecting?: boolean;
  selectedIds?: string[];
  setSelectedIds: (ids: string[]) => void;
  onNavigate: (folder: FolderItem) => void;
}

export function ListView({
  isSelecting,
  selectedIds,
  setSelectedIds,
  onNavigate,
}: ListViewProps) {
  const { setFiles, displayed } = useFileManagerContext();
  const { files, isLoading, isSuccess, isError, setRoot } = useFiles();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Toggle index function
  const columns = fileColumns
    .map((col) => {
      if (col.id === "status") {
        return {
          ...col,
          cell: ({ row }: CellContext<FileItem, unknown>) => {
            const file = row.original;
            return <ToggleIndexBtn status={file.status} onToggle={() => {}} />;
          },
        };
      }
      return col;
    })
    .filter((col) => col.id !== "select" || isSelecting);

  const table = useReactTable<FileItem>({
    data: displayed,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updaterOrValue) => {
      // This's how it's defined in tanstack table
      const newSelection =
        typeof updaterOrValue === "function"
          ? updaterOrValue(rowSelection)
          : updaterOrValue;
      setRowSelection(newSelection);
      setSelectedIds(Object.keys(newSelection));
    },
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Navigate through folder function or open file
  const handleNavigateToFolder = (file: FileItem) => {
    if (isSelecting) return;
    if (file.kind === "Folder") {
      onNavigate(file as FolderItem);
    } else {
      window.open(file.webUrl, "_blank")?.focus();
    }
  };

  useEffect(() => {
    if (selectedIds) {
      setRowSelection(
        selectedIds?.reduce((acc, id) => {
          acc[id] = true;
          return acc;
        }, {} as RowSelectionState) || {},
      );
    }
  }, [selectedIds]);

  return <DataTable table={table} onRowClick={handleNavigateToFolder} />;
}
