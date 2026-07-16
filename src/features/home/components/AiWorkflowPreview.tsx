import { CircleCheck, FileText, GitPullRequest } from "lucide-react";

import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import {
  ButtonLink,
  Container,
  Heading,
  Section,
  SectionHeading,
  Text,
} from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

export interface AiWorkflowPreviewProps {
  locale: Locale;
}

const POINT_ORDER = ["documentation", "decisions", "verification"] as const;
const POINT_ICON = {
  documentation: FileText,
  decisions: GitPullRequest,
  verification: CircleCheck,
} as const;

export async function AiWorkflowPreview({ locale }: AiWorkflowPreviewProps) {
  const t = await getDictionary(locale);
  const section = t.home.ai;

  return (
    <Section>
      <Container>
        <RevealGroup variant="up" className="flex flex-col items-start gap-10">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <RevealGroup
            variant="up"
            as="ul"
            className="grid w-full gap-6 sm:grid-cols-3"
          >
            {POINT_ORDER.map((key) => {
              const point = section.points[key];
              const Icon = POINT_ICON[key];
              return (
                <li key={key} className="group/point flex flex-col gap-2">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-accent transition-colors duration-fast group-hover/point:border-accent">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <Heading level={3} size="h4">
                    {point.title}
                  </Heading>
                  <Text tone="muted" className="text-pretty">
                    {point.description}
                  </Text>
                </li>
              );
            })}
          </RevealGroup>
          <ButtonLink
            href={localizedHref(locale, "/engineering")}
            variant="secondary"
            trailingArrow
          >
            {section.cta}
          </ButtonLink>
        </RevealGroup>
      </Container>
    </Section>
  );
}
