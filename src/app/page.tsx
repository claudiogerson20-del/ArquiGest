import Link from "next/link";
import { ArrowRight, Box, CalendarClock, Check, FileCheck2, MessagesSquare } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui";

const features = [
  {
    icon: CalendarClock,
    title: "Fases e prazos",
    text: "Fases criadas segundo a norma do país. O cliente vê sempre em que ponto está o projeto.",
  },
  {
    icon: FileCheck2,
    title: "Documentos com versões",
    text: "Peça, receba e aprove documentos no sítio certo. Sem anexos perdidos no e-mail.",
  },
  {
    icon: MessagesSquare,
    title: "Conversa por projeto",
    text: "Tudo o que foi combinado fica registado, com histórico e em tempo real.",
  },
  {
    icon: Box,
    title: "Visualizador IFC",
    text: "Plantas, renders e modelos 3D exportados do Revit, vistos no browser. Brevemente.",
  },
];

const phases = [
  { code: "PB", name: "Programa Base", state: "done" },
  { code: "EP", name: "Estudo Prévio", state: "current" },
  { code: "AP", name: "Anteprojeto", state: "next" },
  { code: "LIC", name: "Licenciamento", state: "next" },
  { code: "ESP", name: "Especialidades", state: "next" },
  { code: "PE", name: "Projeto de Execução", state: "next" },
  { code: "AT", name: "Assistência à Obra", state: "next" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5">
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
        <section className="grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              Portugal · Angola · Brasil
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
              O portal do cliente para escritórios de arquitetura.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
              Fases, prazos, documentos e conversa num único sítio, do programa base à obra. O seu
              cliente deixa de perguntar em que ponto está o projeto.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <ButtonLink href="/registo">
                Criar conta de escritório
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary">
                Sou cliente
              </ButtonLink>
            </div>
            <p className="label-tech mt-6">Sem cartão de crédito · Convide clientes por e-mail</p>
          </div>

          {/* Pré-visualização do produto */}
          <div className="rise rounded-xl border border-line bg-surface shadow-[var(--shadow-raised)]">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <span className="label-tech">2026-014</span>
                <span className="truncate text-[13px] font-semibold tracking-tight">
                  Moradia T4 em Cascais
                </span>
              </div>
              <span className="shrink-0 rounded-full bg-info-soft px-2 py-0.5 text-[11px] font-medium text-info ring-1 ring-inset ring-info/25">
                Em curso
              </span>
            </div>
            <ol className="divide-y divide-line">
              {phases.map((p) => (
                <li key={p.code} className="flex items-center gap-3 px-4 py-2.5">
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-md font-mono text-[10px] ring-1 ring-inset ${
                      p.state === "done"
                        ? "bg-accent text-on-accent ring-accent"
                        : p.state === "current"
                          ? "bg-surface text-accent ring-accent"
                          : "bg-elevated text-faint ring-line-strong"
                    }`}
                  >
                    {p.state === "done" ? <Check className="size-3" aria-hidden /> : p.code}
                  </span>
                  <span
                    className={`flex-1 truncate text-[13px] ${p.state === "next" ? "text-muted" : "text-ink"}`}
                  >
                    {p.name}
                  </span>
                  {p.state === "current" && (
                    <span className="font-mono text-[11px] text-accent">em curso</span>
                  )}
                </li>
              ))}
            </ol>
            <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
              <span className="label-tech">Progresso</span>
              <span className="font-mono text-[13px] tabular-nums">14%</span>
            </div>
          </div>
        </section>

        <section className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="bg-surface p-5">
              <Icon className="size-5 text-accent" aria-hidden />
              <h2 className="mt-3.5 text-[15px] font-semibold tracking-tight">{title}</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{text}</p>
            </article>
          ))}
        </section>

        <section className="py-20 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Menos e-mails. Clientes informados. Projetos a horas.
          </h2>
          <div className="mt-7 flex justify-center">
            <ButtonLink href="/registo">
              Começar agora
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6">
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
