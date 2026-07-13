import { socialLinks } from "@/shared/config/site";
import { cn } from "@/shared/lib/cn";

const listVariants = {
  inline: "flex flex-wrap items-center gap-x-6 gap-y-2",
  stacked: "flex flex-col gap-3",
} as const;

const linkVariants = {
  inline:
    "text-small text-muted-foreground transition-colors duration-fast hover:text-foreground",
  stacked:
    "text-body text-muted-foreground underline-offset-4 transition-colors duration-fast hover:text-foreground hover:underline",
} as const;

export interface SocialLinksProps {
  /** `inline` — a compact horizontal row; `stacked` — a vertical list. */
  variant?: keyof typeof listVariants;
  className?: string;
}

/**
 * The social/contact links from the single site config, rendered as accessible
 * text anchors with external-link safety. Defined once so Hero, About, Contact,
 * and the footer never re-derive the `isExternal` check or drift on styling.
 */
export function SocialLinks({
  variant = "inline",
  className,
}: SocialLinksProps) {
  return (
    <ul className={cn(listVariants[variant], className)}>
      {socialLinks.map((social) => {
        const isExternal = social.href.startsWith("http");
        return (
          <li key={social.key}>
            <a
              href={social.href}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={linkVariants[variant]}
            >
              {social.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
