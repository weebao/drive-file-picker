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
import type { FolderItem, RootData } from "@/types/file";

import { useFiles } from "@/hooks/useFiles";
import { useNavigation } from "@/hooks/useNavigation";
import { TableSkeleton } from "./TableSkeleton";

export default function FileManager() {
  const [root, setRoot] = useState<RootData>({ id: "", path: "/" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { setFiles, searchQuery, setSearchQuery } = useFileManagerContext();
  const { isSelecting } = useKnowledgeBaseContext();
  const {
    files,
    isLoading,
    isRefetching,
    isSuccess,
    isError,
    reload,
    removeIndex,
    createKb,
  } = useFiles(root, setRoot);
  const {
    currentPath,
    history,
    historyIndex,
    navigate,
    navigateWithPath,
    goBack,
    goForward,
  } = useNavigation(setRoot);

  useEffect(() => {
    if (!isSelecting) {
      setSelectedIds([]);
    }
  }, [isSelecting]);

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
          <FileBreadcrumb path={currentPath} onNavigate={navigateWithPath} />
          <div className="ml-auto">
            <Toolbar
              viewMode={viewMode}
              searchQuery={searchQuery}
              isRefetching={isRefetching}
              onViewModeChange={setViewMode}
              onSearchChange={setSearchQuery}
              onCreateKb={() => createKb(selectedIds)}
              resetRoot={() => setRoot({ id: "", path: "/" })}
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
            onNavigate={navigate}
            removeIndex={removeIndex}
          />
        ) : (
          <GridView
            isSelecting={isSelecting}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onNavigate={navigate}
            removeIndex={removeIndex}
          />
        )}
      </div>
    </div>
  );
}
