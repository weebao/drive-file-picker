import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { FileItem } from "@/types/file"
import { getKind } from "./map"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractExtension = (fileName: string): string => {
  return fileName.substring(fileName.lastIndexOf("."));
}

export const processFile = (fileData: any): FileItem => {
  return {
    id: fileData.resource_id,
    name: fileData.inode_path.path,
    kind: getKind(extractExtension(fileData.inode_path.path)),
    path: fileData.inode_path.path,
    lastModified: fileData.dataloader_metadata.last_modified_at,
    isIndexed: fileData.indexed_at !== null,
    webUrl: fileData.dataloader_metadata.web_url,
    resourceId: fileData.resource_id
  };
}
