export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-ink ${className}`}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-primary text-on-primary">
        <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
          <path d="M4 20V10.5L12 4l8 6.5V20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M12 20v-6h4v6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact && <span className="font-display text-[17px] font-bold tracking-tight">ArquiGest</span>}
    </span>
  );
}
