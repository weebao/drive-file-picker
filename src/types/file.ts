export type FileKind =
  | "Text"
  | "PDF"
  | "Video"
  | "Audio"
  | "Image"
  | "Spreadsheet"
  | "Presentation"
  | "Archive"
  | "Code"
  | "Folder";

export type FileIndexStatus =
  | "indexed"
  | "pending"
  | "pending_delete"
  | "deleted";

export interface FileItem {
  id: string;
  name: string;
  extension: string;
  kind: FileKind;
  path: string;
  lastModified: string;
  status?: FileIndexStatus;
  webUrl?: string;
  resourceId?: string;
}

export interface FolderItem extends FileItem {
  kind: "Folder";
}

export interface RootData {
  id: string;
  path: string;
}
