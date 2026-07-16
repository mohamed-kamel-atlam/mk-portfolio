import type { Metadata } from "next";

import { defaultLocale, isLocale, type Locale } from "@/shared/i18n/config";
import { NotFoundView } from "@/shared/ui";

interface CatchAllProps {
  params: Promise<{ locale: string; rest: string[] }>;
}

// Render on demand for any unknown path (the locale segment sets
// `dynamicParams = false`; the catch-all must accept arbitrary segments).
export const dynamicParams = true;

const TITLE: Record<Locale, string> = {
  en: "Page not found",
  ar: "الصفحة غير موجودة",
};

/** Unknown paths must not be indexed (avoids a soft-404 entering the index). */
export async function generateMetadata({
  params,
}: CatchAllProps): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  return { title: TITLE[active], robots: { index: false, follow: false } };
}

export default async function CatchAllNotFound({ params }: CatchAllProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  return <NotFoundView locale={active} />;
}
