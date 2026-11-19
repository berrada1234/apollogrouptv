import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/** The 404 message. Rendered inside a page's own <main> (route not-found files) or the global 404 page's. */
export function NotFoundBody() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-24">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-accent">
          <Compass className="h-7 w-7" aria-hidden />
        </span>
        <p className="mt-6 font-display text-sm font-semibold text-accent">404</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-text">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/faq" variant="secondary">
            Visit the FAQ
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
