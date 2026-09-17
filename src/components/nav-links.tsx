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
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
      {links.map(({ href, label, icon }) => {
        const Icon = icons[icon];
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm",
              active ? "bg-ink text-white" : "text-muted hover:bg-paper hover:text-ink",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
