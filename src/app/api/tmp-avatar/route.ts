// TEMPORARY: generates the five proof-bar portraits with the server's Workers AI key. Deleted right after use.
export const dynamic = "force-dynamic";

const KEY = "4-AvFmUel1j6oJzn-2_CVGfS";
const BASE =
  "photorealistic head-and-shoulders portrait, natural friendly smile, looking at camera, soft studio lighting, plain soft grey background, sharp focus, 85mm lens, professional headshot, no text, no watermark";
const PEOPLE = [
  "a Black woman in her early 30s with short natural curly hair, wearing a simple navy top",
  "a Latino man in his 40s with short dark hair and light stubble, wearing a grey crew-neck sweater",
  "an East Asian woman in her late 20s with shoulder-length straight black hair, wearing a cream blouse",
  "a white man in his mid 30s with a short brown beard, wearing a dark green henley shirt",
  "a South Asian woman in her 50s with dark hair tied back, wearing a soft blue cardigan",
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const i = Number(searchParams.get("i"));
  if (searchParams.get("k") !== KEY || !Number.isInteger(i) || i < 0 || i >= PEOPLE.length) return new Response("Not found", { status: 404 });
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.CF_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: `${PEOPLE[i]}, ${BASE}`, steps: 6 }),
  });
  const data = (await res.json().catch(() => null)) as { result?: { image?: string }; errors?: { message?: string }[] } | null;
  const image = data?.result?.image;
  if (!res.ok || !image) return Response.json({ error: data?.errors?.[0]?.message ?? `status ${res.status}` }, { status: 502 });
  return new Response(Buffer.from(image, "base64"), { headers: { "Content-Type": "image/jpeg", "Cache-Control": "no-store" } });
}
