/**
 * Motion & interaction system (`@/shared/ui/motion`) — the application's shared
 * interaction language. CSS-first, token-driven (MOTION_GUIDELINES), with minimal
 * client islands only where JS is required (scroll/pointer). Every primitive is
 * reduced-motion-aware and RTL-safe.
 *
 * - On-load entrance (Server, zero JS): AnimateIn / FadeIn / SlideIn / ScaleIn.
 * - Scroll reveal (Client island): Reveal.
 * - Pointer effects (Client island): Magnetic.
 * - Content effects (Client island): Typewriter.
 */
export {
  AnimateIn,
  FadeIn,
  SlideIn,
  ScaleIn,
  type AnimateInProps,
  type AnimateInVariant,
} from "./animate";
export { Reveal, type RevealProps } from "./Reveal";
export { Magnetic, type MagneticProps } from "./Magnetic";
export { Typewriter, type TypewriterProps } from "./Typewriter";
