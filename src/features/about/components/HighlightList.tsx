import { Container, Section, SectionHeading, Text } from "@/shared/ui";

export interface HighlightListProps {
  eyebrow: string;
  title: string;
  intro?: string;
  items: readonly string[];
  /** Optional Section background override (e.g. muted band for rhythm). */
  className?: string;
}

/**
 * Feature-internal layout shared by Current Focus and Future Goals — a section
 * heading plus a marker list. Defined once so the two structurally identical
 * sections never duplicate markup.
 */
export function HighlightList({
  eyebrow,
  title,
  intro,
  items,
  className,
}: HighlightListProps) {
  return (
    <Section className={className}>
      <Container className="flex flex-col gap-10">
        <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                className="mt-2 size-2 shrink-0 rounded-full bg-accent"
                aria-hidden="true"
              />
              <Text tone="muted" className="text-pretty">
                {item}
              </Text>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
