import { Container, Section, Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <Section aria-busy="true">
      <Container className="flex max-w-3xl flex-col gap-8">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-20 rounded-full" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Container>
    </Section>
  );
}
