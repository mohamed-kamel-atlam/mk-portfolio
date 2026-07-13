import { Container, Section, Skeleton } from "@/shared/ui";

/**
 * Route-level Loading UI for the whole `[locale]` segment — the automatic
 * Suspense fallback shown while a route streams in during navigation. A single
 * DRY, token-driven skeleton of the page shell (heading + content grid); the
 * region is marked `aria-busy` and the skeletons are decorative (`aria-hidden`).
 */
export default function Loading() {
  return (
    <Section aria-busy="true">
      <Container className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </Container>
    </Section>
  );
}
