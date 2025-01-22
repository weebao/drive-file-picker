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

export interface FileItem {
  id: string;
  name: string;
  extension: string;
  kind: FileKind;
  path: string;
  lastModified: string;
  isIndexed: boolean;
  webUrl?: string;
  resourceId?: string;
}

export interface FolderItem extends FileItem {
  kind: "Folder";
}

// Sorting fields for demonstration
export type SortField = "name" | "lastModified" | "kind";
export type SortDirection = "asc" | "desc";
