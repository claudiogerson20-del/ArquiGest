import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { Tone } from "@/lib/format";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------- botões */

const buttonVariants = {
  primary:
    "bg-primary text-on-primary shadow-[var(--shadow-button)] hover:bg-primary-hover active:translate-y-px",
  accent: "bg-accent text-on-accent hover:bg-accent-hover active:translate-y-px",
  secondary:
    "border border-control bg-surface text-ink shadow-[var(--shadow-card)] hover:border-ink hover:bg-elevated",
  ghost: "text-muted hover:bg-elevated hover:text-ink",
  danger: "border border-danger/35 bg-surface text-danger hover:bg-danger-soft",
};

type Variant = keyof typeof buttonVariants;
type Size = "sm" | "md" | "lg" | "icon";

const sizes: Record<Size, string> = {
  sm: "h-8 rounded-[10px] px-3 text-[13px]",
  md: "h-10 rounded-xl px-4 text-sm",
  lg: "h-12 rounded-xl px-6 text-[15px]",
  icon: "size-9 rounded-[10px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 font-medium whitespace-nowrap",
    "transition-[background-color,border-color,color,transform] duration-150",
    "disabled:pointer-events-none disabled:opacity-40",
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
  "w-full rounded-xl border border-control bg-surface px-3.5 text-sm text-ink placeholder:text-faint " +
  "transition-[border-color,box-shadow] duration-150 hover:border-ink " +
  "focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/8 disabled:opacity-50";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldClass, "h-10", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClass, "py-2.5 leading-relaxed", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(fieldClass, "h-10 cursor-pointer pr-9", className)} {...props} />;
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
      <span className="text-[13px] font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn("size-4 cursor-pointer rounded accent-[var(--ink)]", className)}
      {...props}
    />
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

const dotTones: Record<Tone, string> = {
  neutral: "bg-faint",
  blue: "bg-info",
  amber: "bg-warning",
  green: "bg-success",
  red: "bg-danger",
};

export function Badge({
  tone = "neutral",
  dot = false,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none",
        tones[tone],
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", dotTones[tone])} aria-hidden />}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ ícone em chip */

export function IconChip({
  children,
  tone = "neutral",
  size = "md",
}: {
  children: ReactNode;
  tone?: Tone | "accent";
  size?: "sm" | "md";
}) {
  const toneClass =
    tone === "accent"
      ? "bg-accent-soft text-accent"
      : tone === "neutral"
        ? "bg-elevated text-ink"
        : tones[tone];
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        size === "sm" ? "size-8 rounded-[10px]" : "size-10 rounded-xl",
        toneClass,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ painéis */

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[18px] border border-line bg-surface shadow-[var(--shadow-card)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-3">
      <div className="flex min-w-0 items-center gap-3">
        {icon}
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
          {description && <p className="mt-0.5 max-w-prose text-xs text-muted">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      {children && <div className="mx-auto mt-1 max-w-sm text-[13px] text-muted">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ cabeçalhos */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 max-w-prose text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ progresso */

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-sunken", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso do projeto"
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-[var(--ease-out-soft)]"
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
  tone = "neutral",
  icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: Tone;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[18px] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        {/* as etiquetas quebram de linha em vez de serem cortadas */}
        <p className="text-[13px] leading-snug text-muted">{label}</p>
        {icon && <IconChip size="sm" tone={tone === "red" ? "red" : "neutral"}>{icon}</IconChip>}
      </div>
      <p className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-display text-[32px] font-bold leading-none tracking-tight tabular-nums",
            tone === "red" ? "text-danger" : "text-ink",
          )}
        >
          {value}
        </span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ secções */

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold tracking-tight text-ink">{children}</h2>
      {action}
    </div>
  );
}
