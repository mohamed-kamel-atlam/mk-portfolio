import type { ReactNode } from "react";

import { DevToolsNoiseFilter } from "./DevToolsNoiseFilter";
import { ThemeProvider } from "./ThemeProvider";

export interface AppProvidersProps {
  children: ReactNode;
}

/**
 * The single "providers mount point" for the root layout
 * (FOLDER_STRUCTURE.md §2.1): it composes every app-wide client provider in one
 * place. Today that is only the {@link ThemeProvider}; future cross-cutting
 * providers (e.g. tooltip or toast context) are added here, never by editing the
 * layout.
 *
 * This is itself a **Server Component** — it renders client providers and passes
 * Server-Component `children` straight through, so nothing here forces the tree
 * to the client (ARCHITECTURE §5). Locale is deliberately absent: it is URL
 * state, not a client provider (INTERNATIONALIZATION.md §5).
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      {/* Dev-only: filters a known React DevTools console bug (see the file). */}
      <DevToolsNoiseFilter />
      {children}
    </ThemeProvider>
  );
}
