import { NextResponse } from "next/server"
import { google } from "googleapis"
import type { FileItem } from "@/types/file"
import { mockFiles } from "@/data/mock-files"

function isUsingGoogleDrive() {
  return process.env.USE_GOOGLE_DRIVE === "true"
}

// Example helper: Google Drive fetch
async function getGoogleDriveFiles(path: string): Promise<FileItem[]> {
  // In a real app, path might be a folder ID. We'll ignore for demonstration
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  })
  const drive = google.drive({ version: "v3", auth })

  const res = await drive.files.list({
    pageSize: 10,
    fields: "files(id, name, mimeType, modifiedTime)",
  })

  const googleFiles = res.data.files || []
  return googleFiles.map((gf) => ({
    id: gf.id || "",
    name: gf.name || "Untitled",
    kind: gf.mimeType?.includes("folder") ? "Folder" : "File",
    path: `/${gf.name}`,
    dateModified: gf.modifiedTime || new Date().toISOString(),
    isIndexed: false,
  }))
}

// Example helper: Mock fetch
function getMockFiles(path: string): FileItem[] {
  if (path === "/") {
    return mockFiles.filter(
      (f) => f.path.split("/").filter(Boolean).length <= 1
    )
  }
  return mockFiles.filter(
    (f) => f.path.startsWith(path + "/") || f.path === path
  )
}

// GET /api/file?path=/...
// Return list of files from either Google or Mock
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path") || "/"

    let files: FileItem[]
    if (isUsingGoogleDrive()) {
      files = await getGoogleDriveFiles(path)
    } else {
      files = getMockFiles(path)
    }

    return NextResponse.json({ files })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/file
// Example: toggling isIndexed or other updates (mock only)
export async function POST(request: Request) {
  try {
    // In real world, you'd parse and do real updates
    const body = await request.json()
    const { fileId, toggleIndex } = body
    // For demonstration, we do nothing. Return success:
    return NextResponse.json({ success: true, fileId })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
