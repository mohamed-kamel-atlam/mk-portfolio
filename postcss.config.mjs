/**
 * PostCSS configuration.
 *
 * Tailwind CSS (v3) + Autoprefixer. Tailwind's theme is a projection of the
 * design tokens defined in src/app/globals.css — see docs/design/DESIGN_TOKENS.md §7.
 *
 * @type {import('postcss-load-config').Config}
 */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
