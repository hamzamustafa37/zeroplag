import { NextRequest } from "next/server";
import { runPlagiarismCheck } from "@/lib/ai/plagiarism";
import { validateTextInput } from "@/lib/validate";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, documentId, sources = ["web"] } = body as {
      text: string;
      documentId?: string;
      sources?: string[];
    };

    const validationError = validateTextInput(text, 50_000);
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    const result = await runPlagiarismCheck(text, { documentId, sources });
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Check failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
