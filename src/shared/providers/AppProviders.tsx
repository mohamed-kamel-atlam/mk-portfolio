import type { ReactNode } from "react";

import { AnimationGate } from "./AnimationGate";
import { DevToolsNoiseFilter } from "./DevToolsNoiseFilter";
import { ThemeProvider } from "./ThemeProvider";

export interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      {/* Pauses ambient/hero animation work when hidden / after first scroll. */}
      <AnimationGate />
      {/* Dev-only: filters a known React DevTools console bug (see the file). */}
      <DevToolsNoiseFilter />
      {children}
    </ThemeProvider>
  );
}
