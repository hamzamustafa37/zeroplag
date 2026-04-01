import Anthropic from "@anthropic-ai/sdk";

// Server-only — never import from client components
if (typeof window !== "undefined") {
  throw new Error("lib/ai/claude must only be imported server-side");
}

let _client: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

/** Exponential backoff for rate limit errors */
export async function withBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 4
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const isRateLimit =
        err instanceof Anthropic.RateLimitError ||
        (err instanceof Anthropic.APIError && (err as InstanceType<typeof Anthropic.APIError>).status === 429);
      if (!isRateLimit || i === maxRetries - 1) throw err;
      const delay = Math.min(1000 * 2 ** i, 8000);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}
