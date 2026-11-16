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

const nextConfig: NextConfig = {
  // Pages that read the database render per request (`dynamic = "force-dynamic"`),
  // so the classic caching model is used instead of Cache Components.
  cacheComponents: false,
  experimental: {
    // Hostinger shared hosting caps threads per account; the default (one worker per host CPU) aborts the build.
    cpus: 2,
    // Ship CSS inside the HTML <head> instead of separate render-blocking stylesheet requests
    // (Tailwind keeps it compact), so the first paint doesn't wait on a second round trip.
    inlineCss: true,
  },
  poweredByHeader: false,
  // Next.js bundles a polyfill module into every page even though all browsers it supports already have those
  // features natively (Lighthouse "Legacy JavaScript"). Swap it for an empty file in client bundles.
  webpack(config, { isServer, webpack }) {
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
      // The homepage is the same for every visitor (no session, no cookies), so the Hostinger CDN may keep a copy
      // and serve it from the nearest edge. After 5 minutes the next visitor still gets the saved copy at once
      // while the CDN fetches a fresh one in the background (stale-while-revalidate), so nobody waits on the server.
      // Only full page loads: RSC/prefetch requests and URLs with a query string keep the private headers Next sets.
      {
        source: "/",
        has: [{ type: "header", key: "accept", value: ".*text/html.*" }],
        missing: [
          { type: "header", key: "rsc" },
          { type: "header", key: "next-router-prefetch" },
          { type: "header", key: "next-router-state-tree" },
          { type: "query", key: "_rsc" },
        ],
        headers: [{ key: "Cache-Control", value: "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" }],
      },
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
