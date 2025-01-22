import { NextResponse } from "next/server"
import type { FileItem } from "@/types/file"
import { mockFiles } from "@/data/mock-files"
import { google } from "googleapis"

// We expect the following ENV variables to exist (for demonstration):
// AUTH_EMAIL, AUTH_PASSWORD, AUTH_URL, SUPABASE_URL, API_KEY
// Real usage would handle them carefully and securely.

function isUsingGoogleDrive() {
  // In a real app, you might do something more robust
  return process.env.USE_GOOGLE_DRIVE === "true"
}

// 1) Fetch "connections" from a hypothetical Supabase endpoint
async function fetchConnectionsFromSupabase(): Promise<any[]> {
  const email = process.env.AUTH_EMAIL || ""
  const password = process.env.AUTH_PASSWORD || ""
  const supabaseUrl = process.env.SUPABASE_URL || ""
  const apiKey = process.env.API_KEY || ""

  console.log(email, password, supabaseUrl, apiKey)

  // 1) Post to supabase with email+password (fake example)
  //    In reality, you'd do real supabase auth or something else:
  const authRes = await fetch(`${supabaseUrl}/auth/v1/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
    },
    body: JSON.stringify({ email, password }),
  })
  if (!authRes.ok) {
    throw new Error("Failed to auth with supabase.")
  }
  const authData = await authRes.json()

  // 2) Then fetch from AUTH_URL/connections with that token or something
  const authUrl = process.env.AUTH_URL || ""
  const connectionsRes = await fetch(`${authUrl}/connections`, {
    headers: {
      Authorization: `Bearer ${authData.access_token || "fake_token"}`,
    },
  })
  if (!connectionsRes.ok) {
    throw new Error("Failed to fetch connections from AUTH_URL.")
  }
  return connectionsRes.json()
}

// 2) Using the "first connection" to fetch Google Drive files (mock example)
async function getDriveFilesWithConnection(): Promise<FileItem[]> {
  const connections = await fetchConnectionsFromSupabase()
  if (!Array.isArray(connections) || !connections.length) {
    throw new Error("No connections available.")
  }
  // We'll assume the first connection is relevant:
  const conn = connections[0]
  // Then do actual google drive logic (for demonstration):
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  })
  const drive = google.drive({ version: "v3", auth })
  // Suppose conn stores the folder ID, or we just do a generic fetch:
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

function getMockFiles(path: string): FileItem[] {
  if (path === "/") {
    return mockFiles.filter(
      (f) => f.path.split("/").filter(Boolean).length <= 1
    )
  }
  return mockFiles.filter((f) => f.path.startsWith(path + "/") || f.path === path)
}

// GET /api/file?path=/...
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const path = url.searchParams.get("path") || "/"

    let files: FileItem[]

    if (isUsingGoogleDrive()) {
      // 1) Use Supabase + Auth to get connections, pick the first
      // 2) Then fetch from Google Drive
      // files = await getDriveFilesWithConnection()
      try {
        console.log(await getDriveFilesWithConnection())
      } catch (err: any) {
        console.log(err.message)
      }
      await new Promise((resolve) => setTimeout(resolve, 3000))
      files = getMockFiles(path)
    } else {
      // fallback to mock
      files = getMockFiles(path)
    }

    return NextResponse.json({ files })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/file
// Example: toggling "isIndexed" or other updates
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fileId, toggleIndex } = body
    // In a real app, you'd do a DB or Google call to toggle
    // We'll just respond with success
    return NextResponse.json({ success: true, fileId, toggled: toggleIndex })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
