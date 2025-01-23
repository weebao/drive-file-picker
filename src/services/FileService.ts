// /src/services/file-client.ts
"use client";

import { processFile } from "@/lib/utils";
import type { FileItem } from "@/types/file";

export async function getFiles(resourceId?: string): Promise<FileItem[]> {
  const queryParams = resourceId
    ? `?resourceId=${encodeURIComponent(resourceId)}`
    : "";
  const res = await fetch(`/api/drive${queryParams}`);
  if (!res.ok) {
    throw new Error("Failed to fetch files.");
  }
  const data = await res.json();
  console.log(data);
  return data.map((fileData: any) => processFile(fileData)) as FileItem[];
}

export async function toggleIndex(fileId: string): Promise<void> {
  const res = await fetch("/api/file", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileId, toggleIndex: true }),
  });
  if (!res.ok) {
    throw new Error("Failed to toggle index on file.");
  }
}

// For the new "delete" action in ActionMenu
export async function deleteFiles(fileIds: string[]): Promise<void> {
  // Suppose you pass them in the request body
  const res = await fetch("/api/file", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileIds }),
  });
  if (!res.ok) {
    throw new Error("Failed to delete files.");
  }
}
