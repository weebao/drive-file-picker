import { FolderItem } from "./file";

export interface NavigationState {
  currentPath: string;
  history: string[];
  historyIndex: number;
}

export interface NavigationActions {
  navigateToFolder: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
}
