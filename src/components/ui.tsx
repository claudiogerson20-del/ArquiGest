import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { Tone } from "@/lib/format";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------- botões */

const buttonVariants = {
  primary: "bg-invert text-on-invert hover:opacity-90",
  secondary: "border border-control bg-surface text-ink hover:bg-elevated",
  ghost: "text-muted hover:bg-elevated hover:text-ink",
  danger: "border border-danger/40 bg-surface text-danger hover:bg-danger-soft",
};

type Variant = keyof typeof buttonVariants;
type Size = "sm" | "md" | "icon";

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  icon: "size-9",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium tracking-tight",
    "transition-[opacity,background-color,border-color,transform] duration-200 ease-out active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-45",
    sizes[size],
    buttonVariants[variant],
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={cn(buttonClass(variant, size), className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={cn(buttonClass(variant, size), className)} {...props} />;
}

/* -------------------------------------------------------------------- campos */

const fieldClass =
  "w-full rounded-lg border border-control bg-surface px-3.5 text-sm text-ink placeholder:text-faint " +
  "transition-colors duration-200 hover:border-ink focus:border-accent focus:outline-none " +
  "focus:ring-4 focus:ring-accent/15 disabled:opacity-50";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldClass, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClass, "py-2.5 leading-relaxed", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(fieldClass, "h-11 cursor-pointer pr-9", className)} {...props} />;
}

export function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn("size-4 cursor-pointer rounded-xs accent-[var(--accent)]", className)}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

/* ------------------------------------------------------------------ badges */

const tones: Record<Tone, string> = {
  neutral: "bg-elevated text-muted",
  blue: "bg-info-soft text-info",
  amber: "bg-warning-soft text-warning",
  green: "bg-success-soft text-success",
  red: "bg-danger-soft text-danger",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ cartões */

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]", className)}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-6 py-5">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-ink">{title}</h2>
        {description && <p className="mt-1 max-w-prose text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="font-display text-xl text-ink">{title}</p>
      {children && <div className="mt-2 text-sm text-muted">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ cabeçalhos */

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6">
      <div>
        {eyebrow && <p className="label-tech mb-2">{eyebrow}</p>}
        <h1 className="font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-prose text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ progresso */

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={cn("h-px w-full bg-line-strong", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso do projeto"
    >
      <div
        className="h-px bg-accent transition-[width] duration-500 ease-[var(--ease-out-soft)]"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ métricas */

export function Stat({
  label,
  value,
  hint,
  alert,
}: {
  label: string;
  value: number | string;
  hint?: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface px-5 py-4">
      <p className="label-tech">{label}</p>
      <p
        className={cn(
          "mt-2 font-display text-3xl leading-none tabular-nums",
          alert ? "text-danger" : "text-ink",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
