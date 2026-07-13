import Link from "next/link";

import { mainNav } from "@/shared/config/site";
import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";

import { Container } from "./Container";
import { DesktopNav, type NavLinkItem } from "./DesktopNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";

export interface SiteHeaderProps {
  locale: Locale;
}

/**
 * Sticky site header — the primary navigation chrome. A Server Component that
 * resolves nav labels from the dictionary once and passes the (serializable)
 * link data to the client nav islands, so the header markup ships as HTML.
 * Desktop shows the inline nav + controls; narrow viewports collapse into the
 * {@link MobileNav} sheet. Opens with a skip link for keyboard users.
 */
export async function SiteHeader({ locale }: SiteHeaderProps) {
  const t = await getDictionary(locale);
  const items: NavLinkItem[] = mainNav.map((item) => ({
    key: item.key,
    href: localizedHref(locale, item.path),
    label: t.nav[item.key],
    isHome: item.path === "",
  }));

  return (
    <header className="sticky top-0 z-sticky border-b border-border bg-background">
      <a
        href="#main-content"
        className="sr-only rounded-md bg-surface px-4 py-2 text-foreground focus:not-sr-only focus:absolute focus:start-4 focus:top-2 focus:z-tooltip"
      >
        {t.nav.skipToContent}
      </a>
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href={localizedHref(locale, "")}
          className="text-h4 font-semibold text-foreground"
        >
          {t.name}
        </Link>

        <DesktopNav
          items={items}
          ariaLabel={t.nav.primary}
          className="hidden md:flex"
        />

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher label={t.nav.switchLanguage} />
            <ThemeToggle label={t.nav.toggleTheme} />
          </div>
          <MobileNav
            items={items}
            labels={{
              open: t.nav.menu,
              close: t.nav.close,
              nav: t.nav.primary,
              toggleTheme: t.nav.toggleTheme,
              switchLanguage: t.nav.switchLanguage,
            }}
            className="md:hidden"
          />
        </div>
      </Container>
    </header>
  );
}
