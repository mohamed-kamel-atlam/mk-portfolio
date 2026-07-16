import { NextResponse, type NextRequest } from "next/server";

import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  locales,
  type Locale,
} from "@/shared/i18n/config";

function detectLocale(request: NextRequest): Locale {
  const override = request.cookies.get(LOCALE_COOKIE)?.value;
  if (override && isLocale(override)) return override;

  const header = request.headers.get("accept-language");
  if (header) {
    for (const part of header.split(",")) {
      const tag = part.split(";")[0]?.trim().toLowerCase() ?? "";
      const base = tag.split("-")[0] ?? "";
      if (isLocale(base)) return base;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const hasLocalePrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocalePrefix) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals, API routes, and any path with a
  // file extension (icon.svg, sitemap.xml, robots.txt, images, …), plus the
  // generated `apple-icon` metadata route (extensionless, so not matched above).
  matcher: ["/((?!_next/|api/|apple-icon|.*\\..*).*)"],
};
