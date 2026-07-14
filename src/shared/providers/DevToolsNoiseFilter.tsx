"use client";

/**
 * Silences a known **React DevTools extension** bug — not an app fault — that
 * logs, on every RSC route transition:
 *
 *   "React instrumentation encountered an error: Error: We are cleaning up async
 *    info that was not on the parent Suspense boundary. This is a bug in React."
 *
 * The entire stack sits inside the extension's `renderer.js`; it never fires in
 * production or without the extension, and there is no upstream React/Next fix
 * yet (see vercel/next.js discussion #84973 — the maintainer-confirmed
 * resolution is a console filter or disabling DevTools).
 *
 * We scrub ONLY this exact signature, and ONLY in development, so the console
 * stays usable while navigating. Every other `console.error` passes through
 * untouched, so genuine errors are never hidden. The whole thing is behind a
 * `NODE_ENV` guard, so it is dead-code-eliminated from production builds.
 */

const DEVTOOLS_BUG_MARKERS = [
  "react instrumentation encountered an error",
  "cleaning up async info that was not on the parent suspense boundary",
];

type Patchable = typeof console.error & { __mkNoiseFiltered?: boolean };

function installFilter(): void {
  const original = console.error as Patchable;
  // Idempotent — never double-wrap across Fast Refresh or repeated imports.
  if (original.__mkNoiseFiltered) return;

  const filtered: Patchable = (...args: unknown[]) => {
    const text = args
      .map((arg) => (arg instanceof Error ? arg.message : String(arg)))
      .join(" ")
      .toLowerCase();
    if (DEVTOOLS_BUG_MARKERS.some((marker) => text.includes(marker))) return;
    original(...args);
  };
  filtered.__mkNoiseFiltered = true;
  console.error = filtered;
}

// Install as soon as the client bundle evaluates — before any navigation can
// trigger the DevTools tree walk. On the server this module is a no-op.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  installFilter();
}

/**
 * Renders nothing. It exists only so the root layout can pull the client-only
 * filter above into the client bundle via a normal component mount.
 */
export function DevToolsNoiseFilter(): null {
  return null;
}
