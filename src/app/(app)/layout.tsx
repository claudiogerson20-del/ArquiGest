import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Logo } from "@/components/logo";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { ButtonLink } from "@/components/ui";
import { getSession } from "@/lib/session";
import { ROLE_LABEL } from "@/lib/format";
import { signOut } from "../(auth)/actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!session.org && !session.isClient) redirect("/onboarding");

  const links = session.org
    ? [
        { href: "/painel", label: "Painel", icon: "home" as const },
        { href: "/projetos", label: "Projetos", icon: "folder" as const },
        { href: "/clientes", label: "Clientes", icon: "users" as const },
        { href: "/equipa", label: "Equipa", icon: "team" as const },
      ]
    : [{ href: "/painel", label: "Os meus projetos", icon: "folder" as const }];

  const orgInitials = session.org?.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* Barra lateral (ecrãs grandes) */}
      <aside className="sticky top-0 z-30 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 items-center px-5">
          <Link href="/painel" className="transition-opacity hover:opacity-70">
            <Logo />
          </Link>
        </div>

        {session.org && (
          <div className="mx-3 mb-4 flex items-center gap-3 rounded-2xl border border-line bg-elevated/60 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-xs font-bold text-on-primary">
              {orgInitials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-ink">{session.org.name}</p>
              <p className="text-xs text-muted">{ROLE_LABEL[session.org.role]}</p>
            </div>
          </div>
        )}

        <p className="label-tech px-5 pb-2">Menu</p>
        <NavLinks links={links} className="flex-1 px-3" />

        {session.org && (
          <div className="p-3">
            <ButtonLink href="/projetos/novo" className="w-full">
              <Plus className="size-4" aria-hidden /> Novo projeto
            </ButtonLink>
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior com vidro fosco */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-glass px-4 backdrop-blur-xl md:px-8">
          <Link href="/painel" className="lg:hidden">
            <Logo compact />
          </Link>
          <div className="min-w-0 flex-1 overflow-x-auto lg:hidden">
            <NavLinks links={links} compact />
          </div>
          <div className="hidden min-w-0 flex-1 lg:block" />
          <ThemeToggle />
          <UserMenu
            name={session.fullName || session.email}
            email={session.email}
            role={session.org ? ROLE_LABEL[session.org.role] : "Cliente"}
            signOut={signOut}
          />
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-[1320px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
