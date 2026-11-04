import Link from "next/link";
import { blogCategories } from "@/content/blog-categories";
import { cn } from "@/lib/utils";

/** Category links shared by the blog index and category pages; each is a real, crawlable URL. */
export function BlogCategoryNav({ active }: { active?: string }) {
  const items = [{ slug: "", name: "All articles", href: "/blog" }, ...blogCategories.map((c) => ({ slug: c.slug, name: c.name, href: `/blog/category/${c.slug}` }))];
  return (
    <nav aria-label="Blog categories" className="mb-8">
      <ul className="flex flex-wrap gap-2">
        {items.map((c) => {
          const current = (active ?? "") === c.slug;
          return (
            <li key={c.href}>
              <Link
                href={c.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "inline-flex rounded-full border px-3.5 py-1.5 text-sm font-medium",
                  current ? "border-primary/60 bg-primary/10 text-light-blue" : "border-border text-muted hover:text-text",
                )}
              >
                {c.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
