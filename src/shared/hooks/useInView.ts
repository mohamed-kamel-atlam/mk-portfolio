"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface UseInViewOptions {
  /** Fraction of the element visible before it counts as in view. */
  threshold?: number;
  /** Root margin (e.g. reveal slightly before fully on-screen). */
  rootMargin?: string;
  /** Fire only the first time it enters (default true). */
  once?: boolean;
}

/**
 * Observe when an element enters the viewport. A single IntersectionObserver
 * wrapper reused by scroll-driven primitives (e.g. Reveal), so the observer
 * logic lives in one place. Degrades to immediately-in-view when
 * IntersectionObserver is unavailable (content never stays hidden).
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {},
): { ref: RefObject<T | null>; inView: boolean } {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -10% 0px",
    once = true,
  } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
