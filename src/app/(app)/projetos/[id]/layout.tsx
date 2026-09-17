import Link from "next/link";
import { ChevronLeft, MapPin, UserRound } from "lucide-react";
import { Badge, Progress } from "@/components/ui";
import { ProjectTabs } from "@/components/project-tabs";
import { PROJECT_STATUS, formatDate } from "@/lib/format";
import { getProject } from "./data";

export default async function ProjectLayout({ children, params }: LayoutProps<"/projetos/[id]">) {
  const { id } = await params;
  const { project, isStaff } = await getProject(id);
  const status = PROJECT_STATUS[project.status];

  const tabs = [
    { href: `/projetos/${id}`, label: "Visão geral" },
    { href: `/projetos/${id}/linha-temporal`, label: "Linha temporal" },
    { href: `/projetos/${id}/prazos`, label: "Prazos" },
    { href: `/projetos/${id}/documentos`, label: "Documentos" },
    { href: `/projetos/${id}/conversa`, label: "Conversa" },
    ...(isStaff ? [{ href: `/projetos/${id}/definicoes`, label: "Definições" }] : []),
  ];

  return (
    <>
      <Link
        href={isStaff ? "/projetos" : "/painel"}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ChevronLeft className="size-4" aria-hidden /> {isStaff ? "Projetos" : "Os meus projetos"}
      </Link>

      <header className="mb-8 rounded-xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="label-tech">{project.code || "sem referência"}</p>
            <h1 className="mt-1.5 font-display text-3xl leading-tight tracking-tight sm:text-4xl">{project.name}</h1>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              {isStaff ? (
                <span className="inline-flex items-center gap-1">
                  <UserRound className="size-3.5" aria-hidden /> {project.clients?.full_name}
                </span>
              ) : (
                <span>{project.organizations?.name}</span>
              )}
              {project.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden /> {project.location}
                </span>
              )}
              {project.lead && <span>Arquiteto: {project.lead.full_name || project.lead.email}</span>}
            </div>
          </div>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <div>
            <div className="mb-2 flex justify-between text-xs">
              <span className="label-tech">Progresso</span>
              <span className="font-mono tabular-nums text-muted">{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
          </div>
          <p className="text-sm">
            <span className="label-tech mr-1.5">Início</span>
            <span className="font-mono tabular-nums">{formatDate(project.start_date)}</span>
          </p>
          <p className="text-sm">
            <span className="label-tech mr-1.5">Entrega</span>
            <span className="font-mono font-medium tabular-nums">{formatDate(project.due_date)}</span>
          </p>
        </div>
      </header>

      <ProjectTabs tabs={tabs} />
      <div className="mt-8">{children}</div>
    </>
  );
}
