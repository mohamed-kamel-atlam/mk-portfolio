import { Heading, SocialLinks, Text } from "@/shared/ui";

export interface ContactInfoProps {
  title: string;
  subtitle: string;
}

/**
 * Alternative contact channels beside the form — a direct email and social
 * links from the single site config. Presentational Server Component.
 */
export function ContactInfo({ title, subtitle }: ContactInfoProps) {
  return (
    <aside className="flex flex-col gap-4">
      <Heading level={2} size="h4">
        {title}
      </Heading>
      <Text tone="muted" className="text-pretty">
        {subtitle}
      </Text>
      <SocialLinks variant="stacked" />
    </aside>
  );
}
