"use client";

import { useEffect, useState } from "react";

import { useInView, useReducedMotion } from "@/shared/hooks";

export interface TypewriterProps {
  text: string;
  /** Delay per character in ms. */
  speed?: number;
  className?: string;
}

/**
 * Type text out character-by-character when it scrolls into view. Accessibility:
 * the animated text is `aria-hidden` and the full text is exposed to assistive
 * tech via an `sr-only` copy, so screen readers announce it once (not per
 * keystroke). Under reduced motion the full text shows immediately.
 */
export function Typewriter({ text, speed = 45, className }: TypewriterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let typed = 0;
    const id = window.setInterval(() => {
      typed += 1;
      setCount(typed);
      if (typed >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [inView, reduced, text, speed]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
