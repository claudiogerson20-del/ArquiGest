export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 text-ink ${className}`}>
      <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden>
        <rect x="3" y="10" width="18" height="11" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 10.6 12 3.5l10 7.1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 21v-6h4.5v6" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight">
          Arqui<span className="text-accent">Gest</span>
        </span>
      )}
    </span>
  );
}
