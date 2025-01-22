import React from "react";
import {
  FileText,
  Image,
  AudioLines,
  Video,
  FileCode,
  FileType,
  FileSpreadsheet,
  FolderArchive,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const extensionToIcon: Record<string, { icon: LucideIcon, class: string }> = {
  ".txt": {
    icon: FileText,
    class: "text-black",
  },
  ".docx": {
    icon: FileType,
    class: "text-blue-500",
  },
  ".pdf": {
    icon: FileType,
    class: "text-red-300",
  },
  ".mp4": {
    icon: Video,
    class: "text-black",
  },
  ".mp3": {
    icon: AudioLines,
    class: "text-black",
  },
  ".jpg": {
    icon: Image,
    class: "text-black",
  },
  ".png": {
    icon: Image,
    class: "text-black",
  },
  ".xlsx": {
    icon: FileSpreadsheet,
    class: "text-green-600",
  },
  ".pptx": {
    icon: FileType,
    class: "text-orange-500",
  },
  ".zip": {
    icon: FolderArchive,
    class: "text-gray-500",
  },
  ".html": {
    icon: FileCode,
    class: "text-orange-500",
  },
  ".css": {
    icon: FileCode,
    class: "text-blue-500",
  },
  ".js": {
    icon: FileCode,
    class: "text-yellow-500",
  },
  ".json": {
    icon: FileCode,
    class: "text-brown-500",
  },
  ".xml": {
    icon: FileCode,
    class: "text-purple-500",
  },
  ".csv": {
    icon: FileSpreadsheet,
    class: "text-green-600",
  },
};

interface FileIconProps {
  extension: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ extension, className }) => {
  const { icon: Icon, class: colorClass } = extensionToIcon[extension] || { icon: FileType, class: "text-black" };
  return <Icon className={cn(className, colorClass)} />;
}