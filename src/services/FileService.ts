// /src/services/file-client.ts
"use client";

import { processFile } from "@/lib/client/utils";
import type { FileItem } from "@/types/file";

export async function getFiles(resourceId?: string): Promise<FileItem[]> {
  const queryParams = resourceId
    ? `?resourceId=${encodeURIComponent(resourceId)}`
    : "";
  const res = await fetch(`/api/files${queryParams}`);
  if (!res.ok) {
    throw new Error("Failed to fetch files.");
  }
  const data = await res.json();
  console.log(data);
  return data.map((fileData: any) => processFile(fileData)) as FileItem[];
}
