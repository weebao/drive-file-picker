import { NextResponse } from "next/server";

class DriveSession {
  private headers: Record<string, string> = {};
  private resourceUrl: string = "";
  initialized = false;

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    // Fetch token from Supabase
    const supabaseUrl = `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`;
    const authRes = await fetch(supabaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Apikey: process.env.API_KEY ?? "api-key",
      },
      body: JSON.stringify({
        email: process.env.AUTH_EMAIL,
        password: process.env.AUTH_PASSWORD,
        gotrue_meta_security: {},
      }),
    });
    if (!authRes.ok) {
      throw new Error("Failed to authenticate");
    }

    const authData = await authRes.json();
    this.headers = {
      Authorization: `Bearer ${authData.access_token}`,
      "Content-Type": "application/json",
    };

    // Fetch connections
    const connectionsUrl = `${process.env.AUTH_URL}/connections?connection_provider=gdrive&limit=1`;
    const connectionsRes = await fetch(connectionsUrl, {
      headers: this.headers,
    });
    if (!connectionsRes.ok) {
      throw new Error("Failed to fetch connections");
    }

    const connections = await connectionsRes.json();
    if (connections.length === 0) {
      throw new Error("No connections found");
    }
    const connectionId = connections[0].connection_id;

    // Set resource url
    this.resourceUrl = `${process.env.AUTH_URL}/connections/${connectionId}/resources/children`;
  }

  async getResource(resourceId?: string | null): Promise<any[]> {
    const url = resourceId
      ? `${this.resourceUrl}?resource_id=${resourceId}`
      : `${this.resourceUrl}`;
    const res = await fetch(url, { headers: this.headers });
    if (!res.ok) {
      throw new Error("Failed to fetch resources");
    }
    return (await res.json()).data;
  }
}

const driveSession = new DriveSession();

// GET /api/drive?resourceId=/...
export const GET = async (request: Request) => {
  if (!driveSession.initialized) {
    await driveSession.init();
  }
  try {
    const url = new URL(request.url);
    const resourceId = url.searchParams.get("resourceId");
    const files = await driveSession.getResource(resourceId);
    console.log(files);
    // const files: any[] = [];
    return NextResponse.json(files);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// POST /api/file
// Example: toggling "isIndexed" or other updates
// export const POST = async (request: Request) => {
//   try {
//     const body = await request.json();
//     const { fileId, toggleIndex } = body;
//     // In a real app, you'd do a DB or Google call to toggle
//     // We'll just respond with success
//     return NextResponse.json({ success: true, fileId, toggled: toggleIndex });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// };

// let driveInitialized = false;
// let driveSession: DriveSession;

// class DriveSession {
//   private accessToken = "";
//   private orgId = "";
//   private headers: Record<string, string> = {};
//   private connectionId = "";

//   constructor() {
//     // ...existing code...
//   }

//   async init() {
//     if (driveInitialized) return;
//     driveInitialized = true;

//     // 1) Get auth token from Supabase
//     // ...existing code...
//     // Suppose we do something like:
//     const authRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", "Apikey": process.env.API_KEY },
//       body: JSON.stringify({ email: process.env.AUTH_EMAIL, password: process.env.AUTH_PASSWORD }),
//     })
//     this.accessToken = authData.access_token

//     // 2) Get orgId from /organizations/me/current
//     // ...existing code...
//     // this.orgId = orgJson.org_id

//     // 3) Prepare this.headers, e.g.:
//     // this.headers = { Authorization: `Bearer ${this.accessToken}`, "Content-Type": "application/json" }

//     // 4) List connections from /connections?connection_provider=gdrive
//     // ... set this.connectionId = connections[0].connection_id ...
//   }

//   getOrgId(): string {
//     return this.orgId;
//   }

//   async getResource(resourceId?: string): Promise<any[]> {
//     // If no resourceId, fetch root with /connections/{connectionId}/resources/children
//     // Else use /connections/{connectionId}/resources or /children?resource_id=...
//     // Example (similar to ipynb):
//     // const url = resourceId
//     //   ? `${process.env.AUTH_URL}/connections/${this.connectionId}/resources/children?resource_id=${resourceId}`
//     //   : `${process.env.AUTH_URL}/connections/${this.connectionId}/resources/children`;
//     // const res = await fetch(url, { headers: this.headers });
//     // return (await res.json()).data;
//     return [];
//   }
// }

// Initialize session immediately
// (async () => {
//   driveSession = new DriveSession();
//   await driveSession.init();
// })().catch(console.error);

// GET /api/file?path=...
// export const GET = async (request: Request) => {
//   // ...existing code...
//   return NextResponse.json({ /* ...existing code... */ });
// };

// // POST /api/file
// export const POST = async (request: Request) => {
//   // ...existing code...
//   return NextResponse.json({ /* ...existing code... */ });
// };

// ...existing code...
