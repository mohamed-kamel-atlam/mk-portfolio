import GithubSlugger from "github-slugger";

/** A table-of-contents entry parsed from an MDX body's `##`/`###` headings. */
export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Build a table of contents from an MDX body's `##`/`###` headings. Slugs are
 * generated with `github-slugger` — the same library `rehype-slug` uses — so the
 * anchors match the ids emitted on the rendered headings. Fenced code blocks are
 * skipped. Shared across features (engineering docs + project case studies) so
 * there is one heading-extraction implementation.
 */
export function buildToc(body: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;

  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    const hashes = match?.[1];
    const rawText = match?.[2];
    if (!hashes || !rawText) continue;

    const level = hashes.length as 2 | 3;
    // Strip inline markdown so the slug matches rendered text content.
    const text = rawText.replace(/[`*_]/g, "").trim();
    items.push({ id: slugger.slug(text), text, level });
  }

  return items;
}
