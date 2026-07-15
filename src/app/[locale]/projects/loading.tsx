import { Container, Section, Skeleton } from "@/shared/ui";

/**
 * Loading skeleton for the projects showcase — mirrors the real layout: intro
 * header, the full-width featured hero, then the 1/2/3 card grid. Decorative
 * skeletons (`aria-hidden`); the region is `aria-busy`.
 */
export default function Loading() {
  return (
    <Section aria-busy="true">
      <Container className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
