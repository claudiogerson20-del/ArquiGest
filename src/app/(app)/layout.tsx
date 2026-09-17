import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
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

  const initials =
    (session.fullName || session.email)
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-line bg-surface md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <Link href="/painel" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          <ThemeToggle className="md:hidden" />
        </div>

        {session.org && (
          <div className="mx-4 mb-5 rounded-lg border border-line bg-elevated px-3.5 py-3">
            <p className="label-tech">Escritório</p>
            <p className="mt-1 truncate text-sm font-medium text-ink">{session.org.name}</p>
            <p className="text-xs text-muted">{ROLE_LABEL[session.org.role]}</p>
          </div>
        )}

        <NavLinks links={links} />

        <div className="mt-auto hidden border-t border-line px-4 py-4 md:block">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-elevated font-mono text-xs text-muted">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{session.fullName || "Conta"}</p>
              <p className="truncate text-xs text-muted">{session.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <form action={signOut}>
              <button className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-elevated hover:text-ink">
                <LogOut className="size-4" aria-hidden /> Sair
              </button>
            </form>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">{children}</div>
        <form action={signOut} className="mt-12 md:hidden">
          <button className="cursor-pointer text-sm text-muted underline underline-offset-4">
            Terminar sessão
          </button>
        </form>
      </main>
    </div>
  );
}
