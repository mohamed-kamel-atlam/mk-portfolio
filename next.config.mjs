/**
 * Next.js configuration.
 *
 * Rendering is server-first and statically generated; i18n routing lives in
 * `middleware.ts`. This file owns image optimization defaults and the security
 * + caching response headers applied at the edge.
 *
 * @type {import('next').NextConfig}
 */

/**
 * Baseline security headers applied to every response. Deliberately excludes a
 * Content-Security-Policy: the app ships small pre-paint inline scripts (theme +
 * splash) via `dangerouslySetInnerHTML`, so a strict CSP would need per-request
 * nonces (a middleware concern) — tracked as a follow-up rather than shipped
 * loose. Everything here is safe for a statically-exported, HTTPS-served app.
 */
const securityHeaders = [
  // Block MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send only the origin cross-site; full path same-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Clickjacking protection (the site is never meant to be framed).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Disable powerful APIs the site never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Enforce HTTPS for two years, including subdomains.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // AVIF/WebP first, per docs/design/DESIGN_SYSTEM.md → Images and QAT-1.
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 31 days (default is 60s) — assets are content-
    // hashed/stable, so long-lived caching cuts repeat optimization work (QAT-1).
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [
      // Baseline hardening for every route.
      { source: "/:path*", headers: securityHeaders },
      // Explicit long-cache for the app icon. Route HTML is covered by the SSG
      // full route cache; hashed `_next/static` assets are already immutable.
      {
        source: "/icon.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=2592000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
