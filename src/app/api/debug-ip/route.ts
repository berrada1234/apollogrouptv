// TEMPORARY diagnostic: shows which client-IP headers reach the app behind Hostinger's proxy. Remove after use.
export const dynamic = "force-dynamic";

const KEYS = ["x-forwarded-for", "x-real-ip", "x-client-ip", "cf-connecting-ip", "true-client-ip", "x-forwarded", "forwarded", "x-cluster-client-ip", "x-hostinger-client-ip", "via"];

export function GET(request: Request) {
  const out: Record<string, string> = {};
  for (const k of KEYS) {
    const v = request.headers.get(k);
    if (v) out[k] = v;
  }
  const others = [...request.headers.keys()].filter((k) => k.startsWith("x-") && !KEYS.includes(k));
  return Response.json({ headers: out, otherXHeaderNames: others }, { headers: { "Cache-Control": "no-store" } });
}
