"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { FileItem } from "@/types/file";

interface FileManagerProviderProps {
  children: React.ReactNode;
}

interface FileManagerContextValue {
  files: FileItem[];
  setFiles: (files: FileItem[]) => void
  displayed: FileItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FileManagerContext = createContext<FileManagerContextValue | undefined>(
  undefined,
);

export const FileManagerProvider: React.FC<FileManagerProviderProps> = ({
  children,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const displayed = useMemo(() => {
    if (!files) return [];
    return files
      .filter((f) => f.path !== "/")
      .filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [files, searchQuery]);

  const value: FileManagerContextValue = {
    files,
    setFiles,
    displayed,
    searchQuery,
    setSearchQuery,
  };

  return (
    <FileManagerContext.Provider value={value}>
      {children}
    </FileManagerContext.Provider>
  );
};

export const useFileManagerContext = () => {
  const ctx = useContext(FileManagerContext);
  if (!ctx) {
    throw new Error(
      "useFileManagerContext must be used within a <FileManagerProvider>",
    );
  }
  return ctx;
};
