import {
  AuroraLayer,
  GlowLayer,
  GradientLayer,
  NoiseLayer,
  VignetteLayer,
} from "./layers";

/**
 * The global ambient backdrop for the whole app — a single fixed, non-interactive
 * layer mounted once in the root layout, behind all content. Layered for depth:
 * a soft gradient wash + top light + slow multi-blob aurora + noise + a subtle
 * edge vignette — the "alive but calm" base. Pages/sections can layer a stronger
 * {@link SectionBackground} on top.
 *
 * Fixed so the ambience stays put while content scrolls (parallax-free, GPU
 * compositor only). A Server Component — zero client JS, no re-renders.
 */
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
