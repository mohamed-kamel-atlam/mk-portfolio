import { cn } from "@/shared/lib/cn";

import {
  AuroraLayer,
  GlowLayer,
  GradientLayer,
  GridLayer,
  NoiseLayer,
} from "./layers";
import { BACKGROUND_VARIANTS, type BackgroundVariant } from "./variants";

export interface SectionBackgroundProps {
  /** The visual mood for this section (see {@link BACKGROUND_VARIANTS}). */
  variant?: BackgroundVariant;
  className?: string;
}

export function SectionBackground({
  variant = "default",
  className,
}: SectionBackgroundProps) {
  const composition = BACKGROUND_VARIANTS[variant];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-behind overflow-hidden",
        className,
      )}
    >
      {composition.gradient ? (
        <GradientLayer preset={composition.gradient} />
      ) : null}
      {composition.aurora ? <AuroraLayer /> : null}
      {composition.glows?.map((position) => (
        <GlowLayer
          key={position}
          position={position}
          floating={composition.floatingGlows}
        />
      ))}
      {composition.grid ? <GridLayer /> : null}
      {composition.noise ? <NoiseLayer /> : null}
    </div>
  );
}
