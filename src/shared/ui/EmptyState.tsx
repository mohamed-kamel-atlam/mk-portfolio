import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { Heading } from "./Heading";
import { Text } from "./Text";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional leading icon (decorative). */
  icon?: ReactNode;
  /** Localized headline. */
  title: string;
  /** Optional localized supporting copy. */
  description?: string;
  /** Optional call-to-action, e.g. a Button. */
  action?: ReactNode;
}

/**
 * A centered "no content" state — for empty lists, no search results, or error
 * placeholders. Composes {@link Heading} and {@link Text} for consistent
 * typography; `title`/`description` are localized by the caller.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="text-muted-foreground" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <Heading level={2} size="h4">
        {title}
      </Heading>
      {description ? (
        <Text tone="muted" className="max-w-prose">
          {description}
        </Text>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
