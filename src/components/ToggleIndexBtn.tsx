import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X } from "lucide-react";

interface ToggleIndexBtnProps {
  isIndexed: boolean;
  onToggle: () => void;
}

export const ToggleIndexBtn: React.FC<ToggleIndexBtnProps> = ({
  isIndexed,
  onToggle,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click event
  };

  const handleToggle = (e: React.MouseEvent) => {
    handleClick(e);
    onToggle();
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-fit h-fit p-1 hover:bg-neutral-500/20"
            onClick={handleClick}
          >
            {isIndexed ? (
              <Check className="text-green-500" />
            ) : (
              <X className="text-red-500" />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to {isIndexed ? "de-index" : "index"} this
            item from the knowledge base?
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleClick}>
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleToggle}>Confirm</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
