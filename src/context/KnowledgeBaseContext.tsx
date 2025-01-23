"use client";
import React, { createContext, useContext, useState } from "react";

interface KnowledgeBaseContextValue {
  selectedKb: string | null;
  setSelectedKb: (kb: string | null) => void;
  kbList: string[];
  setKbList: (kbList: string[]) => void;
  isCreating: boolean;
  setIsCreating: (value: boolean) => void;
  isSelecting: boolean;
  setIsSelecting: (value: boolean) => void;
}

const KnowledgeBaseContext = createContext<
  KnowledgeBaseContextValue | undefined
>(undefined);

export const KnowledgeBaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedKb, setSelectedKb] = useState<string | null>(null);
  const [kbList, setKbList] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  return (
    <KnowledgeBaseContext.Provider
      value={{
        selectedKb,
        setSelectedKb,
        kbList,
        setKbList,
        isCreating,
        setIsCreating,
        isSelecting,
        setIsSelecting,
      }}
    >
      {children}
    </KnowledgeBaseContext.Provider>
  );
};

export const useKnowledgeBaseContext = () => {
  const ctx = useContext(KnowledgeBaseContext);
  if (!ctx) {
    throw new Error("KnowledgeBaseContext must be used within its provider");
  }
  return ctx;
};
