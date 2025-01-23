import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  length?: number;
  type?: "list" | "grid";
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  length = 5,
  type = "list",
}) => {
  if (type === "list") {
    return (
      <div className="space-y-2">
        {Array.from({ length }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (type === "grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
};
