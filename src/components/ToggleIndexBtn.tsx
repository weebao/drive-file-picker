import { useState } from "react";
import { Check } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FileIndexStatus } from "@/types/file";

interface ToggleIndexBtnProps {
  className?: string;
  status?: FileIndexStatus;
  onToggle: () => void;
}

export const ToggleIndexBtn: React.FC<ToggleIndexBtnProps> = ({
  className,
  status,
  onToggle,
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click event
  };

  const handleOpen = (e: React.MouseEvent) => {
    handleClick(e);
    setOpen(true);
  };

  const handleToggle = (e: React.MouseEvent) => {
    handleClick(e);
    onToggle();
  };

  return (
    <>
      <Dialog open={open}>
        <DialogTrigger asChild >
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild className={className}>
                <Button
                  variant="ghost"
                  className="w-fit h-fit ml-2 p-2 hover:bg-neutral-500/20"
                  onClick={status === "indexed" ? handleOpen : handleClick}
                >
                  {status === "indexed" ? (
                    <Check className="text-green-500" />
                  ) : status === "pending" ? (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {status
                    ? status.charAt(0).toUpperCase() + status.slice(1)
                    : "Unknown"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this item from the knowledge base?
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
