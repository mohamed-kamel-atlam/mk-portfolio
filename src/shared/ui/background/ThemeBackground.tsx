import {
  AuroraLayer,
  GlowLayer,
  GradientLayer,
  NoiseLayer,
  VignetteLayer,
} from "./layers";

export function ThemeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-behind overflow-hidden"
    >
      <GradientLayer preset="primary" />
      <GlowLayer position="top" />
      <AuroraLayer />
      <NoiseLayer />
      <VignetteLayer />
    </div>
  );
}
