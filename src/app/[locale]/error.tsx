"use client";

import { usePathname } from "next/navigation";

import { Button, Container, Heading, Section, Text } from "@/shared/ui";

// Branded, localized error boundary for the locale segment. Must be a Client
// Component (Next convention); reads the locale from the path and offers a retry.
const COPY = {
  en: {
    title: "Something went wrong",
    body: "An unexpected error occurred. Please try again.",
    retry: "Try again",
  },
  ar: {
    title: "حدث خطأ ما",
    body: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    retry: "إعادة المحاولة",
  },
} as const;

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = usePathname().split("/")[1] === "ar" ? "ar" : "en";
  const copy = COPY[locale];

  return (
    <Section spacing="lg">
      <Container className="flex max-w-xl flex-col items-start gap-4">
        <Heading level={1} size="display" className="text-balance">
          {copy.title}
        </Heading>
        <Text size="body-lg" tone="muted" className="text-pretty">
          {copy.body}
        </Text>
        <Button onClick={reset} size="lg" className="mt-2">
          {copy.retry}
        </Button>
      </Container>
    </Section>
  );
}
