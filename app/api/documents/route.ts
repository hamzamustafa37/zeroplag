import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

// GET /api/documents — list user's documents
export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const documents = await db.document.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        checks: {
          select: { type: true, status: true, score: true },
          orderBy: { completedAt: "desc" },
          take: 1,
        },
      },
    });
    return Response.json({ documents });
  } catch {
    return Response.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

// POST /api/documents — create new document
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content } = await request.json();
    const document = await db.document.create({
      data: {
        title: title ?? "Untitled",
        content: content ?? "",
        userId: session.user.id,
      },
    });
    return Response.json({ document }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create document" }, { status: 500 });
  }
}
