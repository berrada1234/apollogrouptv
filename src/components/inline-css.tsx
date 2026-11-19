"use client";

import { useState } from "react";
import { siteCss } from "@/lib/site-css";

const ID = "site-css";

/**
 * Puts the whole site stylesheet in the page <head> once.
 *
 * Next's own `experimental.inlineCss` also copied all of it (≈120 KB) into the RSC payload at the end of every page,
 * so each HTML response carried the CSS twice. Cloudflare compresses dynamic HTML at a low level (zstd 3 for
 * Chrome), where that copy cost ≈9 KB on the wire: on the homepage, one more TCP round trip on a slow phone
 * connection before the first paint.
 *
 * As a client component, only a reference reaches the RSC payload. The server renders the full text (production
 * server builds swap in the compiled CSS, see src/lib/site-css.ts). The browser bundle has no copy: it reads the text
 * back from the server-rendered element, so hydration sees identical content and a client-side re-render of the
 * root (after a hydration error, say) still draws the full stylesheet.
 */
export function InlineCss() {
  const [css] = useState(() => (typeof document === "undefined" ? siteCss : (document.getElementById(ID)?.innerHTML ?? siteCss)));
  return <style id={ID} dangerouslySetInnerHTML={{ __html: css }} />;
}
