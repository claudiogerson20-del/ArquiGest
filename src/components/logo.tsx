export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-ink ${className}`}>
      <svg viewBox="0 0 28 28" className="size-7 shrink-0" aria-hidden>
        {/* alçado esquemático: base, empena e eixo */}
        <rect x="3.5" y="11.5" width="21" height="13" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <path d="M2 12.2 14 3.5l12 8.7" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
        <path d="M14 24.5v-7.5h5.5v7.5" fill="none" stroke="var(--accent)" strokeWidth="1.25" />
        <path d="M14 3.5v8.7" stroke="var(--accent)" strokeWidth="1.25" strokeDasharray="2 2" />
      </svg>
      {!compact && (
        <span className="font-display text-xl leading-none tracking-tight">
          Arqui<span className="text-accent">Gest</span>
        </span>
      )}
    </span>
  );
}
