"use client";

import { useEffect } from "react";

/**
 * Retires needless animation work, via flags on `<html>` that the CSS reads:
 *
 * - `data-anim-paused` while the tab is hidden → the ambient aurora/glow and the
 *   hero's float/glow stop animating (belt-and-braces over the browser's own
 *   background-tab pausing; saves GPU/battery).
 * - `data-scrolled-once` after the first scroll → the hero scroll-cue fades out
 *   (it has served its purpose).
 *
 * Cost is negligible: one visibility listener plus a single `{ once: true }`
 * scroll listener that removes itself — no ongoing scroll-path work.
 */
export function AnimationGate() {
  useEffect(() => {
    const root = document.documentElement;
    const onVisibility = () =>
      root.toggleAttribute("data-anim-paused", document.hidden);
    const onFirstScroll = () => root.setAttribute("data-scrolled-once", "");

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", onFirstScroll, {
      once: true,
      passive: true,
    });
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onFirstScroll);
    };
  }, []);

  return null;
}
