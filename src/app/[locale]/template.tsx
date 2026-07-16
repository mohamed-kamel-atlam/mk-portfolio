import type { ReactNode } from "react";

import { AnimateIn } from "@/shared/ui/motion";

export default function Template({ children }: { children: ReactNode }) {
  return <AnimateIn variant="fade">{children}</AnimateIn>;
}
