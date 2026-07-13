import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { ButtonLink, Container, Section, SectionHeading } from "@/shared/ui";

export interface AiWorkflowPreviewProps {
  locale: Locale;
}

/** A concise preview of the AI-assisted engineering method, linking to depth. */
export async function AiWorkflowPreview({ locale }: AiWorkflowPreviewProps) {
  const t = await getDictionary(locale);
  const section = t.home.ai;

  return (
    <Section>
      <Container className="flex flex-col items-start gap-6">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
        />
        <ButtonLink
          href={localizedHref(locale, "/engineering")}
          variant="secondary"
        >
          {section.cta}
        </ButtonLink>
      </Container>
    </Section>
  );
}
