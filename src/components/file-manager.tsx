"use client"

import { useState } from "react"
import { useNavigation } from "@/hooks/use-navigation"
import { NavigationControls } from "./navigation/navigation-controls"
import { FileBreadcrumb } from "./navigation/file-breadcrumb"
import { Toolbar } from "./toolbar"
import { ListView } from "./list-view"
import { GridView } from "./grid-view"
import { SearchBar } from "./search-bar"
import type { ViewMode } from "@/types/view"
import type { SortField, SortDirection } from "@/types/file"

// Single responsibility: orchestrates the file manager UI
export default function FileManager() {
  const {
    currentPath,
    history,
    historyIndex,
    navigateToFolder,
    goBack,
    goForward,
  } = useNavigation()

  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Switch field or toggle asc/desc
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header area */}
      <div className="border-b">
        <div className="flex items-center p-2 gap-2">
          <NavigationControls
            canGoBack={historyIndex > 0}
            canGoForward={historyIndex < history.length - 1}
            onBack={goBack}
            onForward={goForward}
          />
          <FileBreadcrumb path={currentPath} onNavigate={navigateToFolder} />
          <div className="ml-auto">
            <Toolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4">
        {/* <ListView
          path={currentPath}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          searchQuery={searchQuery}
          onNavigate={navigateToFolder}
        /> */}
        {viewMode === "list" ? (
          <ListView
            path={currentPath}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            searchQuery={searchQuery}
            onNavigate={navigateToFolder}
          />
        ) : (
          <GridView
            path={currentPath}
            searchQuery={searchQuery}
            onNavigate={navigateToFolder}
          />
        )}
      </div>
    </div>
  )
}
