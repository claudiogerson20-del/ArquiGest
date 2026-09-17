"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, Home, UserRound, UsersRound } from "lucide-react";
import { cn } from "@/components/ui";

const icons = { home: Home, folder: FolderKanban, users: UserRound, team: UsersRound };

export function NavLinks({
  links,
}: {
  links: { href: string; label: string; icon: keyof typeof icons }[];
}) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-4 pb-4 md:flex-col md:pb-0">
      {links.map(({ href, label, icon }) => {
        const Icon = icons[icon];
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200",
              active ? "bg-elevated font-medium text-ink" : "text-muted hover:bg-elevated/60 hover:text-ink",
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 hidden h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent transition-opacity md:block",
                active ? "opacity-100" : "opacity-0",
              )}
              aria-hidden
            />
            <Icon className={cn("size-4", active && "text-accent")} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
