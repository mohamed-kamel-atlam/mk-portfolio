"use client";

import { useEffect, useState } from "react";

import { useInView, useReducedMotion } from "@/shared/hooks";

export interface CountUpProps {
  value: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Locale for number formatting (Intl). */
  locale?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Count a number up to its value the first time it scrolls into view. Uses one
 * rAF loop (self-contained — only this span re-renders); under reduced motion it
 * shows the final value immediately. Formatted via `Intl` for locale-correct
 * digits.
 */
export function CountUp({
  value,
  duration = 1200,
  locale,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value, duration]);

  const formatted = new Intl.NumberFormat(locale).format(Math.round(display));

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
