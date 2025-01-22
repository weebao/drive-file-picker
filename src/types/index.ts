export interface File {
  id: string
  name: string
  kind: "File" | "Folder"
  dateModified: string
  path: string
  isIndexed: boolean
  thumbnail?: string
}

export interface BreadcrumbItem {
  name: string
  path: string
}

export type ViewMode = "grid" | "list"
export type SortField = "name" | "dateModified" | "kind"
export type SortDirection = "asc" | "desc"

