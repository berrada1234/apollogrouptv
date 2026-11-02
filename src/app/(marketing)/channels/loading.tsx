import { Container, Skeleton } from "@/components/ui/misc";

export default function Loading() {
  return (
    <Container className="py-20" aria-busy="true" aria-label="Loading channels">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mt-6 h-12 w-full" />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] rounded-card" />
        ))}
      </div>
    </Container>
  );
}
