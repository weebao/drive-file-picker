import { FileKind } from "@/types/file";

const extensionToKindMap: Record<string, FileKind> = {
  ".txt": "Text",
  ".docx": "Text",
  ".pdf": "PDF",
  ".mp4": "Video",
  ".mp3": "Audio",
  ".jpg": "Image",
  ".png": "Image",
  ".xlsx": "Spreadsheet",
  ".pptx": "Presentation",
  ".zip": "Archive",
  ".html": "Code",
  ".css": "Code",
  ".js": "Code",
  ".json": "Code",
  ".xml": "Code",
  ".csv": "Spreadsheet",
};

export const getKind = (extension: string): FileKind => {
  return extensionToKindMap[extension] || "File";
}