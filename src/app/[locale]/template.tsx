import type { ReactNode } from "react";

import { AnimateIn } from "@/shared/ui/motion";

/**
 * Page-transition wrapper. Unlike a layout, a `template` re-mounts on every
 * navigation, so its children replay the entrance each time — here a subtle
 * ~200ms opacity fade (`AnimateIn variant="fade"`). It is deliberately
 * opacity-only and "almost invisible": no sliding pages, no wipes. A Server
 * Component (zero client JS); the fade is CSS gated by `motion-safe`, so it
 * settles instantly under reduced motion.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <AnimateIn variant="fade">{children}</AnimateIn>;
}
