import {
  defaultLocale,
  direction,
  isLocale,
  type Locale,
} from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { cn } from "@/shared/lib/cn";
import { LanguageSwitcher, ThemeToggle } from "@/shared/ui";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Temporary bootstrap placeholder, fully localized (M2). Every visible string is
 * resolved from the server-loaded dictionary for the active locale, so the page
 * renders in English at `/en` and Arabic at `/ar` — text ships as HTML with no
 * translation runtime on the client. It is a Server Component; the switcher and
 * theme toggle are the only Client leaves. The real landing page arrives at M5.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const t = await getDictionary(active);

  // The mono/uppercase eyebrow is a Latin typographic device. In RTL we branch
  // on *direction* (never on "is this Arabic") and use the connected sans, since
  // monospace breaks Arabic cursive joins (TYPOGRAPHY.md §4).
  const isRtl = direction(active) === "rtl";

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-4 px-6 py-24">
      <div className="fixed end-6 top-6 z-sticky flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <p
        className={cn(
          "text-caption text-muted-foreground",
          isRtl ? "font-sans" : "font-mono uppercase",
        )}
      >
        {t.foundationEyebrow}
      </p>
      <h1 className="text-display text-foreground">{t.name}</h1>
      <p className="text-body-lg text-muted-foreground">{t.tagline}</p>
      <p className="text-small text-muted-foreground">{t.note}</p>
    </main>
  );
}
