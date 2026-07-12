import { cn } from "@/shared/lib/cn";
import { Heading, Text } from "@/shared/ui";

export interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "start" | "center";
  className?: string;
}

/**
 * The shared heading pattern for every home section — an accent eyebrow, an
 * `<h2>`, and an optional intro. Defined once so section layouts are never
 * duplicated. Composes the shared Heading/Text primitives; the eyebrow uses the
 * caption token (tracking resets in RTL) so it reads correctly in both scripts.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <span className="text-caption uppercase text-accent">{eyebrow}</span>
      <Heading level={2} size="h2" className="text-balance">
        {title}
      </Heading>
      {intro ? (
        <Text
          size="body-lg"
          tone="muted"
          className={cn(
            "max-w-2xl text-pretty",
            align === "center" && "mx-auto",
          )}
        >
          {intro}
        </Text>
      ) : null}
    </div>
  );
}
