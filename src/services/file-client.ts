"use client"

import type { FileItem } from "@/types/file"

// 1) GET files from /api/file?path=...
export async function getFiles(path: string): Promise<FileItem[]> {
  const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`)
  if (!res.ok) {
    throw new Error("Failed to fetch files.")
  }
  const json = await res.json()
  return json.files as FileItem[]
}

// 2) Toggle "isIndexed" (or other updates). POST /api/file
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
