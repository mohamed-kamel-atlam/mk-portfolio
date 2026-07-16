import { Scale } from "lucide-react";

import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import {
  Card,
  Container,
  Heading,
  Section,
  SectionHeading,
  Text,
} from "@/shared/ui";
import { GlowLayer } from "@/shared/ui/background";
import { RevealGroup } from "@/shared/ui/motion";

import { DECISIONS_DOC_SLUG, engineeringDecisions } from "../content";
import { DeepDiveLink } from "./DeepDiveLink";

export interface EngineeringDecisionsProps {
  locale: Locale;
}

export async function EngineeringDecisions({
  locale,
}: EngineeringDecisionsProps) {
  const t = await getDictionary(locale);
  const section = t.engineering.decisions;

  return (
    <Section className="section-muted relative isolate overflow-hidden">
      <GlowLayer position="top" />
      <Container>
        <RevealGroup variant="scale" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <RevealGroup
            variant="up"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {engineeringDecisions.map((key) => {
              const item = section.items[key];
              return (
                <Card
                  key={key}
                  interactive
                  className="group/adr flex h-full flex-col gap-3"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-accent transition-colors duration-fast group-hover/adr:border-accent">
                    <Scale aria-hidden="true" className="size-5" />
                  </span>
                  <Heading level={3} size="h4">
                    {item.title}
                  </Heading>
                  <Text tone="muted" className="text-pretty">
                    {item.explanation}
                  </Text>
                  <div className="mt-auto border-t border-border pt-3">
                    <p className="text-caption uppercase text-accent">
                      {section.tradeoffLabel}
                    </p>
                    <Text size="small" tone="muted" className="text-pretty">
                      {item.tradeoff}
                    </Text>
                  </div>
                </Card>
              );
            })}
          </RevealGroup>
          <DeepDiveLink
            href={localizedHref(locale, `/engineering/${DECISIONS_DOC_SLUG}`)}
            label={section.docCta}
          />
        </RevealGroup>
      </Container>
    </Section>
  );
}
