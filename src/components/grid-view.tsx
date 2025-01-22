"use client";

import { useFileManagerContext } from "@/context/file-manager-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { FileIcon } from "@/components/file-icon";

import type { FileItem, FolderItem } from "@/types/file";
import { useFiles } from "@/hooks/use-files";
import { useEffect } from "react";

interface GridViewProps {
  root?: FileItem;
  path: string;
  searchQuery: string;
  onNavigate: (file: FolderItem) => void;
}

export function GridView({ root, path, searchQuery, onNavigate }: GridViewProps) {
  const { displayed } = useFileManagerContext();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-start">
      {displayed.map((file) => (
        <div key={file.id} className="relative group">
          <Button
            variant="ghost"
            className="w-full h-full p-4 flex flex-col items-center gap-2 hover:bg-accent"
            onClick={() => file.kind === "Folder" && onNavigate(file as FolderItem)}
          >
            <FileIcon file={file} className="!h-8 !w-8" />
            <span className="text-sm text-center text-wrap line-clamp-3 break-words">
              {file.name}
            </span>
          </Button>
        </div>
      ))}
      {displayed.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground">
          No files found.
        </div>
      )}
    </div>
  );
}
