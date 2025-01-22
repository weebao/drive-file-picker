import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { FileItem } from "@/types/file";
import { getKind } from "./map";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractExtension = (fileName: string): string => {
  return fileName.substring(fileName.lastIndexOf("."));
};

export const processFile = (fileData: any): FileItem => {
  const isFolder = fileData.inode_type === "directory";
  const name = fileData.inode_path.path.split("/").pop() || fileData.inode_path.path;
  return {
    id: fileData.resource_id,
    name,
    extension: extractExtension(fileData.inode_path.path),
    kind: isFolder
      ? "Folder"
      : getKind(extractExtension(fileData.inode_path.path)),
    path: fileData.inode_path.path,
    lastModified: fileData.modified_at,
    isIndexed: fileData.indexed_at !== null,
    webUrl: fileData.dataloader_metadata.web_url,
    resourceId: fileData.resource_id,
  };
};
