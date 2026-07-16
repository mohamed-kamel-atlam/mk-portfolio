"use client";

import { useEffect, useRef, useState } from "react";

import { useInView, useReducedMotion } from "@/shared/hooks";

export interface TypewriterProps {
  /** A single string to type once. */
  text?: string;
  /** Multiple strings to rotate through (type → pause → erase → next → loop). */
  words?: string[];
  /** Delay per character in ms. */
  speed?: number;
  /** Pause on a completed word before erasing (rotation mode). */
  holdMs?: number;
  /** Show the blinking caret. */
  caret?: boolean;
  className?: string;
}

export function Typewriter({
  text,
  words,
  speed = 55,
  holdMs = 1600,
  caret = true,
  className,
}: TypewriterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const list = words ?? (text ? [text] : []);
  const primary = list[0] ?? "";
  const serialized = list.join("|");

  useEffect(() => {
    const items = serialized ? serialized.split("|") : [];
    if (!inView || items.length === 0) return;
    if (reduced) {
      setDisplay(items[0] ?? "");
      return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let erasing = false;

    const step = () => {
      const word = items[wordIndex] ?? "";
      if (!erasing) {
        charIndex += 1;
        setDisplay(word.slice(0, charIndex));
        if (charIndex >= word.length) {
          if (items.length === 1) return; // single string: type once and stop
          erasing = true;
          timer.current = setTimeout(step, holdMs);
        } else {
          timer.current = setTimeout(step, speed);
        }
      } else {
        charIndex -= 1;
        setDisplay(word.slice(0, charIndex));
        if (charIndex <= 0) {
          erasing = false;
          wordIndex = (wordIndex + 1) % items.length;
          timer.current = setTimeout(step, speed * 3);
        } else {
          timer.current = setTimeout(step, speed / 2);
        }
      }
    };

    setDisplay("");
    timer.current = setTimeout(step, speed);
    return () => clearTimeout(timer.current);
    // `serialized` is the word list by value — stable across re-renders.
  }, [inView, reduced, serialized, speed, holdMs]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{display}</span>
      {caret ? (
        <span
          aria-hidden="true"
          className="ms-0.5 inline-block motion-safe:animate-pulse"
        >
          |
        </span>
      ) : null}
      <span className="sr-only">{primary}</span>
    </span>
  );
}
