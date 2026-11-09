import { Container } from "@/components/ui/misc";
import { coverAlt, coverUrl, resolveCover } from "@/lib/covers";

/** The page's cover image under its header, with descriptive alt text. Renders nothing if the page has no cover. */
export async function PageCover({ path }: { path: string }) {
  const cover = await resolveCover(path);
  if (!cover) return null;
  return (
    <Container className="-mt-2 mb-2 sm:-mt-4">
      <figure className="mx-auto max-w-4xl">
        {/* eslint-disable-next-line @next/next/no-img-element -- generated cover served by our own route */}
        <img
          src={coverUrl(path)}
          alt={coverAlt(cover)}
          width={1200}
          height={630}
          loading="lazy"
          decoding="async"
          className="aspect-[1200/630] w-full rounded-[18px] border border-border object-cover shadow-card"
        />
      </figure>
    </Container>
  );
}
