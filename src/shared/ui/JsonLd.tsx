export interface JsonLdProps {
  /** A serializable schema.org object (or array of them). */
  data: unknown;
}

/**
 * Emit a JSON-LD `<script>`. A Server Component so structured data is rendered
 * in the static HTML (SEO.md §5); defined once so every route serializes schema
 * the same way instead of repeating the `dangerouslySetInnerHTML` boilerplate.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
