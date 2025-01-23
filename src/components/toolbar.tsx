"use client";

import { useEffect, useState } from "react";
import { Grid, List, Search, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SearchBar } from "./SearchBar";

import type { ViewMode } from "@/types/view";
import { KnowledgeBaseSelect } from "./KnowledgeBaseSelect";
import { cn } from "@/lib/client/utils";

interface ToolbarProps {
  viewMode: ViewMode;
  searchQuery: string;
  isRefetching?: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onSearchChange: (query: string) => void;
  onCreateKb: () => void;
  resetRoot: () => void;
  reload: () => void;
}

// Single responsibility: top-level toolbar with toggle for grid/list + search
export function Toolbar({
  viewMode,
  searchQuery,
  isRefetching,
  onViewModeChange,
  onSearchChange,
  onCreateKb,
  resetRoot,
  reload,
}: ToolbarProps) {
  const [searchVisible, setSearchVisible] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-2">
        <KnowledgeBaseSelect onCreateKb={onCreateKb} onSelect={resetRoot} />

        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value: string) => onViewModeChange(value as ViewMode)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Grid View</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>List View</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isRefetching}
              onClick={() => reload()}
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefetching ? "animate-spin" : "")}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reload</p>
          </TooltipContent>
        </Tooltip>

        {searchVisible ? (
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClose={() => {
              onSearchChange("");
              setSearchVisible(false);
            }}
          />
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchVisible(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Search</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
