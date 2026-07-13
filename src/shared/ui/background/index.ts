/**
 * Background & lighting system (`@/shared/ui/background`) — a reusable, pure-CSS
 * engine of composable layers (aurora, glow, grid, noise, gradients) selected by
 * variant. `ThemeBackground` is the global ambient backdrop; `SectionBackground`
 * lets any section pick its own mood. All layers are Server Components.
 */
export { ThemeBackground } from "./ThemeBackground";
export {
  SectionBackground,
  type SectionBackgroundProps,
} from "./SectionBackground";
export {
  AuroraLayer,
  GlowLayer,
  GridLayer,
  NoiseLayer,
  GradientLayer,
  type GlowLayerProps,
  type GlowPosition,
  type GradientLayerProps,
  type GradientPreset,
  type LayerProps,
} from "./layers";
export {
  BACKGROUND_VARIANTS,
  type BackgroundComposition,
  type BackgroundVariant,
} from "./variants";
