import { cn } from "@/shared/lib/cn";

import styles from "./background.module.css";

/**
 * Background layers — presentational Server Components that render decorative,
 * `aria-hidden` visual layers. Pure CSS (no client JS, no re-renders); motion is
 * compositor-only and honors reduced-motion via the global rule. Each layer
 * fills its positioned parent (`SectionBackground`/`ThemeBackground`).
 */

export interface LayerProps {
  className?: string;
}

/** Soft, slowly-drifting multi-blob aurora. The signature ambient light. */
export function AuroraLayer({ className }: LayerProps) {
  return (
    <div aria-hidden="true" className={cn(styles.aurora, className)}>
      <span className={cn(styles.blob, styles.blobA)} />
      <span className={cn(styles.blob, styles.blobB)} />
      <span className={cn(styles.blob, styles.blobC)} />
    </div>
  );
}

export type GlowPosition = "top" | "bottom" | "center" | "corner";

const glowPositionClass: Record<GlowPosition, string | undefined> = {
  top: styles.glowTop,
  bottom: styles.glowBottom,
  center: styles.glowCenter,
  corner: styles.glowCorner,
};

export interface GlowLayerProps extends LayerProps {
  /** Where the radial light sits. */
  position?: GlowPosition;
  /** Add a gentle ambient float. */
  floating?: boolean;
}

/** A single soft radial light (top / bottom / center / corner). */
export function GlowLayer({
  position = "top",
  floating = false,
  className,
}: GlowLayerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        styles.glow,
        glowPositionClass[position],
        floating && styles.floating,
        className,
      )}
    />
  );
}

/** Subtle, edge-fading engineering grid. */
export function GridLayer({ className }: LayerProps) {
  return <div aria-hidden="true" className={cn(styles.grid, className)} />;
}

/** Near-invisible noise texture that removes flat-gradient banding. */
export function NoiseLayer({ className }: LayerProps) {
  return <div aria-hidden="true" className={cn(styles.noise, className)} />;
}

export type GradientPreset =
  | "primary"
  | "secondary"
  | "hero"
  | "accent"
  | "engineering"
  | "dark"
  | "light";

const gradientPresetClass: Record<GradientPreset, string | undefined> = {
  primary: styles.gradientPrimary,
  secondary: styles.gradientSecondary,
  hero: styles.gradientHero,
  accent: styles.gradientAccent,
  engineering: styles.gradientEngineering,
  dark: styles.gradientDark,
  light: styles.gradientLight,
};

export interface GradientLayerProps extends LayerProps {
  preset?: GradientPreset;
}

/** A flat gradient wash from the shared preset set. */
export function GradientLayer({
  preset = "primary",
  className,
}: GradientLayerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(styles.gradient, gradientPresetClass[preset], className)}
    />
  );
}
