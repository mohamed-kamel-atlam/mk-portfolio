// Ambient declarations for stylesheet imports.
//
// Next.js compiles CSS through its own build pipeline; TypeScript still needs a
// module declaration so a side-effect import like `import "./globals.css"` in a
// layout resolves instead of reporting ts(2882). CSS Modules (if introduced
// later) additionally expose a class-name map.

declare module "*.css";

declare module "*.module.css" {
  const classes: { readonly [className: string]: string };
  export default classes;
}
