import { Container, Section, Skeleton } from "@/shared/ui";

/**
 * Loading skeleton for an engineering article — back link, title, meta, then a
 * prose column of lines matching the reading measure. `aria-busy` region.
 */
export default function Loading() {
  return (
    <Section aria-busy="true">
      <Container className="flex max-w-prose flex-col gap-8">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Container>
    </Section>
  );
}
