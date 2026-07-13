import { cn } from "@/shared/lib/cn";

import { type TocItem } from "../lib/get-engineering";

export interface DocTocProps {
  items: TocItem[];
  label: string;
}

/**
 * "On this page" table of contents. A navigation landmark of same-page anchor
 * links; the rail border uses a logical (`border-s`) side so it mirrors in RTL.
 * Rendered only when the article has headings.
 */
export function DocToc({ items, label }: DocTocProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className="flex flex-col gap-3">
      <p className="text-caption uppercase text-muted-foreground">{label}</p>
      <ul className="flex flex-col gap-2 border-s border-border ps-4">
        {items.map((item) => (
          <li key={item.id} className={cn(item.level === 3 && "ps-3")}>
            <a
              href={`#${item.id}`}
              className="text-small text-muted-foreground transition-colors duration-fast hover:text-foreground"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
