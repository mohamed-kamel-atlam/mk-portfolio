import {
  CircleCheck,
  FileText,
  PenTool,
  ScanEye,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Badge, Container, Section, SectionHeading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { aiPractices, aiTools, type AiPracticeKey } from "../content";
import { DeepDiveLink } from "./DeepDiveLink";
import { IconCard } from "./IconCard";

export interface AiAssistedProps {
  locale: Locale;
}

const PRACTICE_ICON: Record<AiPracticeKey, LucideIcon> = {
  architecture: PenTool,
  review: ScanEye,
  docsFirst: FileText,
  validation: CircleCheck,
};

/**
 * AI-assisted development (§7) — how AI accelerates the work while engineering
 * judgment stays human. The statement makes the boundary explicit; the practices
 * show the responsible use; the tools are named plainly. Links to the ai-workflow
 * doc. Reveals with `scale`.
 */
export async function AiAssisted({ locale }: AiAssistedProps) {
  const t = await getDictionary(locale);
  const section = t.engineering.ai;

  return (
    <Section>
      <Container>
        <RevealGroup variant="scale" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <Text
            size="body-lg"
            className="max-w-3xl text-pretty border-s-2 border-accent ps-6"
          >
            {section.statement}
          </Text>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aiPractices.map((key) => (
              <IconCard
                key={key}
                icon={PRACTICE_ICON[key]}
                title={section.practices[key].title}
                description={section.practices[key].description}
              />
            ))}
          </div>
          <ul className="flex flex-wrap gap-2">
            {aiTools.map((tool) => (
              <li key={tool}>
                <Badge variant="outline" className="text-muted-foreground">
                  <Sparkles aria-hidden="true" className="size-3.5" />
                  {tool}
                </Badge>
              </li>
            ))}
          </ul>
          <DeepDiveLink
            href={localizedHref(locale, "/engineering/ai-workflow")}
            label={t.engineering.readMore}
          />
        </RevealGroup>
      </Container>
    </Section>
  );
}
