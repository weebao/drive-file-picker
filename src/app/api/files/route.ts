import { NextResponse } from "next/server";
import { FileSession } from "@/lib/server/FileSession";

const session = new FileSession();

// GET /api/files?resourceId=...&kbId=...&resourcePath=...
export const GET = async (request: Request) => {
  if (!session.initialized) {
    await session.init();
  }
  try {
    const url = new URL(request.url);
    const kbId = url.searchParams.get("kbId");
    if (kbId) {
      const resourcePath = url.searchParams.get("resourcePath") ?? "/";
      const files = await session.getResourceFromKb(kbId, resourcePath);
      return NextResponse.json(files);
    }
    const resourceId = url.searchParams.get("resourceId");
    const files = await session.getResource(resourceId ?? undefined);
    return NextResponse.json(files);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// POST /api/files (body: resourceIds)
export const POST = async (request: Request) => {
  if (!session.initialized) {
    await session.init();
  }
  try {
    const { resourceIds } = await request.json();
    if (!Array.isArray(resourceIds)) {
      throw new Error("resourceIds must be an array");
    }
    const kbId = await session.createKb(resourceIds);
    return NextResponse.json({ kbId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// DELETE /api/files?resourcePath=...&kbId=...
export const DELETE = async (request: Request) => {
  if (!session.initialized) {
    await session.init();
  }
  try {
    const url = new URL(request.url);
    const kbId = url.searchParams.get("kbId");
    const resourcePath = url.searchParams.get("resourcePath");
    if (!kbId || !resourcePath) {
      throw new Error("kbId and resourcePath are required");
    }
    await session.deleteResourceFromKb(kbId, resourcePath);
    return NextResponse.json({ message: "Resource deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
