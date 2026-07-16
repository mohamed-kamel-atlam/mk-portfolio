import type { CSSProperties } from "react";

import { cn } from "@/shared/lib/cn";
import {
  TECH_LOGO_DATA,
  type TechLogoData,
} from "@/shared/lib/tech-logos-data";

// UI names that don't slugify straight to a Simple Icons slug.
const ALIASES: Record<string, string> = {
  "next.js": "nextdotjs",
  nextjs: "nextdotjs",
  "node.js": "nodedotjs",
  nodejs: "nodedotjs",
  node: "nodedotjs",
  "tailwind css": "tailwindcss",
  tailwind: "tailwindcss",
  "redux toolkit": "redux",
  "rtk query": "redux",
  "react query": "reactquery",
  "react router": "reactrouter",
  "material ui": "mui",
  mui: "mui",
  "framer motion": "framer",
  "github flow": "github",
  "nest.js": "nestjs",
  jwt: "jsonwebtokens",
  gsap: "greensock",
};

function slugFor(name: string): string {
  const key = name.trim().toLowerCase();
  return ALIASES[key] ?? key.replace(/[^a-z0-9]+/g, "");
}

export function getTechLogo(name: string): TechLogoData | undefined {
  return TECH_LOGO_DATA[slugFor(name)];
}

export interface TechLogoProps {
  name: string;
  className?: string;
}

// Official monochrome brand mark. Inherits currentColor; the brand color is
// exposed as --brand for callers that want a hover tint.
export function TechLogo({ name, className }: TechLogoProps) {
  const logo = getTechLogo(name);
  if (!logo) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      fill="currentColor"
      className={cn("shrink-0", className)}
      style={{ "--brand": logo.hex } as CSSProperties}
    >
      <path d={logo.path} />
    </svg>
  );
}
