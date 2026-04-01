import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/documents/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const document = await db.document.findUnique({
      where: { id, userId: session.user.id },
      include: {
        checks: {
          orderBy: { completedAt: "desc" },
          include: { matches: true },
        },
      },
    });
    if (!document) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ document });
  } catch {
    return Response.json({ error: "Failed to fetch document" }, { status: 500 });
  }
}

// PATCH /api/documents/[id]
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const { title, content } = await req.json();
    // Verify ownership before update
    const existing = await db.document.findUnique({
      where: { id, userId: session.user.id },
      select: { id: true },
    });
    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    const document = await db.document.update({
      where: { id },
      data: { ...(title && { title }), ...(content !== undefined && { content }) },
    });
    return Response.json({ document });
  } catch {
    return Response.json({ error: "Failed to update document" }, { status: 500 });
  }
}

// DELETE /api/documents/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    // Verify ownership before delete
    const existing = await db.document.findUnique({
      where: { id, userId: session.user.id },
      select: { id: true },
    });
    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    await db.document.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
