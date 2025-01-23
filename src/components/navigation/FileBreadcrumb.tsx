"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { FolderItem } from "@/types/file";

interface FileBreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

// Single responsibility: display a navigable breadcrumb for the file path
export function FileBreadcrumb({ path, onNavigate }: FileBreadcrumbProps) {
  const segments = path.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => onNavigate("/")}>
            <Home className="h-4 w-4 cursor-pointer" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const currentPath = segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <React.Fragment key={currentPath}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    onClick={() => onNavigate(currentPath)}
                    className="cursor-pointer"
                  >
                    {segment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
