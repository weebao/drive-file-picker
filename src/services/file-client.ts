// /src/services/file-client.ts
"use client"

import type { FileItem } from "@/types/file"

export async function getFiles(path: string): Promise<FileItem[]> {
  const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`)
  if (!res.ok) {
    throw new Error("Failed to fetch files.")
  }
  const json = await res.json()
  return json.files as FileItem[]
}

export async function toggleIndex(fileId: string): Promise<void> {
  const res = await fetch("/api/file", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileId, toggleIndex: true }),
  })
  if (!res.ok) {
    throw new Error("Failed to toggle index on file.")
  }
}

// For the new "delete" action in ActionMenu
export async function deleteFiles(fileIds: string[]): Promise<void> {
  // Suppose you pass them in the request body
  const res = await fetch("/api/file", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileIds }),
  })
  if (!res.ok) {
    throw new Error("Failed to delete files.")
  }
}
