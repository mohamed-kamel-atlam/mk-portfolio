import { Hero } from "@/features/home";
import { defaultLocale, isLocale, type Locale } from "@/shared/i18n/config";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Landing page (M3). A thin routing-layer composition: it resolves the locale
 * and renders the home feature's sections. The hero is the first; further
 * sections (selected projects, engineering philosophy, …) are added here as
 * they are built (FR-003).
 */
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;

  return <Hero locale={active} />;
}
