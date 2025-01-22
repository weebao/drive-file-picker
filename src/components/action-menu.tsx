"use client";

import React, { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useMutation } from "@tanstack/react-query";
import { deleteFiles } from "@/services/file-client"; // example function in file-client
import { Button } from "@/components/ui/button";

interface ActionMenuProps {
  children: React.ReactNode;
  selectedIds: string[];
  onSelect: (ids: string[]) => void; // used to highlight a row on right-click
}

/**
 * Wrap your table or grid in <ActionMenu> so that right-click triggers this context menu.
 * When user right-clicks, we highlight that item if not already selected.
 */
export const ActionMenu: React.FC<ActionMenuProps> = ({
  children,
  selectedIds,
  onSelect,
}) => {
  // Example: delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (fileIds: string[]) => {
      await deleteFiles(fileIds); // or renameFiles, etc.
    },
    onSuccess: () => {
      console.log("Deleted successfully");
    },
  });

  const handleContextMenuItemClick = (action: string) => {
    switch (action) {
      case "delete":
        deleteMutation.mutate(selectedIds);
        break;
      case "rename":
        console.log("Rename selected", selectedIds);
        break;
      default:
        break;
    }
  };

  // Minimal approach to highlight whichever item was right-clicked
  const onRightClickItem = (itemId: string) => {
    // If itemId not in selected, we set selected to [itemId]
    // Or if you want to keep current selection, you can do something else.
    if (!selectedIds.includes(itemId)) {
      onSelect([itemId]);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => handleContextMenuItemClick("delete")}>
          Delete
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleContextMenuItemClick("rename")}>
          Rename
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

/**
 * Exports a helper so you can call e.preventDefault() on row right-click and highlight that row.
 */
export const onRightClickRow = (
  e: React.MouseEvent,
  itemId: string,
  selectedIds: string[],
  onSelect: (ids: string[]) => void,
) => {
  e.preventDefault();
  // highlight this row if not selected
  if (!selectedIds.includes(itemId)) {
    onSelect([itemId]);
  }
};
