import { renderCover } from "@/lib/cover-image";
import { resolveCover } from "@/lib/covers";

/** The article's featured image (also its social sharing image), at a stable URL: /blog/{slug}/cover. */
export async function GET(_: Request, ctx: RouteContext<"/blog/[slug]/cover">) {
  const cover = await resolveCover(`blog/${(await ctx.params).slug}`);
  if (!cover) return new Response("Not found", { status: 404 });
  return renderCover(cover);
}
