import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Section, SectionHeading } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { ContactForm } from "./ContactForm";

export interface ContactFormSectionProps {
  locale: Locale;
}

/**
 * Contact form section (§4) — a Server Component that owns the heading and the
 * `#contact-form` anchor (the hero/CTA scroll target), and mounts the form as
 * the page's single client island. Centered for focus; reveals with `up`.
 */
export async function ContactFormSection({ locale }: ContactFormSectionProps) {
  const t = await getDictionary(locale);
  const c = t.contact;

  return (
    <Section id="contact-form" className="scroll-mt-24">
      <Container className="max-w-2xl">
        <RevealGroup variant="up" className="flex flex-col gap-8">
          <SectionHeading
            eyebrow={c.form.eyebrow}
            title={c.form.title}
            intro={c.form.intro}
          />
          <ContactForm copy={c.form} errors={c.errors} success={c.success} />
        </RevealGroup>
      </Container>
    </Section>
  );
}
