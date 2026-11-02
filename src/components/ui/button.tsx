import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(2_6_16/0.4),0_8px_20px_-10px_rgb(59_130_246/0.7)] hover:bg-primary-hover disabled:bg-primary/50",
  secondary:
    "border border-border-strong bg-card text-text shadow-sm hover:border-accent/40 hover:bg-card-hover",
  ghost: "text-muted hover:bg-card hover:text-text",
  danger: "bg-error/90 text-white shadow-sm hover:bg-error",
  outline: "border border-primary/50 text-light-blue hover:border-primary hover:bg-primary/10",
};

const sizes = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
  icon: "h-10 w-10",
};

type Common = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

export function buttonClasses({ variant = "primary", size = "md", className }: Common = {}) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-[background-color,border-color,color,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-60",
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
