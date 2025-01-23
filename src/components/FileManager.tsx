"use client";

import { useEffect, useState } from "react";

import { NavigationControls } from "@/components/navigation/NavigationControls";
import { FileBreadcrumb } from "@/components/navigation/FileBreadcrumb";
import { ListView } from "@/components/view/ListView";
import { GridView } from "@/components/view/GridView";
import { Skeleton } from "@/components/ui/skeleton";
import { Toolbar } from "./toolbar";

import type { ViewMode } from "@/types/view";
import type {
  SortField,
  SortDirection,
  FileItem,
  FolderItem,
} from "@/types/file";

import { useFiles } from "@/hooks/useFiles";
import { useNavigation } from "@/hooks/useNavigation";
import { useFileManagerContext } from "@/context/FileManagerContext";

// Single responsibility: orchestrates the file manager UI
export default function FileManager() {
  const { root, files, setRoot, isLoading, isSuccess, isError } = useFiles();
  const { setFiles, searchQuery, setSearchQuery } = useFileManagerContext();
  const {
    currentPath,
    history,
    historyIndex,
    navigateToFolder,
    goBack,
    goForward,
  } = useNavigation();
  const [visitedPaths, setVisitedPaths] = useState<Record<string, FolderItem>>(
    {},
  );

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    if (isSuccess) {
      setFiles(files);
    }
  }, [isSuccess, setFiles]);

  // Switch field or toggle asc/desc
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleNavigateToFolder = (folder: FolderItem) => {
    navigateToFolder(folder.path);
    setRoot(folder);
    setVisitedPaths((prev) => ({ ...prev, [folder.path]: folder }));
  };

  const handleBreadcrumbNavigate = (path: string) => {
    const folder = visitedPaths[path];
    if (folder) {
      navigateToFolder(folder.path);
      setRoot(folder);
    }
  };

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
          <FileBreadcrumb
            path={currentPath}
            onNavigate={handleBreadcrumbNavigate}
          />
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
        {isLoading ? (
          viewMode === "list" ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          )
        ) : isError ? (
          <div className="text-red-500">Error loading files!</div>
        ) : viewMode === "list" ? (
          <ListView
            root={root}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            searchQuery={searchQuery}
            onNavigate={handleNavigateToFolder}
          />
        ) : (
          <GridView
            root={root}
            path={currentPath}
            searchQuery={searchQuery}
            onNavigate={handleNavigateToFolder}
          />
        )}
      </div>
    </div>
  );
}
