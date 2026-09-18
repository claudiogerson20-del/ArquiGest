"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";

export function ProjectTabs({ tabs }: { tabs: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav
      className="scroll-thin inline-flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-line bg-surface p-1 shadow-[var(--shadow-card)]"
      aria-label="Secções do projeto"
    >
      {tabs.map((tab, i) => {
        const active = i === 0 ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-xl px-3.5 py-2 text-[13px] transition-colors duration-150",
              active ? "bg-primary font-medium text-on-primary" : "text-muted hover:bg-elevated hover:text-ink",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
