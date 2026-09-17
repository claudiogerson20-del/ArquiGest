import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { NavLinks } from "@/components/nav-links";
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

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-line bg-white md:sticky md:top-0 md:h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/painel">
            <Logo />
          </Link>
        </div>
        {session.org && (
          <div className="mx-3 mb-2 rounded-lg bg-paper px-3 py-2">
            <p className="truncate text-sm font-medium">{session.org.name}</p>
            <p className="text-xs text-muted">{ROLE_LABEL[session.org.role]}</p>
          </div>
        )}
        <NavLinks links={links} />
        <div className="mt-auto hidden border-t border-line px-3 py-3 md:block">
          <p className="truncate px-2 text-sm font-medium">{session.fullName || session.email}</p>
          <p className="truncate px-2 text-xs text-muted">{session.email}</p>
          <form action={signOut} className="mt-2">
            <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted hover:bg-paper hover:text-ink">
              <LogOut className="size-4" aria-hidden /> Terminar sessão
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
        <form action={signOut} className="mt-10 md:hidden">
          <button className="text-sm text-muted underline">Terminar sessão</button>
        </form>
      </main>
    </div>
  );
}
