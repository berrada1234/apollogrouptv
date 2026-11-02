import { Skeleton } from "@/components/ui/misc";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-3 h-4 w-72" />
      <Skeleton className="mt-8 h-16 rounded-card" />
      <Skeleton className="mt-4 h-96 rounded-card" />
    </div>
  );
}
