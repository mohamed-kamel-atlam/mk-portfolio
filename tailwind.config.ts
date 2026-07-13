import type { Config } from "tailwindcss";

/**
 * Tailwind theme = a projection of the design tokens, never a parallel system.
 *
 * Every utility below resolves to a CSS custom property defined in
 * `src/app/globals.css`. The token names are canonical and owned by the design
 * docs; this file only wires Tailwind to read them, so a theme switch flows
 * through Tailwind-styled and raw-CSS-styled elements identically.
 *
 * Sources of truth:
 * - docs/design/DESIGN_TOKENS.md  (system, structural values, this mapping)
 * - docs/design/COLOR_SYSTEM.md   (color values)
 * - docs/design/TYPOGRAPHY.md     (font families, type scale)
 * - docs/design/MOTION_GUIDELINES.md (durations, easings)
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  // Dark is the default theme (declared on :root); light is opt-in via the
  // data-theme attribute. Token semantics handle most theming, but this keeps
  // the `dark:` variant available and correct if ever needed.
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        surface: "var(--color-surface)",
        "surface-muted": "var(--color-surface-muted)",
        border: "var(--color-border)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        accent: "var(--color-accent)",
        "accent-foreground": "var(--color-accent-foreground)",
        success: "var(--color-success)",
        "success-foreground": "var(--color-success-foreground)",
        warning: "var(--color-warning)",
        "warning-foreground": "var(--color-warning-foreground)",
        danger: "var(--color-danger)",
        "danger-foreground": "var(--color-danger-foreground)",
        info: "var(--color-info)",
        "info-foreground": "var(--color-info-foreground)",
        overlay: "var(--color-overlay)",
      },
      // Steps mirror --space-* (the 8-pt grid) exactly; each equals its Tailwind
      // default, but is re-pointed at the token so the two never diverge.
      spacing: {
        "0": "var(--space-0)",
        "1": "var(--space-1)",
        "2": "var(--space-2)",
        "3": "var(--space-3)",
        "4": "var(--space-4)",
        "6": "var(--space-6)",
        "8": "var(--space-8)",
        "10": "var(--space-10)",
        "12": "var(--space-12)",
        "16": "var(--space-16)",
        "20": "var(--space-20)",
        "24": "var(--space-24)",
        "32": "var(--space-32)",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      zIndex: {
        base: "var(--z-base)",
        raised: "var(--z-raised)",
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        overlay: "var(--z-overlay)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        toast: "var(--z-toast)",
        tooltip: "var(--z-tooltip)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      // Type scale (Display → Caption). Large steps use fluid clamp() vars;
      // smaller steps are fixed rem. line-height / tracking / weight per TYPOGRAPHY.md §2.
      fontSize: {
        display: [
          "var(--font-size-display)",
          {
            lineHeight: "var(--leading-display)",
            letterSpacing: "var(--tracking-display)",
            fontWeight: "var(--weight-semibold)",
          },
        ],
        h1: [
          "var(--font-size-h1)",
          {
            lineHeight: "var(--leading-h1)",
            letterSpacing: "var(--tracking-h1)",
            fontWeight: "var(--weight-semibold)",
          },
        ],
        h2: [
          "var(--font-size-h2)",
          {
            lineHeight: "var(--leading-h2)",
            letterSpacing: "var(--tracking-h2)",
            fontWeight: "var(--weight-semibold)",
          },
        ],
        h3: [
          "var(--font-size-h3)",
          {
            lineHeight: "var(--leading-h3)",
            letterSpacing: "var(--tracking-h3)",
            fontWeight: "var(--weight-semibold)",
          },
        ],
        h4: [
          "var(--font-size-h4)",
          {
            lineHeight: "var(--leading-h4)",
            letterSpacing: "var(--tracking-h4)",
            fontWeight: "var(--weight-semibold)",
          },
        ],
        "body-lg": [
          "var(--font-size-body-lg)",
          {
            lineHeight: "var(--leading-body-lg)",
            fontWeight: "var(--weight-regular)",
          },
        ],
        body: [
          "var(--font-size-body)",
          {
            lineHeight: "var(--leading-body)",
            fontWeight: "var(--weight-regular)",
          },
        ],
        small: [
          "var(--font-size-small)",
          {
            lineHeight: "var(--leading-small)",
            fontWeight: "var(--weight-regular)",
          },
        ],
        caption: [
          "var(--font-size-caption)",
          {
            lineHeight: "var(--leading-caption)",
            letterSpacing: "var(--tracking-caption)",
            fontWeight: "var(--weight-medium)",
          },
        ],
      },
      fontWeight: {
        regular: "var(--weight-regular)",
        medium: "var(--weight-medium)",
        semibold: "var(--weight-semibold)",
      },
      maxWidth: {
        container: "var(--container-max)",
        prose: "var(--container-prose)",
      },
      // Named breakpoints Tablet…Wide (Mobile is the base). Aligns with Tailwind
      // md/lg/xl/2xl so a utility prefix and a token never disagree.
      screens: {
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        decelerate: "var(--ease-decelerate)",
        accelerate: "var(--ease-accelerate)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(var(--space-2))" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        // Enter transitions. Reduced-motion is honored by the global rule in
        // globals.css and by `motion-safe:` usage at call sites.
        "fade-in": "fade-in var(--duration-normal) var(--ease-decelerate)",
        "fade-in-up":
          "fade-in-up var(--duration-slow) var(--ease-decelerate) both",
      },
    },
  },
  plugins: [],
};

export default config;
