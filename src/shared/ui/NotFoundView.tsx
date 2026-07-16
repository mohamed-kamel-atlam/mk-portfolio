import { localizedHref, type Locale } from "@/shared/i18n/config";

import { ButtonLink } from "./ButtonLink";
import { Container } from "./Container";
import { Heading } from "./Heading";
import { Section } from "./Section";
import { Text } from "./Text";

// Localized copy for the 404 view. Kept inline (like the sibling error boundary)
// so this stays a dependency-light, self-contained view.
const COPY = {
  en: {
    code: "404",
    title: "Page not found",
    body: "The page you're looking for doesn't exist or may have moved.",
    cta: "Back to home",
  },
  ar: {
    code: "404",
    title: "الصفحة غير موجودة",
    body: "الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.",
    cta: "العودة إلى الرئيسية",
  },
} as const;

export interface NotFoundViewProps {
  locale: Locale;
}

export function NotFoundView({ locale }: NotFoundViewProps) {
  const copy = COPY[locale];

  return (
    <Section spacing="lg">
      <Container className="flex max-w-xl flex-col items-start gap-4">
        <Text size="caption" tone="muted" className="uppercase tabular-nums">
          {copy.code}
        </Text>
        <Heading level={1} size="display" className="text-balance">
          {copy.title}
        </Heading>
        <Text size="body-lg" tone="muted" className="text-pretty">
          {copy.body}
        </Text>
        <ButtonLink href={localizedHref(locale, "")} size="lg" className="mt-2">
          {copy.cta}
        </ButtonLink>
      </Container>
    </Section>
  );
}
