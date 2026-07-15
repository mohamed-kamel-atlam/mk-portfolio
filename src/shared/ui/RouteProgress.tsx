"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

import styles from "./RouteProgress.module.css";

/**
 * A very thin top progress bar for client-side navigations (Linear/Vercel style).
 * It starts when an in-app navigation begins — detected via a capture-phase click
 * on same-origin links plus `popstate` — trickles toward ~90%, then completes and
 * fades once the pathname changes. A short show-delay means instant navigations
 * never flash the bar. Token-driven `scaleX` transform only; one small client
 * island (route progress genuinely needs the client). Decorative (`aria-hidden`)
 * — the route change is already announced by the App Router's built-in announcer.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const trickle = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const first = useRef(true);

  // Start detection: same-origin link clicks (capture) and back/forward.
  useEffect(() => {
    const clearTimers = () => {
      clearTimeout(showTimer.current);
      clearInterval(trickle.current);
    };
    const begin = () => {
      clearTimers();
      // Delay showing so instant navigations don't flash the bar.
      showTimer.current = setTimeout(() => {
        setActive(true);
        setProgress(0.08);
        trickle.current = setInterval(() => {
          setProgress((p) => (p >= 0.9 ? p : p + (0.9 - p) * 0.12));
        }, 200);
      }, 120);
    };
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (hash-only / identical) → no route change.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;
      begin();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", begin);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", begin);
      clearTimers();
    };
  }, []);

  // Complete when the pathname commits.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    clearTimeout(showTimer.current);
    clearInterval(trickle.current);
    // If the bar is showing, finish it; if it never showed (instant nav), it
    // stays hidden (opacity 0) so this is invisible. Then reset.
    setProgress(1);
    const done = setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 240);
    return () => clearTimeout(done);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={styles.track}
      data-active={active ? "true" : "false"}
    >
      <div
        className={cn(styles.bar, "bg-accent")}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
