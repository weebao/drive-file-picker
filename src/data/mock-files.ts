import type { FileItem } from "@/types/file"

export const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Documents",
    kind: "Folder",
    dateModified: "2023-04-15T10:30:00Z",
    path: "/Documents",
    isIndexed: true,
  },
  {
    id: "2",
    name: "Images",
    kind: "Folder",
    dateModified: "2023-04-14T15:45:00Z",
    path: "/Images",
    isIndexed: false,
  },
  {
    id: "3",
    name: "report.pdf",
    kind: "File",
    dateModified: "2023-04-13T09:20:00Z",
    path: "/report.pdf",
    isIndexed: true,
  },
  {
    id: "4",
    name: "presentation.pptx",
    kind: "File",
    dateModified: "2023-04-12T14:10:00Z",
    path: "/presentation.pptx",
    isIndexed: false,
  },
  {
    id: "5",
    name: "budget.xlsx",
    kind: "File",
    dateModified: "2023-04-11T11:05:00Z",
    path: "/budget.xlsx",
    isIndexed: true,
  },
  {
    id: "6",
    name: "avatar.jpg",
    kind: "File",
    dateModified: "2023-04-10T16:30:00Z",
    path: "/Images/avatar.jpg",
    isIndexed: false,
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kVicc5DJ6jUsgVIH8JPySMHQQ4BcZZ.png",
  },
  {
    id: "7",
    name: "Project Notes",
    kind: "Folder",
    dateModified: "2023-04-09T13:15:00Z",
    path: "/Documents/Project Notes",
    isIndexed: true,
  },
  {
    id: "8",
    name: "meeting_minutes.docx",
    kind: "File",
    dateModified: "2023-04-08T10:45:00Z",
    path: "/Documents/Project Notes/meeting_minutes.docx",
    isIndexed: true,
  },
  {
    id: "9",
    name: "logo.png",
    kind: "File",
    dateModified: "2023-04-07T09:00:00Z",
    path: "/Images/logo.png",
    isIndexed: true,
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kVicc5DJ6jUsgVIH8JPySMHQQ4BcZZ.png",
  },
  {
    id: "10",
    name: "Archive",
    kind: "Folder",
    dateModified: "2023-04-06T14:20:00Z",
    path: "/Archive",
    isIndexed: false,
  },
]

export function getMockFiles(path: string): FileItem[] {
  return mockFiles.filter((file) => {
    const filePath = file.path.split("/").slice(0, -1).join("/")
    return filePath === path || (path === "/" && file.path.split("/").length === 2)
  })
}

