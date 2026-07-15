"use client";

import { useEffect, useState } from "react";

import {
  SPLASH_MAX_MS,
  SPLASH_MIN_MS,
  SPLASH_MIN_MS_REDUCED,
  SPLASH_STORAGE_KEY,
} from "@/shared/constants/splash";
import { cn } from "@/shared/lib/cn";

import styles from "./Splash.module.css";

export interface SplashProps {
  /** Localized rotating status messages. */
  messages: readonly string[];
  /** Localized accessible label for the loading region. */
  loadingLabel: string;
}

/**
 * First-visit splash. Visibility is decided pre-paint by the inline splash script
 * (`data-splash` on `<html>`) and gated purely in CSS, so returning visitors
 * never see it and there is no flash. This client island only drives the timing:
 * it trickles the progress bar and rotates the messages, dismisses as soon as the
 * page is ready **and** a short minimum has passed (never forcing a wait, hard
 * capped by {@link SPLASH_MAX_MS}), then removes `data-splash` (CSS fades it out)
 * and records the visit. Respects reduced motion (static, quick dismiss).
 */
export function Splash({ messages, loadingLabel }: SplashProps) {
  const [message, setMessage] = useState(0);
  const [progress, setProgress] = useState(0.05);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-splash")) return; // returning visitor

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const minMs = reduce ? SPLASH_MIN_MS_REDUCED : SPLASH_MIN_MS;
    const started = performance.now();

    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - started;
      setProgress(Math.min(0.05 + (elapsed / minMs) * 0.9, 0.95));
      if (elapsed < minMs) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let messageTimer: ReturnType<typeof setInterval> | undefined;
    if (!reduce && messages.length > 1) {
      messageTimer = setInterval(() => {
        setMessage((index) => Math.min(index + 1, messages.length - 1));
      }, 420);
    }

    let done = false;
    const dismiss = () => {
      if (done) return;
      done = true;
      window.clearInterval(messageTimer);
      cancelAnimationFrame(raf);
      setProgress(1);
      root.removeAttribute("data-splash"); // CSS fades the overlay out
      try {
        localStorage.setItem(SPLASH_STORAGE_KEY, "1");
      } catch {
        // storage unavailable (private mode): show once this session anyway
      }
    };

    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    const minElapsed = new Promise<void>((resolve) =>
      setTimeout(resolve, minMs),
    );
    void Promise.all([pageReady, minElapsed]).then(dismiss);
    const cap = setTimeout(dismiss, SPLASH_MAX_MS);

    return () => {
      window.clearInterval(messageTimer);
      cancelAnimationFrame(raf);
      clearTimeout(cap);
    };
  }, [messages.length]);

  return (
    <div
      className={cn(styles.overlay, "splash-overlay")}
      role="status"
      aria-label={loadingLabel}
    >
      <div aria-hidden="true" className={styles.ambient} />
      <div className={styles.content}>
        <span aria-hidden="true" className={styles.mark}>
          MK
        </span>
        <p className={styles.wordmark}>
          MohamedKamel<span className={styles.tld}>.dev</span>
        </p>
        <div aria-hidden="true" className={styles.track}>
          <div
            className={styles.bar}
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <p
          key={message}
          className={cn(styles.message, "motion-safe:animate-fade-in")}
        >
          {messages[message] ?? messages[0]}…
        </p>
      </div>
    </div>
  );
}
