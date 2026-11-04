import { z } from "zod";
import { ASSISTANT_INSTRUCTIONS, liveFacts } from "@/lib/assistant-knowledge";
import { assistantProvider, ProviderError, streamClaude, streamCloudflare } from "@/lib/assistant-providers";
import { rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

const body = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1500) }))
    .min(1)
    .max(16)
    .refine((m) => m[0].role === "user" && m[m.length - 1].role === "user", "Conversation must start and end with the visitor"),
});

const CANT_HELP = "Sorry, I can't help with that one here. Please [contact our team](/contact) and someone will reply in writing.";
const TROUBLE = "I'm having trouble answering right now. Please try again later, or [contact our team](/contact).";

/** Requests from the site itself only, so other websites can't use up the allowance through this endpoint. */
function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = new URL(origin).host;
  return host === new URL(siteConfig.url).host || host === new URL(req.url).host;
}

/**
 * Website chat assistant. Answers from site content and live prices through Cloudflare Workers AI
 * (or Claude when only an Anthropic key is set), streams plain text, and keeps nothing: conversations aren't stored or logged.
 */
export async function POST(req: Request) {
  const provider = assistantProvider();
  if (!provider) return Response.json({ error: "The assistant isn't available right now." }, { status: 503 });
  if (!sameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });

  // Hostinger's proxy sets x-real-ip to the visitor's address (see auth.ts).
  const ip = req.headers.get("x-real-ip") ?? "local";
  const [perHour, perDay] = await Promise.all([rateLimit(`assistant:h:${ip}`, 30, 60 * 60), rateLimit(`assistant:d:${ip}`, 100, 24 * 60 * 60)]);
  if (!perHour.ok || !perDay.ok) {
    return Response.json({ error: "You've sent a lot of messages. Please wait a while, or contact our team directly." }, { status: 429 });
  }

  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid message." }, { status: 400 });

  const facts = await liveFacts();
  const turns = parsed.data.messages;
  const source = provider === "cloudflare" ? streamCloudflare(`${ASSISTANT_INSTRUCTIONS}\n\n${facts}`, turns) : streamClaude(ASSISTANT_INSTRUCTIONS, facts, turns);
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wrote = false;
      try {
        for await (const text of source) {
          wrote = true;
          controller.enqueue(encoder.encode(text));
        }
        if (!wrote) controller.enqueue(encoder.encode(CANT_HELP));
      } catch (e) {
        const status = e instanceof ProviderError ? e.status : "unknown";
        console.error("[assistant] request failed", provider, status);
        const refused = status === "refusal" || status === "refusal-after-output";
        controller.enqueue(encoder.encode(`${wrote ? "\n\n" : ""}${refused ? CANT_HELP : TROUBLE}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
