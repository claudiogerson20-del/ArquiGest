import Link from "next/link";
import { ArrowRight, Box, CalendarClock, FileCheck2, MessagesSquare } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui";

const features = [
  {
    n: "01",
    icon: CalendarClock,
    title: "Fases e prazos claros",
    text: "Do programa base à obra, o cliente vê em que fase está o projeto, o progresso e a próxima entrega.",
  },
  {
    n: "02",
    icon: FileCheck2,
    title: "Documentos sem e-mails perdidos",
    text: "Peça documentos, receba-os no sítio certo e aprove-os com um clique. Tudo com versões.",
  },
  {
    n: "03",
    icon: MessagesSquare,
    title: "Conversa por projeto",
    text: "A comunicação entre arquiteto e cliente fica junta, com histórico e em tempo real.",
  },
  {
    n: "04",
    icon: Box,
    title: "Visualizador do projeto",
    text: "Plantas, renders e modelos 3D IFC exportados do Revit, no browser. Brevemente.",
  },
];

const phases = [
  "Programa Base",
  "Estudo Prévio",
  "Anteprojeto",
  "Licenciamento",
  "Especialidades",
  "Execução",
  "Obra",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <Logo />
          <nav className="flex items-center gap-2">
            <ThemeToggle className="mr-1" />
            <ButtonLink href="/login" variant="ghost" size="sm">
              Entrar
            </ButtonLink>
            <ButtonLink href="/registo" size="sm">
              Começar
            </ButtonLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5">
        {/* Hero editorial */}
        <section className="grid gap-12 border-b border-line py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-28">
          <div className="rise">
            <p className="label-tech">Portugal · Angola · Brasil</p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
              O seu atelier e os seus clientes, <em className="text-accent not-italic">na mesma página</em>.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              O ArquiGest dá a cada cliente um portal para acompanhar o projeto, desde o programa base
              até à obra: fases, prazos, documentos e conversa direta com o arquiteto.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/registo">
                Criar conta de escritório
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary">
                Sou cliente
              </ButtonLink>
            </div>
          </div>

          {/* Fases como planta esquemática */}
          <div className="rise rounded-xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
            <p className="label-tech">Faseamento · modelo Portugal</p>
            <ol className="mt-5 space-y-3.5">
              {phases.map((phase, i) => (
                <li key={phase} className="flex items-center gap-4">
                  <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                  <span className={i < 2 ? "text-sm text-ink" : "text-sm text-muted"}>{phase}</span>
                  <span
                    className={`ml-auto h-px flex-1 ${i < 2 ? "bg-accent" : "bg-line"}`}
                    aria-hidden
                  />
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-line pt-4 text-xs text-muted">
              As fases seguem a norma do país do escritório e são criadas automaticamente em cada projeto.
            </p>
          </div>
        </section>

        {/* Funcionalidades */}
        <section className="grid gap-px overflow-hidden border-b border-line bg-line sm:grid-cols-2">
          {features.map(({ n, icon: Icon, title, text }) => (
            <article key={title} className="group bg-bg px-2 py-12 sm:px-8">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-accent">{n}</span>
                <Icon className="size-5 text-muted transition-colors duration-200 group-hover:text-accent" aria-hidden />
              </div>
              <h2 className="mt-5 font-display text-2xl tracking-tight">{title}</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{text}</p>
            </article>
          ))}
        </section>

        {/* Chamada final */}
        <section className="py-24 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-4xl leading-tight tracking-tight text-balance sm:text-5xl">
            Menos e-mails perdidos. Clientes que sabem sempre onde está o projeto.
          </h2>
          <div className="mt-9 flex justify-center">
            <ButtonLink href="/registo">
              Começar agora
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8">
          <Logo compact />
          <p className="text-xs text-muted">© {new Date().getFullYear()} ArquiGest</p>
          <Link href="/login" className="text-xs text-muted transition-colors hover:text-ink">
            Área reservada
          </Link>
        </div>
      </footer>
    </div>
  );
}
