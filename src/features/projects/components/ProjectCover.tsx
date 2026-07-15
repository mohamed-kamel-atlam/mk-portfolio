import Image from "next/image";

import { BLUR_DATA_URL, projectCover } from "@/shared/assets";
import { cn } from "@/shared/lib/cn";
import { GradientLayer, GridLayer } from "@/shared/ui/background";

import { getInitials } from "../lib/monogram";
import styles from "./ProjectShowcaseCard.module.css";

export interface ProjectCoverProps {
  /** Cover file name in `public/images/projects`; absent → designed fallback. */
  cover?: string;
  /** Project name — monogram fallback source. */
  name: string;
  /** Localized alt text for the cover image. */
  alt: string;
  /** `next/image` responsive sizes for this slot. */
  sizes: string;
  /** Priority-load the LCP cover (featured/above-the-fold only). */
  priority?: boolean;
  className?: string;
}

/**
 * The card's cover presentation — layered, never a bare image: the media (or a
 * designed engineering-pattern fallback) sits under a scrim and an accent glow
 * that lifts in on hover. The image itself zooms subtly via the `group/card`
 * group. Presentational Server Component.
 */
export function ProjectCover({
  cover,
  name,
  alt,
  sizes,
  priority,
  className,
}: ProjectCoverProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {cover ? (
        <Image
          src={projectCover(cover)}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          priority={priority}
          className="object-cover transition-transform duration-normal ease-standard motion-safe:group-hover/card:scale-105"
        />
      ) : (
        <div aria-hidden="true" className={styles.fallback}>
          <GradientLayer preset="engineering" />
          <GridLayer />
          <span className={styles.monogram}>{getInitials(name)}</span>
        </div>
      )}

      {/* Legibility scrim + hover lighting (decorative). */}
      <div aria-hidden="true" className={styles.scrim} />
      <div
        aria-hidden="true"
        className={cn(
          styles.coverGlow,
          "opacity-0 transition-opacity duration-normal ease-standard motion-safe:group-hover/card:opacity-100",
        )}
      />
    </div>
  );
}
