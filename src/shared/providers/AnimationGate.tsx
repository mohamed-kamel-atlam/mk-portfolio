"use client";

import { useEffect } from "react";

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
