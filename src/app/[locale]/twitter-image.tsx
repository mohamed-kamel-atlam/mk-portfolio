// Twitter card image reuses the Open Graph card (SEO.md §4) — one branded
// template, exposed as both `og:image` and `twitter:image`, prebuilt per locale.
export {
  default,
  alt,
  size,
  contentType,
  generateStaticParams,
} from "./opengraph-image";
