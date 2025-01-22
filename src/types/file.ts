// Single responsibility: store the file item shape + sorting fields
export interface FileItem {
  id: string
  name: string
  kind: "File" | "Folder"
  path: string
  dateModified: string
  isIndexed: boolean
  thumbnail?: string
}

// Sorting fields for demonstration
export type SortField = "name" | "dateModified" | "kind"
export type SortDirection = "asc" | "desc"
