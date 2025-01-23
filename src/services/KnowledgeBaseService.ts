import { processFile } from "@/lib/client/utils";
import type { FileItem } from "@/types/file";

export async function createKnowledgeBase(
  resourceIds: string[],
): Promise<string> {
  const res = await fetch(`/api/files`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resourceIds }),
  });
  if (!res.ok) {
    throw new Error("Failed to create knowledge base.");
  }
  return (await res.json()).kbId;
}

export async function getFilesFromKb(
  kbId: string,
  resourcePath: string = "/",
): Promise<FileItem[]> {
  const queryParams = `?kbId=${kbId}&resourcePath=${resourcePath}`;
  const res = await fetch(`/api/files${queryParams}`);
  if (!res.ok) {
    throw new Error("Failed to fetch files from knowledge base.");
  }
  const data = await res.json();
  return data.map((fileData: any) => processFile(fileData)) as FileItem[];
}

export async function removeFileFromKb(
  kbId: string,
  resourcePath: string,
): Promise<{ message: string }> {
  const queryParams = `?kbId=${kbId}&resourcePath=${resourcePath}`;
  const res = await fetch(`/api/files${queryParams}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to remove file from knowledge base.");
  }
  return await res.json();
}
