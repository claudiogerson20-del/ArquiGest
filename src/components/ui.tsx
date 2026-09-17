import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { Tone } from "@/lib/format";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------- botões */

const buttonVariants = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "border border-control bg-surface text-ink hover:bg-elevated",
  ghost: "text-muted hover:bg-elevated hover:text-ink",
  danger: "border border-danger/40 bg-surface text-danger hover:bg-danger-soft",
};

type Variant = keyof typeof buttonVariants;
type Size = "sm" | "md" | "icon";

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-4 text-sm",
  icon: "size-8",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md font-medium tracking-tight whitespace-nowrap",
    "transition-colors duration-150 disabled:pointer-events-none disabled:opacity-45",
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
  "w-full rounded-md border border-control bg-surface px-2.5 text-sm text-ink placeholder:text-faint " +
  "transition-colors duration-150 hover:border-ink focus:border-accent focus:outline-none " +
  "focus:ring-2 focus:ring-accent/25 disabled:opacity-50";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldClass, "h-9", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClass, "py-2 leading-relaxed", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(fieldClass, "h-9 cursor-pointer pr-8", className)} {...props} />;
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
    <label className={cn("flex flex-col gap-1", className)}>
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
      className={cn("size-4 cursor-pointer rounded-xs accent-[var(--accent)]", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ badges */

const tones: Record<Tone, string> = {
  neutral: "bg-elevated text-muted ring-line-strong",
  blue: "bg-info-soft text-info ring-info/25",
  amber: "bg-warning-soft text-warning ring-warning/25",
  green: "bg-success-soft text-success ring-success/25",
  red: "bg-danger-soft text-danger ring-danger/25",
};

const dotTones: Record<Tone, string> = {
  neutral: "bg-control",
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
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        tones[tone],
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", dotTones[tone])} aria-hidden />}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ painéis */

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-lg border border-line bg-surface shadow-[var(--shadow-card)]", className)}
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
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
      <div className="min-w-0">
        <h2 className="text-[13px] font-semibold tracking-tight text-ink">{title}</h2>
        {description && <p className="mt-0.5 max-w-prose text-xs text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-4 py-10 text-center">
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
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-0.5 max-w-prose text-[13px] text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ progresso */

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={cn("h-1 w-full overflow-hidden rounded-full bg-sunken", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso do projeto"
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500 ease-[var(--ease-out-soft)]"
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
    <div className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3.5 py-3 sm:px-4">
      {icon && (
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md",
            tone === "red" ? "bg-danger-soft text-danger" : "bg-elevated text-muted",
          )}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0">
        {/* as etiquetas quebram de linha em vez de serem cortadas */}
        <p className="label-tech leading-[1.35]">{label}</p>
        <p className="mt-1 flex items-baseline gap-1.5">
          <span
            className={cn(
              "font-mono text-xl font-medium leading-none tabular-nums",
              tone === "red" ? "text-danger" : "text-ink",
            )}
          >
            {value}
          </span>
          {hint && <span className="text-xs text-muted">{hint}</span>}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ secções */

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted">{children}</h2>
      {action}
    </div>
  );
}
