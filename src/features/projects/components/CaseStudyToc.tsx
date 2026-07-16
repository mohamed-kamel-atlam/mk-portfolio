"use client";

import { useEffect, useState, type MouseEvent } from "react";

import { cn } from "@/shared/lib/cn";
import { type TocItem } from "@/shared/lib/toc";

export interface CaseStudyTocProps {
  items: TocItem[];
  label: string;
}

export function CaseStudyToc({ items, label }: CaseStudyTocProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0]?.target.id;
        if (first) setActiveId(first);
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string): void {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }

  return (
    <nav aria-label={label} className="sticky top-24 flex flex-col gap-3">
      <p className="text-caption uppercase text-muted-foreground">{label}</p>
      <ul className="flex flex-col gap-2 border-s border-border ps-4">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className={cn(item.level === 3 && "ps-3")}>
              <a
                href={`#${item.id}`}
                onClick={(event) => handleClick(event, item.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block text-small transition-colors duration-fast",
                  isActive
                    ? "font-medium text-accent"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
