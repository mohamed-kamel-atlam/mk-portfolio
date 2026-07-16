"use client";

import { useEffect, useState } from "react";

export interface ReadingProgressProps {
  /** Accessible label for the progress indicator. */
  label: string;
}

/**
 * A thin reading-progress bar for the case study — fills as the reader scrolls
 * through the document. One small client island (scroll position genuinely needs
 * the client); a token-driven `scaleX` transform only, origin mirrored for RTL.
 * `progressbar` role with live values for assistive tech.
 */
export function ReadingProgress({ label }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(Math.max(el.scrollTop / max, 0), 1) : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="fixed inset-x-0 top-0 z-toast h-0.5 bg-transparent"
    >
      <div
        className="h-full origin-left bg-accent rtl:origin-right"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
