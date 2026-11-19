import path from "node:path";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Content-Security-Policy",
    // Scripts, styles, fonts and API calls only from this site, so injected markup can't load or send to
    // another server. 'unsafe-inline' stays for scripts because Next.js inlines its startup data;
    // dev mode also needs 'unsafe-eval' for hot reloading. Images may be https (admin-set logos, QR codes use data:).
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      `connect-src 'self'${isProd ? "" : " ws: wss:"}`,
      "media-src 'self'",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      ...(isProd ? ["upgrade-insecure-requests"] : []),
    ].join("; "),
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
    : []),
];

// Top-level public sections (src/app/(marketing)) whose pages may be cached at the CDN; see headers() below.
const publicSections = [
  "about-us", "apollo-group-tv-renewal", "apollo-group-tv-vs-directv-stream", "apollo-group-tv-vs-hulu-live-tv",
  "apollo-group-tv-vs-philo", "apollo-group-tv-vs-sling-tv", "apollo-group-tv-vs-youtube-tv", "app", "blog", "channels",
  "choosing-an-iptv-service", "compare", "contact", "disclaimer", "dmca", "faq", "guides", "help",
  "is-apollo-group-tv-legal", "payment-guides", "payment-methods", "plans", "privacy-policy", "product",
  "refer-a-friend", "refund-policy", "reviews", "site-index", "terms-and-conditions", "why-apollo-group-tv",
];

const nextConfig: NextConfig = {
  // Pages that read the database render per request (`dynamic = "force-dynamic"`),
  // so the classic caching model is used instead of Cache Components.
  cacheComponents: false,
  experimental: {
    // Hostinger shared hosting caps threads per account; the default (one worker per host CPU) aborts the build.
    cpus: 2,
    // app/global-not-found.tsx renders the 404 for unmatched URLs, so no root not-found.tsx rides along in every
    // page's RSC payload.
    globalNotFound: true,
    // Ship CSS inside the HTML <head> instead of separate render-blocking stylesheet requests
    // (Tailwind keeps it compact), so the first paint doesn't wait on a second round trip.
    // Measured 2026-11-16: turning this off shrank HTML (342KB → 84KB on /dmca) but delayed first paint on a cold
    // phone load by 300–700ms on 4 of 5 pages, so it stays on.
    // Since 2026-11-19 it only carries the small @font-face sheet from next/font: in production the Tailwind sheet is
    // written once by <InlineCss /> (src/components/inline-css.tsx), because this option also copies every inlined
    // sheet into the RSC payload.
    inlineCss: true,
  },
  poweredByHeader: false,
  webpack(config, { isServer, webpack, dev }) {
    if (!dev) {
      // Production: globals.css reaches the page through <InlineCss /> instead of Next's CSS pipeline (see above).
      // The server gets the compiled text from scripts/build-css.mjs (run by `npm run build`); browser bundles keep
      // the empty stub. Development keeps the normal import, with hot reloading.
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/[\\/]src[\\/]app[\\/]globals\.css$/, path.join(process.cwd(), "src/lib/empty.css")),
      );
      if (isServer) {
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(/[\\/]src[\\/]lib[\\/]site-css(\.ts)?$/, path.join(process.cwd(), ".site-css/site-css.mjs")),
        );
      }
    }
    // Next.js bundles a polyfill module into every page even though all browsers it supports already have those
    // features natively (Lighthouse "Legacy JavaScript"). Swap it for an empty file in client bundles.
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/[\\/]build[\\/]polyfills[\\/]polyfill-module(\.js)?$/, path.join(process.cwd(), "src/lib/empty-polyfills.js")),
      );
    } else {
      // Icons in server components render as plain <svg> instead of hydrated client components (see the file).
      config.resolve.alias["@lucide-shared"] = path.join(process.cwd(), "node_modules/lucide-react/dist/esm/shared/src");
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/lucide-react[\\/]dist[\\/]esm[\\/]Icon\.mjs$/, path.join(process.cwd(), "src/lib/lucide-server-icon.mjs")),
      );
    }
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: process.env.NEXT_PUBLIC_IMAGE_HOSTS
      ? process.env.NEXT_PUBLIC_IMAGE_HOSTS.split(",").map((hostname) => ({
          protocol: "https" as const,
          hostname: hostname.trim(),
        }))
      : [],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Public pages are the same for every visitor (no session or cookie is read on the server; the header's sign-in
      // state loads in the browser), so the Cloudflare edge may keep a copy for an hour. PageSpeed showed why it
      // matters (2026-11-19): from the edge the HTML arrives in ~80 ms; from the origin it trickles in over ~1 s,
      // which pushed mobile Speed Index from ~1.1-1.3 s to 2.2-2.4 s. The CDN ignores stale-while-revalidate (tested
      // 2026-11-16: the first request after expiry waits on the server), so the first visit after an hour is still
      // slow. Admin price/content changes reach these pages within the hour.
      // Only full page loads: RSC/prefetch requests (their own ?_rsc= URLs) keep the private headers Next sets.
      // /email-preferences is left out: its link carries a personal token.
      ...["/", `/:section(${publicSections.join("|")})/:rest*`].map((source) => ({
        source,
        has: [{ type: "header" as const, key: "accept", value: ".*text/html.*" }],
        missing: [
          { type: "header" as const, key: "rsc" },
          { type: "header" as const, key: "next-router-prefetch" },
          { type: "header" as const, key: "next-router-state-tree" },
          { type: "query" as const, key: "_rsc" },
        ],
        headers: [{ key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" }],
      })),
    ];
  },
  async redirects() {
    return [
      // One canonical host: www serves a duplicate copy of the site otherwise.
      { source: "/:path*", has: [{ type: "host", value: "www.apollogroupr.tv" }], destination: "https://apollogroupr.tv/:path*", permanent: true },
      { source: "/login", destination: "/sign-in", permanent: true },
      { source: "/signin", destination: "/sign-in", permanent: true },
      { source: "/register", destination: "/create-account", permanent: true },
      { source: "/signup", destination: "/create-account", permanent: true },
      { source: "/pricing", destination: "/plans", permanent: true },
      { source: "/referral", destination: "/refer-a-friend", permanent: true },
      { source: "/terms", destination: "/terms-and-conditions", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/support", destination: "/contact", permanent: true },
      { source: "/legal", destination: "/is-apollo-group-tv-legal", permanent: true },
      // Former duplicate account pages; everything they showed lives in the dashboard.
      { source: "/account", destination: "/dashboard/profile", permanent: true },
      { source: "/client-portal", destination: "/dashboard", permanent: true },
    ];
  },
};

export default nextConfig;
