// Single responsibility: describe the shape of navigation state & actions

export interface NavigationState {
  currentPath: string
  history: string[]
  historyIndex: number
}

export interface NavigationActions {
  navigateToFolder: (path: string) => void
  goBack: () => void
  goForward: () => void
}
