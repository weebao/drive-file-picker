"use client";

import { useState } from "react";
import { Grid, List, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SearchBar } from "./search-bar";
import { Button } from "@/components/ui/button";
import type { ViewMode } from "@/types/view";

interface ToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Single responsibility: top-level toolbar with toggle for grid/list + search
export function Toolbar({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
}: ToolbarProps) {
  const [searchVisible, setSearchVisible] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value: string) => onViewModeChange(value as ViewMode)}
      >
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <Grid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      {searchVisible ? (
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClose={() => setSearchVisible(false)}
        />
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchVisible(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
