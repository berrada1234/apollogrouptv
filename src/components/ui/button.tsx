import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "btn-sheen bg-[image:var(--spectrum)] text-on-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.45),0_1px_2px_rgb(0_0_0/0.4),0_10px_30px_-10px_rgb(122_162_255/0.75)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_1px_2px_rgb(0_0_0/0.4),0_14px_36px_-10px_rgb(122_162_255/0.95)] hover:-translate-y-px disabled:opacity-50",
  secondary:
    "border border-border-strong bg-white/[0.04] text-text shadow-sm backdrop-blur-sm hover:border-accent/45 hover:bg-white/[0.08]",
  ghost: "text-muted hover:bg-white/[0.06] hover:text-text",
  danger: "bg-error/90 text-white shadow-sm hover:bg-error",
  outline: "border border-primary/50 text-light-blue hover:border-primary hover:bg-primary/10",
};

const sizes = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-7 text-[15px]",
  icon: "h-10 w-10",
};

type Common = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

export function buttonClasses({ variant = "primary", size = "md", className }: Common = {}) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,border-color,color,transform,box-shadow] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  loading,
  children,
  disabled,
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: Common & React.ComponentProps<typeof Link>) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
