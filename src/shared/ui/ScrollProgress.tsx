"use client";

import { useEffect, useState } from "react";

/**
 * A thin reading-progress bar fixed to the top of the viewport. Decorative
 * (`aria-hidden`) — it conveys no information not already available from
 * scrolling. Progress drives a `scaleX` transform (a genuinely dynamic,
 * non-design value — the one inline-style exception in CODING_STANDARDS §8);
 * the fill origin is the inline-start, mirroring in RTL. Updates are throttled
 * to one per animation frame.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = document.documentElement;
        const scrollable = el.scrollHeight - el.clientHeight;
        setProgress(scrollable > 0 ? el.scrollTop / scrollable : 0);
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
        className="h-full w-full origin-left bg-accent rtl:origin-right"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
