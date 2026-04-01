import { NextRequest } from "next/server";
import { streamGrammarCheck } from "@/lib/ai/grammar";
import { validateTextInput } from "@/lib/validate";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, documentId } = body as {
      text: string;
      documentId?: string;
      stream?: boolean;
    };

    const validationError = validateTextInput(text, 10_000);
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    // Stream SSE response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of streamGrammarCheck(text, documentId)) {
            const data = `data: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          const error = err instanceof Error ? err.message : "Unknown error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", error })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
