import { ImageResponse } from "next/og";
import { getPost } from "@/lib/blog";

const size = { width: 1200, height: 630 };

/**
 * The article's featured image (also its social sharing image): title and category on the
 * brand background, with no third-party logos. Served at a stable URL: /blog/{slug}/cover.
 */
export async function GET(_: Request, ctx: RouteContext<"/blog/[slug]/cover">) {
  const post = getPost((await ctx.params).slug);
  if (!post) return new Response("Not found", { status: 404 });
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #050607 0%, #0A0C0F 55%, #0B3A46 100%)",
          color: "#F4F6F8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 24, color: "#22D3EE", fontWeight: 700, letterSpacing: 4 }}>APOLLO GROUP TV · BLOG</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              fontSize: 24,
              color: "#03141A",
              background: "#22D3EE",
              borderRadius: 999,
              padding: "6px 18px",
              fontWeight: 700,
            }}
          >
            {post.category}
          </div>
          <div style={{ fontSize: 58, fontWeight: 700, marginTop: 28, lineHeight: 1.12, maxWidth: 1000 }}>{post.title}</div>
        </div>
        <div style={{ fontSize: 24, color: "#A1A8B3" }}>{`${post.minutes} min read`}</div>
      </div>
    ),
    { ...size, headers: { "cache-control": "public, max-age=86400, stale-while-revalidate=604800" } },
  );
}
