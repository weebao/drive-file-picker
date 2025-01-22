export type FileKind = "Text" | "PDF" | "Video" | "Audio" | "Image" | "Spreadsheet" | "Presentation" | "Archive" | "Code" | "Folder";

export interface FileItem {
  id: string;
  name: string;
  kind: FileKind;
  path: string;
  lastModified: string;
  isIndexed: boolean;
  webUrl?: string;
  resourceId?: string;
}

// Sorting fields for demonstration
export type SortField = "name" | "lastModified" | "kind";
export type SortDirection = "asc" | "desc";
