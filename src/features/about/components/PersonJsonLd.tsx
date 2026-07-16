import { siteConfig, socialLinks } from "@/shared/config/site";
import { locales, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";

export interface PersonJsonLdProps {
  locale: Locale;
}

/** Topics Mohamed works in — canonical (English) terms for search engines. */
const KNOWS_ABOUT = [
  "Frontend Engineering",
  "React",
  "TypeScript",
  "Next.js",
  "Design Systems",
  "Web Accessibility",
  "AI Product Engineering",
] as const;

export async function PersonJsonLd({ locale }: PersonJsonLdProps) {
  const t = await getDictionary(locale);
  const p = t.about.jsonLd;

  const hrefOf = (key: (typeof socialLinks)[number]["key"]) =>
    socialLinks.find((social) => social.key === key)?.href;

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    url: `${siteConfig.url}/${locale}/about`,
    jobTitle: p.jobTitle,
    description: t.about.meta.description,
    email: hrefOf("email")?.replace("mailto:", ""),
    sameAs: [hrefOf("github"), hrefOf("linkedin")].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressLocality: p.locality,
      addressCountry: "EG",
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: p.alumniOf },
    knowsLanguage: [...locales],
    knowsAbout: [...KNOWS_ABOUT],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
