"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useKnowledgeBaseContext } from "@/context/KnowledgeBaseContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KnowledgeBaseSelectProps {
  onCreateKb: () => void;
  onSelect: (val: string) => void;
}

export const KnowledgeBaseSelect: React.FC<KnowledgeBaseSelectProps> = ({
  onCreateKb,
  onSelect,
}) => {
  const {
    kbList,
    setKbList,
    isCreating,
    setIsCreating,
    isSelecting,
    setIsSelecting,
    selectedKb,
    setSelectedKb,
  } = useKnowledgeBaseContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedKb && kbList.length > 0) {
      const rootKb = kbList.find((kb) => kb === "Root (Google Drive)");
      if (rootKb) {
        setSelectedKb(rootKb);
      }
    }
  }, [kbList, selectedKb, setSelectedKb]);

  if (!isSelecting) {
    return (
      <Select
        value={selectedKb ?? "root"}
        onValueChange={(val) => {
          if (val === "new") {
            setIsSelecting(true);
            return;
          }

          onSelect(val);
          if (val === "root") {
            setSelectedKb(null);
          } else {
            const chosen = kbList.find((kb) => kb === val);
            if (chosen) setSelectedKb(chosen);
          }
        }}
      >
        <SelectTrigger className="w-64">
          <SelectValue
            placeholder="Select a knowledge base"
            className="select-none"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="root" value="root">
            Root (Google Drive)
          </SelectItem>
          {kbList.map((kb) => (
            <SelectItem key={kb} value={kb}>
              {kb}
            </SelectItem>
          ))}
          <SelectItem value="new">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Plus className="w-4 h-4 text-secondary-foreground" />
              <span>Create new knowledge base</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm">Please select files for indexing</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSelecting(false)}
        >
          Cancel
        </Button>
        <Button size="sm" onClick={onCreateKb}>
          {isCreating ? <Loader2 className="animate-spin" /> : "Confirm"}
        </Button>
      </div>
    </div>
  );
};
