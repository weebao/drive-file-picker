import type { FileItem } from "@/types/file"
import { mockFiles } from "@/data/mock-files"
import { GoogleDriveFileService } from "./google-drive-service"

// An interface describing how a file service should behave (DIP).
export interface IFileService {
  getFiles(path: string): Promise<FileItem[]>
}

// A mock file service for local usage.
class MockFileService implements IFileService {
  async getFiles(path: string): Promise<FileItem[]> {
    if (path === "/") {
      return mockFiles.filter(
        (f) => f.path.split("/").filter(Boolean).length <= 1
      )
    }
    return mockFiles.filter(
      (f) => f.path.startsWith(path + "/") || f.path === path
    )
  }
}

// Simple factory that returns either a mock or Google Drive service
export class FileServiceFactory {
  static getFileService(): IFileService {
    // For demonstration, we’ll assume “GoogleDriveFileService” is the main one:
    // return new GoogleDriveFileService()

    // Or use a mock for local dev:
    // return new MockFileService()

    // If you want to choose based on environment:
    const useDrive = false
    return useDrive ? new GoogleDriveFileService() : new MockFileService()
  }
}
