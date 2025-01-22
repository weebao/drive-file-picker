"use client";

import React, { useRef, useState } from "react";

interface DragSelectionAreaProps {
  children: React.ReactNode;
  items: string[]; // all item IDs
  onSelect: (selectedIds: string[]) => void;
}

/**
 * Minimal example: click & drag to select items by ID.
 * You must manually mark items "onMouseDown", "onMouseOver", etc. (see list-view / grid-view usage).
 */
export const DragSelectionArea: React.FC<DragSelectionAreaProps> = ({
  children,
  items,
  onSelect,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const selectedRef = useRef<string[]>([]);

  const handleMouseUp = () => {
    setIsDragging(false);
    selectedRef.current = [];
  };

  const handleItemMouseDown = (id: string) => {
    setIsDragging(true);
    selectedRef.current = [id]; // start with this item
    onSelect([...selectedRef.current]);
  };

  const handleItemMouseOver = (id: string) => {
    if (isDragging) {
      if (!selectedRef.current.includes(id)) {
        selectedRef.current.push(id);
        onSelect([...selectedRef.current]);
      }
    }
  };

  return (
    <div onMouseUp={handleMouseUp} style={{ width: "100%", height: "100%" }}>
      {/*
        We *don't* automatically attach events to children items here.
        Instead, your list/grid items call handleItemMouseDown, handleItemMouseOver, etc.
      */}
      {children}
    </div>
  );
};

/**
 * Exports some callbacks for the parent to attach to each item.
 */
export const useDragSelectionEvents = (
  areaRef: React.RefObject<HTMLDivElement>,
  onSelect: (selectedIds: string[]) => void,
) => {
  // For a real bounding-box approach, you'd do more advanced logic here.
  // We'll rely on each item calling "onMouseDown" and "onMouseOver" manually.
  return {
    // We can expose placeholders if needed
  };
};
