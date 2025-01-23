// app/providers.jsx
"use client";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FileManagerProvider } from "@/context/FileManagerContext";
import { KnowledgeBaseProvider } from "@/context/KnowledgeBaseContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <KnowledgeBaseProvider>
        <FileManagerProvider>{children}</FileManagerProvider>
      </KnowledgeBaseProvider>
    </QueryClientProvider>
  );
}
