import Link from "next/link";

import { mainNav } from "@/shared/config/site";
import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";

import { Container } from "./Container";
import { SocialLinks } from "./SocialLinks";
import { Text } from "./Text";

export interface SiteFooterProps {
  locale: Locale;
}

/**
 * Site footer — a static Server Component. Reuses the same `mainNav` source as
 * the header (no duplicated links). Social links render as accessible text
 * anchors with external-link safety; the copyright year is resolved at
 * build/render time.
 */
export async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getDictionary(locale);
  const year = new Date().getFullYear();
  const items = mainNav.map((item) => ({
    key: item.key,
    href: localizedHref(locale, item.path),
    label: t.nav[item.key],
  }));

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-8 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <nav
            aria-label={t.nav.footer}
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-small text-muted-foreground transition-colors duration-fast hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <SocialLinks variant="inline" />
        </div>

        <Text size="small" tone="muted">
          © {year} {t.name}. {t.footer.rights}
        </Text>
      </Container>
    </footer>
  );
}
