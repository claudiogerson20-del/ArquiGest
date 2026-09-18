import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  CalendarClock,
  Check,
  CheckCircle2,
  FileCheck2,
  FileText,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink, IconChip } from "@/components/ui";

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
    text: "Plantas, renders e modelos 3D exportados do Revit, vistos no browser. Em breve.",
  },
  {
    icon: ShieldCheck,
    title: "Cada escritório isolado",
    text: "Os dados de cada atelier e de cada cliente ficam separados e protegidos.",
  },
  {
    icon: CheckCircle2,
    title: "Aprovações registadas",
    text: "Cada documento aprovado ou rejeitado fica na linha temporal do projeto.",
  },
];

const phases = [
  { code: "PB", name: "Programa Base", state: "done" },
  { code: "EP", name: "Estudo Prévio", state: "current" },
  { code: "AP", name: "Anteprojeto", state: "next" },
  { code: "LIC", name: "Licenciamento", state: "next" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-glass backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="flex items-center gap-2">
            <ThemeToggle className="mr-1 hidden sm:inline-flex" />
            <ButtonLink href="/login" variant="ghost" size="sm">
              Entrar
            </ButtonLink>
            <ButtonLink href="/registo" size="sm">
              Começar
            </ButtonLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="ambient">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            <div className="rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted shadow-[var(--shadow-card)]">
                <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                Para escritórios em Portugal, Angola e Brasil
              </span>
              <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight text-balance sm:text-6xl">
                Arquitetura
                <br />
                <span className="text-muted">sem ruído.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
                O portal onde o seu cliente acompanha o projeto: fases, prazos, documentos e conversa
                direta, do programa base à obra.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/registo" size="lg">
                  Criar conta de escritório
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
                <ButtonLink href="/login" variant="secondary" size="lg">
                  Sou cliente
                </ButtonLink>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted">
                {["Fases segundo a norma do país", "Clientes convidados por e-mail", "Modo claro e escuro"].map(
                  (t) => (
                    <li key={t} className="inline-flex items-center gap-1.5">
                      <Check className="size-4 text-ink" aria-hidden /> {t}
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Pré-visualização do produto */}
            <div className="rise relative mx-auto w-full max-w-md">
              <div className="rounded-[26px] border border-line bg-surface p-5 shadow-[var(--shadow-pop)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted">Projeto</p>
                    <p className="font-display text-lg font-semibold tracking-tight">Moradia T4, Cascais</p>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-full bg-elevated text-muted">
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </div>

                {/* Cartão de destaque — o "saldo" deste produto é o progresso */}
                <div className="mt-4 rounded-[20px] bg-primary p-5 text-on-primary">
                  <p className="text-xs opacity-70">Progresso do projeto</p>
                  <p className="mt-1 font-display text-4xl font-bold tracking-tight">42%</p>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-on-primary/15">
                    <div className="h-full w-[42%] rounded-full bg-on-primary" />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs opacity-70">
                    <span>Estudo Prévio</span>
                    <span className="font-mono">entrega 27/09</span>
                  </div>
                </div>

                <ol className="mt-4 space-y-2">
                  {phases.map((p) => (
                    <li
                      key={p.code}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-elevated/50 px-3 py-2.5"
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-xl font-mono text-[10px] font-medium ${
                          p.state === "done"
                            ? "bg-primary text-on-primary"
                            : p.state === "current"
                              ? "bg-accent-soft text-accent"
                              : "bg-surface text-faint"
                        }`}
                      >
                        {p.state === "done" ? <Check className="size-3.5" aria-hidden /> : p.code}
                      </span>
                      <span className={`flex-1 text-sm ${p.state === "next" ? "text-muted" : "font-medium text-ink"}`}>
                        {p.name}
                      </span>
                      {p.state === "current" && (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                          em curso
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Chip flutuante */}
              <div className="absolute -right-3 -top-5 hidden items-center gap-2.5 rounded-2xl border border-line bg-glass px-3.5 py-2.5 shadow-[var(--shadow-raised)] backdrop-blur-xl sm:flex">
                <IconChip size="sm" tone="green">
                  <FileText className="size-4" aria-hidden />
                </IconChip>
                <div>
                  <p className="text-xs font-medium">Caderneta aprovada</p>
                  <p className="text-[11px] text-muted">há 2 minutos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Funcionalidades */}
        <section className="mx-auto w-full max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <p className="label-tech">Funcionalidades</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Tudo o que o cliente pergunta, respondido antes de perguntar.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-[20px] border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong"
              >
                <IconChip>
                  <Icon className="size-5" aria-hidden />
                </IconChip>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Chamada final */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-20">
          <div className="rounded-[28px] bg-primary px-6 py-14 text-center text-on-primary sm:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Menos e-mails. Clientes informados. Projetos a horas.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm opacity-70">
              Crie a conta do escritório em minutos e convide o primeiro cliente hoje.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/registo"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-on-primary px-6 text-[15px] font-medium text-primary transition-opacity hover:opacity-90"
              >
                Começar agora
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
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
