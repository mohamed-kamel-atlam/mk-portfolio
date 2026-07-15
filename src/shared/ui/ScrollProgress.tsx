"use client";

import { useEffect, useRef } from "react";

/**
 * A thin reading-progress bar fixed to the top of the viewport. Decorative
 * (`aria-hidden`) — it conveys no information not already available from
 * scrolling. Progress drives a `scaleX` transform written **imperatively** to
 * the fill element inside a single `requestAnimationFrame` per scroll — so
 * scrolling never triggers a React re-render (PERFORMANCE.md: no React work on
 * the scroll path). The fill origin is the inline-start, mirroring in RTL.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = document.documentElement;
        const scrollable = el.scrollHeight - el.clientHeight;
        const progress = scrollable > 0 ? el.scrollTop / scrollable : 0;
        const bar = barRef.current;
        if (bar) bar.style.transform = `scaleX(${progress})`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-sticky h-0.5"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-accent rtl:origin-right"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
