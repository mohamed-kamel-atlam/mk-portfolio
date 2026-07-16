import { socialLinks } from "@/shared/config/site";
import { cn } from "@/shared/lib/cn";

import styles from "./motion/motion.module.css";

const listVariants = {
  inline: "flex flex-wrap items-center gap-x-6 gap-y-2",
  stacked: "flex flex-col gap-3",
} as const;

// Both variants use the shared animated underline + color transition.
const linkVariants = {
  inline:
    "text-small text-muted-foreground transition-colors duration-fast hover:text-foreground",
  stacked:
    "text-body text-muted-foreground transition-colors duration-fast hover:text-foreground",
} as const;

export interface SocialLinksProps {
  /** `inline` — a compact horizontal row; `stacked` — a vertical list. */
  variant?: keyof typeof listVariants;
  className?: string;
}

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
              className={cn(styles.underline, linkVariants[variant])}
            >
              {social.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
