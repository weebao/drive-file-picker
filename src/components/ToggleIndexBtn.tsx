import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

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
  onRemove: () => void;
}

export const ToggleIndexBtn: React.FC<ToggleIndexBtnProps> = ({
  className,
  status,
  onRemove,
}) => {
  const [open, setOpen] = useState(false);

  const skipParent = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleOpen = (e: React.MouseEvent) => {
    skipParent(e);
    setOpen(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleClose = (e: React.MouseEvent) => {
    skipParent(e);
    setOpen(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    skipParent(e);
    onRemove();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild className={className}>
                <Button
                  variant="ghost"
                  className="w-fit h-fit ml-2 p-1 hover:bg-neutral-500/20"
                  onClick={status === "indexed" ? handleOpen : skipParent}
                >
                  {status === "indexed" ? (
                    <Check className="text-green-500" />
                  ) : status === "pending" ? (
                    <div className="m-1 w-2 h-2 bg-yellow-500 rounded-full" />
                  ) : (
                    <div className="m-1 w-2 h-2 bg-gray-400 rounded-full" />
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
        <DialogContent onClick={skipParent}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this item from the knowledge base?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleToggle}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
