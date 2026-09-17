export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight text-ink ${className}`}>
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <path d="M3 21V10l9-7 9 7v11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 21v-6h6v6" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      ArquiGest
    </span>
  );
}
