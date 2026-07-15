import { Container, Section, Skeleton } from "@/shared/ui";

/**
 * Loading skeleton for the contact page — intro header plus a form of labelled
 * fields and a submit button, matching the real layout. `aria-busy` region.
 */
export default function Loading() {
  return (
    <Section aria-busy="true">
      <Container className="flex max-w-xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-28 w-full rounded-md" />
          </div>
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </Container>
    </Section>
  );
}
