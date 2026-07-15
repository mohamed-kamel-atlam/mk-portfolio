import Image from "next/image";

import type { ProjectFrontmatter } from "@/content/schema";
import { projectLogo } from "@/shared/assets";
import { cn } from "@/shared/lib/cn";

import { getInitials } from "../lib/monogram";

export interface ProjectLogoProps {
  /** Optional dedicated logo asset; when absent, a monogram is shown. */
  logo?: ProjectFrontmatter["logo"];
  /** Project name — source of the monogram fallback and image alt. */
  name: string;
  className?: string;
}

/**
 * The project's logo in a premium rounded, glassy container. Never empty: with a
 * dedicated `logo` it renders the image; without one it renders a designed
 * initials monogram. Presentational Server Component.
 */
export function ProjectLogo({ logo, name, className }: ProjectLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex size-11 items-center justify-center overflow-hidden rounded-xl border border-border bg-header shadow-sm backdrop-blur-md",
        className,
      )}
    >
      {logo ? (
        <Image
          src={projectLogo(logo.src)}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          className="size-7 object-contain"
        />
      ) : (
        <span
          aria-hidden="true"
          className="text-small font-semibold text-foreground"
        >
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}
