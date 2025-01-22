"use client"

import { useState } from "react"
import type { NavigationState, NavigationActions } from "@/types/navigation"

export function useNavigation(initialPath = "/"): NavigationState & NavigationActions {
  const [currentPath, setCurrentPath] = useState(initialPath)
  const [history, setHistory] = useState([initialPath])
  const [historyIndex, setHistoryIndex] = useState(0)

  const navigateToFolder = (path: string) => {
    setCurrentPath(path)
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), path])
    setHistoryIndex((prev) => prev + 1)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setCurrentPath(history[historyIndex - 1])
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setCurrentPath(history[historyIndex + 1])
    }
  }

  return {
    currentPath,
    history,
    historyIndex,
    navigateToFolder,
    goBack,
    goForward,
  }
}
