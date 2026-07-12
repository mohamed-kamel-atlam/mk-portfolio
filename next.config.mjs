/**
 * Next.js configuration.
 *
 * Kept intentionally minimal at the bootstrap milestone (M0). Rendering,
 * i18n routing, and headers/security are introduced in their own milestones
 * per docs/product/ROADMAP.md and their governing engineering docs.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // AVIF/WebP first, per docs/design/DESIGN_SYSTEM.md → Images and QAT-1.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
