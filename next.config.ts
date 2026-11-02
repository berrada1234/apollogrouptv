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
    value: ["frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "object-src 'none'"].join("; "),
  },
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  // Pages that read the database render per request (`dynamic = "force-dynamic"`),
  // so the classic caching model is used instead of Cache Components.
  cacheComponents: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: process.env.NEXT_PUBLIC_IMAGE_HOSTS
      ? process.env.NEXT_PUBLIC_IMAGE_HOSTS.split(",").map((hostname) => ({
          protocol: "https" as const,
          hostname: hostname.trim(),
        }))
      : [],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;
