"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";

export function ProjectTabs({ tabs }: { tabs: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav className="-mb-px flex gap-6 overflow-x-auto border-b border-line" aria-label="Secções do projeto">
      {tabs.map((tab, i) => {
        const active = i === 0 ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "shrink-0 border-b-2 py-3 text-sm transition-colors duration-200",
              active
                ? "border-accent font-medium text-ink"
                : "border-transparent text-muted hover:border-line-strong hover:text-ink",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
