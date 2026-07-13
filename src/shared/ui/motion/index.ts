/**
 * Motion & interaction system (`@/shared/ui/motion`) — the application's shared
 * interaction language. CSS-first, token-driven (MOTION_GUIDELINES), with minimal
 * client islands only where JS is required (scroll/pointer). Every primitive is
 * reduced-motion-aware and RTL-safe.
 *
 * - On-load entrance (Server, zero JS): AnimateIn / FadeIn / SlideIn / ScaleIn.
 * - Scroll reveal (Client island): Reveal, StaggerReveal.
 * - Pointer effects (Client islands): Magnetic, CursorGlow, MouseParallax.
 * - Content effects (Client islands): CountUp, Typewriter.
 * - Links (Server): AnimatedLink.
 * - Interaction styling: the `interactionVariants` shared with buttons/cards.
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
export { StaggerReveal, type StaggerRevealProps } from "./StaggerReveal";
export { Magnetic, type MagneticProps } from "./Magnetic";
export { CursorGlow, type CursorGlowProps } from "./CursorGlow";
export { MouseParallax, type MouseParallaxProps } from "./MouseParallax";
export { CountUp, type CountUpProps } from "./CountUp";
export { Typewriter, type TypewriterProps } from "./Typewriter";
export { AnimatedLink, type AnimatedLinkProps } from "./AnimatedLink";
