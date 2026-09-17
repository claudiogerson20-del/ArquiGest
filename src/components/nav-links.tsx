"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, LayoutDashboard, UserRound, UsersRound } from "lucide-react";
import { cn } from "@/components/ui";

const icons = { home: LayoutDashboard, folder: FolderKanban, users: UserRound, team: UsersRound };

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
      className={cn(
        compact ? "flex items-center gap-1 overflow-x-auto" : "flex flex-col gap-0.5",
        className,
      )}
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
              "flex shrink-0 items-center gap-2 rounded-md text-[13px] transition-colors duration-150",
              compact ? "h-8 px-2.5" : "h-9 px-2.5",
              active
                ? "bg-accent-soft font-medium text-accent"
                : "text-muted hover:bg-elevated hover:text-ink",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
