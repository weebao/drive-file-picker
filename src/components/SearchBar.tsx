"use client";

import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export function SearchBar({ value, onChange, onClose }: SearchBarProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search files..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-8"
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
