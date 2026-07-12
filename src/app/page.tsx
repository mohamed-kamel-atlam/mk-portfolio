import { siteConfig } from "@/shared/config/site";
import { ThemeToggle } from "@/shared/ui";

/**
 * Temporary bootstrap placeholder (M0).
 *
 * This exists only so the foundation builds and can be verified end-to-end. It
 * is NOT a product page. The real landing page is introduced at M5 and the
 * `[locale]` routing frame at M2 (docs/product/ROADMAP.md,
 * docs/engineering/FOLDER_STRUCTURE.md §2.1). It is a Server Component and uses
 * design tokens only — no hardcoded values, no feature logic.
 *
 * The ThemeToggle is a reusable `shared/ui` Client leaf; it moves into the site
 * header when that is built (M3).
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-4 px-6 py-24">
      <div className="fixed end-6 top-6 z-sticky">
        <ThemeToggle />
      </div>
      <p className="font-mono text-caption uppercase text-muted-foreground">
        Foundation ready
      </p>
      <h1 className="text-display text-foreground">{siteConfig.name}</h1>
      <p className="text-body-lg text-muted-foreground">
        {siteConfig.description}
      </p>
      <p className="text-small text-muted-foreground">
        Repository foundation initialized. Implementation begins at milestone
        M1.
      </p>
    </main>
  );
}
