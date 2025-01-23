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

import type { FileItem } from "@/types/file";
import { ToggleIndexBtn } from "@/components/ToggleIndexBtn";

interface ListViewProps {
  isSelecting?: boolean;
  selectedIds?: string[];
  setSelectedIds: (ids: string[]) => void;
  onNavigate: (folderId: string, folderPath: string) => void;
  removeIndex: (file: FileItem) => void;
}

export function ListView({
  isSelecting,
  selectedIds,
  setSelectedIds,
  onNavigate,
  removeIndex,
}: ListViewProps) {
  const { displayed } = useFileManagerContext();

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
            return (
              <ToggleIndexBtn
                status={file.status}
                onRemove={() => removeIndex(file)}
              />
            );
          },
        };
      }
      return col;
    })
    .filter((col) => col.id !== "select" || isSelecting);

  // Set up react table
  const table = useReactTable<FileItem>({
    data: displayed,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updaterOrValue) => {
      // Update file selections for fetching
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
  const handleClick = (file: FileItem) => {
    if (isSelecting) return;
    if (file.kind === "Folder") {
      onNavigate(file.id, file.path);
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

  return <DataTable table={table} onRowClick={handleClick} />;
}
