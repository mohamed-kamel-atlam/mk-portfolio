"use client";

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

export function DevToolsNoiseFilter(): null {
  return null;
}
