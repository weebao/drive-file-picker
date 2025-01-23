"use client";

import { RootData } from "@/types/file";
import { useState } from "react";

export const useNavigation = (navigateCallback = (root: RootData) => {}) => {
  const [currentPath, setCurrentPath] = useState("/");
  const [history, setHistory] = useState<RootData[]>([{ id: "", path: "/" }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigate = (id: string, path: string) => {
    console.log("nav", path);
    setCurrentPath(path);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), { id, path }]);
    setHistoryIndex((prev) => prev + 1);
    navigateCallback({ id, path });
  };

  const navigateWithPath = (path: string) => {
    console.log(path);
    const id = history.find((h) => h.path === path)?.id || "";
    navigate(id, path);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setCurrentPath(history[historyIndex - 1].path);
      navigateCallback(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setCurrentPath(history[historyIndex + 1].path);
      navigateCallback(history[historyIndex + 1]);
    }
  };

  return {
    currentPath,
    history,
    historyIndex,
    navigate,
    navigateWithPath,
    goBack,
    goForward,
  };
};
