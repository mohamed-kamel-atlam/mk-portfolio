import type { Metadata } from "next";

import { fontVariables } from "@/shared/config/fonts";
import { ButtonLink, Container, Heading, Section, Text } from "@/shared/ui";

import "./globals.css";

export const metadata: Metadata = { title: "404 — Page not found" };

/**
 * Global 404 — the branded fallback for unmatched URLs and any `notFound()` that
 * no nested boundary catches. Because the localized app shell is the `[locale]`
 * layout (there is no `app/layout.tsx` by design — INTERNATIONALIZATION.md §4),
 * this boundary sits *outside* that shell and must supply its own document
 * (`<html>`/`<body>`, fonts, theme, styles). Copy is in the default language,
 * since a boundary receives no locale.
 */
export default function NotFound() {
  return (
    <html
      lang="en"
      dir="ltr"
      data-theme="dark"
      className={fontVariables}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <main className="flex flex-1 items-center">
          <Section spacing="lg" className="w-full">
            <Container className="flex max-w-xl flex-col items-start gap-4">
              <Text
                size="caption"
                tone="muted"
                className="uppercase tabular-nums"
              >
                404
              </Text>
              <Heading level={1} size="display" className="text-balance">
                Page not found
              </Heading>
              <Text size="body-lg" tone="muted" className="text-pretty">
                The page you&rsquo;re looking for doesn&rsquo;t exist or may
                have moved.
              </Text>
              <ButtonLink href="/" size="lg" className="mt-2">
                Back to home
              </ButtonLink>
            </Container>
          </Section>
        </main>
      </body>
    </html>
  );
}
