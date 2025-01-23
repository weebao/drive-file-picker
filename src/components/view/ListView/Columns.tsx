"use client";

import { ColumnDef, Column } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import type { FileItem } from "@/types/file";
import { FileIcon } from "@/components/FileIcon";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}
const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) => {
  if (!column.getCanSort()) return <div>{title}</div>;
  const sortState = column.getIsSorted();
  let nextSort: "asc" | "desc" | false;
  if (sortState === false) nextSort = "asc";
  else if (sortState === "asc") nextSort = "desc";
  else nextSort = false;

  let icon = <Minus className="h-4 w-4" />;
  if (sortState === "asc") icon = <ArrowUp className="h-4 w-4" />;
  if (sortState === "desc") icon = <ArrowDown className="h-4 w-4" />;

  return (
    <button
      onClick={() => {
        column.clearSorting();
        if (nextSort !== false) {
          column.toggleSorting(nextSort === "desc");
        }
      }}
      className="flex items-center gap-1 -ml-2 px-2 py-1 text-sm font-medium rounded-sm hover:bg-muted"
    >
      {title}
      {icon}
    </button>
  );
};

export const fileColumns: ColumnDef<FileItem>[] = [
  // Checkboxes for row selection
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  // Name (sortable)
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const file = row.original;
      return (
        <div className="flex items-center">
          <FileIcon file={file} className="!h-5 !w-5 mr-2 stroke-[1.5] opacity-70" />
          <span>{file.name}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  // Indexed column -> Check or X
  {
    id: "indexed",
    accessorKey: "indexed",
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Indexed" />
    ),
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.isIndexed ? 1 : 0;
      const b = rowB.original.isIndexed ? 1 : 0;
      return a - b;
    },
  },
  // Last Modified
  {
    id: "lastModified",
    accessorKey: "lastModified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Modified" />
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastModified"));
      return date.toLocaleString();
    },
  },
  // Kind
  {
    id: "kind",
    accessorKey: "kind",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kind" />
    ),
    enableSorting: true,
  },
];
