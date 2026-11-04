import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export type ChatTurn = { role: "user" | "assistant"; content: string };

/** Llama 3.3 70B: the strongest general Workers AI model, multilingual. Override with CF_AI_MODEL. */
const DEFAULT_CF_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

export function cloudflareConfigured() {
  return Boolean(process.env.CF_ACCOUNT_ID && process.env.CF_API_TOKEN);
}

/** Which backend answers: Cloudflare Workers AI when its keys are set (free daily allowance), otherwise Claude. */
export function assistantProvider(): "cloudflare" | "claude" | null {
  if (cloudflareConfigured()) return "cloudflare";
  if (process.env.ANTHROPIC_API_KEY) return "claude";
  return null;
}

export class ProviderError extends Error {
  constructor(readonly status: number | string) {
    super(`assistant provider error ${status}`);
  }
}

/**
 * Streams text from Cloudflare Workers AI's REST API (server-sent events). Each event is
 * `data: {"response": "..."}` (newer models send OpenAI-style `choices[0].delta.content`), ending with `data: [DONE]`.
 */
export async function* streamCloudflare(system: string, messages: ChatTurn[]): AsyncGenerator<string> {
  const model = process.env.CF_AI_MODEL || DEFAULT_CF_MODEL;
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/${model}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.CF_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "system", content: system }, ...messages], stream: true, max_tokens: 700, temperature: 0.3 }),
  });
  if (!res.ok || !res.body) throw new ProviderError(res.status);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const data = line.startsWith("data:") ? line.slice(5).trim() : "";
      if (!data || data === "[DONE]") continue;
      try {
        const event = JSON.parse(data) as { response?: string; choices?: { delta?: { content?: string } }[] };
        const text = event.response ?? event.choices?.[0]?.delta?.content ?? "";
        if (text) yield text;
      } catch {
        // A partial or non-JSON line (e.g. a usage summary in another shape) carries no text.
      }
    }
  }
}

/** Streams text from Claude. The fixed knowledge block is cached; the live facts follow it. */
export async function* streamClaude(instructions: string, facts: string, messages: ChatTurn[]): AsyncGenerator<string> {
  const client = new Anthropic();
  let wrote = false;
  try {
    const message = client.beta.messages.stream({
      model: "claude-opus-5-5",
      // Support answers are deliberately short; this caps cost per reply.
      max_tokens: 2048,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [
        { type: "text", text: instructions, cache_control: { type: "ephemeral", ttl: "1h" } },
        { type: "text", text: facts },
      ],
      messages,
    });
    for await (const event of message) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        wrote = true;
        yield event.delta.text;
      }
    }
    const final = await message.finalMessage();
    if (final.stop_reason === "refusal") throw new ProviderError(wrote ? "refusal-after-output" : "refusal");
  } catch (e) {
    if (e instanceof ProviderError) throw e;
    throw new ProviderError(e instanceof Anthropic.APIError ? e.status : "network");
  }
}
