import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Square triangle mark, cropped from the brand logo. */
export function LogoMark({ className, size = 36 }: { className?: string; size?: number }) {
  return <Image src="/brand/apollo-mark.png" alt="Apollo Group TV logo" width={size} height={size} className={cn("shrink-0", className)} />;
}

/** Full brand logo (mark + "Apollo Group TV" wordmark). Source image is 1500×310. */
export function Logo({ className, height = 40, priority }: { className?: string; height?: number; priority?: boolean }) {
  const width = Math.round((1500 / 310) * height);
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label="Apollo Group TV home">
      <Image
        src="/brand/apollo-logo.webp"
        alt="Apollo Group TV"
        width={width}
        height={height}
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        className="h-auto max-w-full"
        style={{ width, height: "auto" }}
      />
    </Link>
  );
}
