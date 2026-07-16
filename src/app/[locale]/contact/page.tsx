import type { Metadata } from "next";

import {
  Availability,
  ContactCta,
  ContactFormSection,
  ContactHero,
  ContactMethods,
  QuickFacts,
} from "@/features/contact";
import { defaultLocale, isLocale, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { buildRouteMetadata } from "@/shared/lib/seo";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const meta = (await getDictionary(active)).contact.meta;
  return buildRouteMetadata({
    locale: active,
    path: "/contact",
    title: meta.title,
    description: meta.description,
  });
}

/**
 * Contact (FR-010). A thin routing-layer composition: a premium hero, direct
 * contact-method cards, the message form (the page's single client island), what
 * I'm available for, quick facts, and a closing CTA. Every section is a Server
 * Component owning its own content; only the form runs on the client.
 */
export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;

  return (
    <>
      <ContactHero locale={active} />
      <ContactMethods locale={active} />
      <ContactFormSection locale={active} />
      <Availability locale={active} />
      <QuickFacts locale={active} />
      <ContactCta locale={active} />
    </>
  );
}
