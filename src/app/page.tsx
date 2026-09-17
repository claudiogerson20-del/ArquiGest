import Link from "next/link";
import { CalendarClock, FileCheck2, MessagesSquare, Box } from "lucide-react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui";

const features = [
  {
    icon: CalendarClock,
    title: "Fases e prazos claros",
    text: "O cliente vê em que fase está o projeto, o progresso e as próximas entregas.",
  },
  {
    icon: FileCheck2,
    title: "Documentos sem e-mails perdidos",
    text: "Peça documentos, receba-os no sítio certo e aprove-os com um clique.",
  },
  {
    icon: MessagesSquare,
    title: "Conversa por projeto",
    text: "Toda a comunicação entre arquiteto e cliente fica junta e com histórico.",
  },
  {
    icon: Box,
    title: "Visualizador do projeto",
    text: "Plantas, renders e modelos 3D IFC exportados do Revit, no browser. Brevemente.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          <ButtonLink href="/login" variant="ghost">
            Entrar
          </ButtonLink>
          <ButtonLink href="/registo">Começar</ButtonLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <section className="py-16 sm:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Portugal · Angola · Brasil
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            O seu escritório de arquitetura e os seus clientes, na mesma página.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            O ArquiGest dá a cada cliente um portal para acompanhar o projeto, desde o programa base
            até à obra: fases, prazos, documentos e conversa direta com o arquiteto.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/registo">Criar conta de escritório</ButtonLink>
            <ButtonLink href="/login" variant="secondary">
              Sou cliente
            </ButtonLink>
          </div>
        </section>

        <section className="grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-line bg-white p-5">
              <Icon className="size-5 text-accent" aria-hidden />
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-line py-6 text-center text-sm text-muted">
        © {new Date().getFullYear()} ArquiGest ·{" "}
        <Link href="/login" className="hover:text-ink">
          Área reservada
        </Link>
      </footer>
    </div>
  );
}
