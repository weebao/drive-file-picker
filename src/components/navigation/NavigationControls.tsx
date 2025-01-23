"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationControlsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
}

// Single responsibility: present "back" and "forward" controls
export function NavigationControls({
  canGoBack,
  canGoForward,
  onBack,
  onForward,
}: NavigationControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        disabled={!canGoBack}
        onClick={onBack}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={!canGoForward}
        onClick={onForward}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
