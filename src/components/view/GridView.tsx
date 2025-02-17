"use client";

import { useFileManagerContext } from "@/context/FileManagerContext";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileIcon } from "@/components/FileIcon";

import type { FileItem, FolderItem } from "@/types/file";
import { ToggleIndexBtn } from "../ToggleIndexBtn";

interface GridViewProps {
  isSelecting?: boolean;
  isRemoveSuccess?: boolean;
  selectedIds?: string[];
  setSelectedIds?: (ids: string[]) => void;
  onNavigate: (folderId: string, folderPath: string) => void;
  removeIndex: (file: FileItem) => void;
}

export function GridView({
  isSelecting,
  selectedIds,
  setSelectedIds,
  onNavigate,
  removeIndex,
}: GridViewProps) {
  const { displayed } = useFileManagerContext();

  const handleSelect = (fileId: string) => {
    if (!setSelectedIds) return;

    if (selectedIds?.includes(fileId)) {
      setSelectedIds(selectedIds.filter((id) => id !== fileId));
    } else {
      setSelectedIds([...(selectedIds || []), fileId]);
    }
  };

  const handleClick = (file: FileItem) => {
    if (isSelecting) return;
    if (file.kind === "Folder") {
      onNavigate(file.id, file.path);
    } else {
      window.open(file.webUrl, "_blank")?.focus();
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-start">
      {displayed.map((file) => (
        <div key={file.id + file.path} className="relative group">
          {isSelecting && (
            <Checkbox
              className="absolute left-2 top-2 shadow"
              checked={selectedIds?.includes(file.id)}
              onCheckedChange={() => handleSelect(file.id)}
            />
          )}
          <ToggleIndexBtn
            className="absolute top-1 right-2"
            status={file.status}
            onRemove={() => removeIndex(file)}
          />
          <Button
            variant="ghost"
            className="w-full h-full p-4 flex flex-col items-center gap-2 hover:bg-accent"
            onClick={() => handleClick(file)}
          >
            <FileIcon file={file} className="!h-8 !w-8 stroke-[1.25]" />
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
