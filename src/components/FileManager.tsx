"use client";

import { useEffect, useState } from "react";

import { useFileManagerContext } from "@/context/FileManagerContext";
import { useKnowledgeBaseContext } from "@/context/KnowledgeBaseContext";

import { NavigationControls } from "@/components/navigation/NavigationControls";
import { FileBreadcrumb } from "@/components/navigation/FileBreadcrumb";
import { ListView } from "@/components/view/ListView";
import { GridView } from "@/components/view/GridView";
import { Skeleton } from "@/components/ui/skeleton";
import { Toolbar } from "./Toolbar";

import type { ViewMode } from "@/types/view";
import type {
  SortField,
  SortDirection,
  FileItem,
  FolderItem,
} from "@/types/file";

import { useFiles } from "@/hooks/useFiles";
import { useNavigation } from "@/hooks/useNavigation";
import { TableSkeleton } from "./TableSkeleton";
import { createKnowledgeBase } from "@/services/KnowledgeBaseService";

export default function FileManager() {
  const {
    root,
    files,
    setRoot,
    isLoading,
    isRefetching,
    isSuccess,
    isError,
    reload,
  } = useFiles();
  const { setFiles, searchQuery, setSearchQuery } = useFileManagerContext();
  const {
    kbList,
    isCreating,
    isSelecting,
    setIsCreating,
    setIsSelecting,
    setKbList,
    setSelectedKb,
  } = useKnowledgeBaseContext();
  const {
    currentPath,
    history,
    historyIndex,
    navigateToFolder,
    goBack,
    goForward,
  } = useNavigation();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [visitedPaths, setVisitedPaths] = useState<Record<string, FolderItem>>(
    {},
  );
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  useEffect(() => {
    if (isSuccess || !isRefetching) {
      setFiles(files);
    }
  }, [isSuccess, isRefetching, setFiles]);

  useEffect(() => {
    if (!isSelecting) {
      setSelectedIds([]);
    }
  }, [isSelecting]);

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

  const handleCreateKb = async () => {
    setIsCreating(true);
    const kbId = await createKnowledgeBase(selectedIds);
    console.log(kbId);
    setSelectedKb(kbId);
    setKbList([...kbList, kbId]);
    setIsCreating(false);
    setIsSelecting(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-background">
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
              searchQuery={searchQuery}
              isRefetching={isRefetching}
              onViewModeChange={setViewMode}
              onSearchChange={setSearchQuery}
              onCreateKb={handleCreateKb}
              reload={reload}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <TableSkeleton type={viewMode} />
        ) : isError ? (
          <div className="text-red-500">Error loading files!</div>
        ) : viewMode === "list" ? (
          <ListView
            isSelecting={isSelecting}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onNavigate={handleNavigateToFolder}
          />
        ) : (
          <GridView
            isSelecting={isSelecting}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onNavigate={handleNavigateToFolder}
          />
        )}
      </div>
    </div>
  );
}
