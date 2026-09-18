"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, LayoutGrid, UserRound, UsersRound } from "lucide-react";
import { cn } from "@/components/ui";

const icons = { home: LayoutGrid, folder: FolderKanban, users: UserRound, team: UsersRound };

export function NavLinks({
  links,
  className,
  compact = false,
}: {
  links: { href: string; label: string; icon: keyof typeof icons }[];
  className?: string;
  compact?: boolean;
}) {
  const pathname = usePathname();
  return (
    <nav
      className={cn(compact ? "flex items-center gap-1 overflow-x-auto" : "flex flex-col gap-1", className)}
      aria-label="Navegação principal"
    >
      {links.map(({ href, label, icon }) => {
        const Icon = icons[icon];
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-xl text-sm transition-colors duration-150",
              compact ? "h-9 px-3" : "h-10 px-3",
              active
                ? "bg-elevated font-medium text-ink shadow-[inset_0_0_0_1px_var(--line)]"
                : "text-muted hover:bg-elevated/70 hover:text-ink",
            )}
          >
            <Icon className={cn("size-[18px] shrink-0", active ? "text-ink" : "text-faint")} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
