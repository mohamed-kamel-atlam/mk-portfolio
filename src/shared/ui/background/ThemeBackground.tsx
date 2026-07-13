import { AuroraLayer, GlowLayer, NoiseLayer } from "./layers";

/**
 * The global ambient backdrop for the whole app — a single fixed, non-interactive
 * layer mounted once in the root layout, behind all content. It gives every page
 * the deep-navy canvas + soft aurora + top light + noise (the "alive but calm"
 * base); pages/sections can layer a stronger {@link SectionBackground} on top.
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
      <GlowLayer position="top" />
      <AuroraLayer />
      <NoiseLayer />
    </div>
  );
}
