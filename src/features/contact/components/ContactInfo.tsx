import { socialLinks } from "@/shared/config/site";
import { Heading, Text } from "@/shared/ui";

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
      <ul className="flex flex-col gap-3">
        {socialLinks.map((social) => {
          const isExternal = social.href.startsWith("http");
          return (
            <li key={social.key}>
              <a
                href={social.href}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-body text-muted-foreground underline-offset-4 transition-colors duration-fast hover:text-foreground hover:underline"
              >
                {social.label}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
