import { renderCover } from "@/lib/cover-image";
import { resolveCover } from "@/lib/covers";

/** Cover image for an article-style page, e.g. /covers/guides/fire-tv-android-tv or /covers/apollo-group-tv-vs-philo. */
export async function GET(_: Request, ctx: RouteContext<"/covers/[...path]">) {
  const cover = await resolveCover((await ctx.params).path.join("/"));
  if (!cover) return new Response("Not found", { status: 404 });
  return renderCover(cover);
}
