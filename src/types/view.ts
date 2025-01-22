export type ViewMode = "grid" | "list"
export type SortField = "name" | "dateModified" | "kind"
export type SortDirection = "asc" | "desc"

export interface SortState {
  field: SortField
  direction: SortDirection
}

