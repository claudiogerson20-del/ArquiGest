import Link from "next/link";
import { ChevronRight, MapPin, UserRound } from "lucide-react";
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
    { href: `/projetos/${id}/linha-temporal`, label: "Cronograma" },
    { href: `/projetos/${id}/prazos`, label: "Prazos" },
    { href: `/projetos/${id}/documentos`, label: "Documentos" },
    { href: `/projetos/${id}/conversa`, label: "Conversa" },
    ...(isStaff ? [{ href: `/projetos/${id}/definicoes`, label: "Definições" }] : []),
  ];

  return (
    <>
      <nav aria-label="Percurso" className="mb-3 flex items-center gap-1.5 text-xs text-muted">
        <Link href={isStaff ? "/projetos" : "/painel"} className="transition-colors hover:text-ink">
          {isStaff ? "Projetos" : "Os meus projetos"}
        </Link>
        <ChevronRight className="size-3.5 text-faint" aria-hidden />
        <span className="truncate text-ink">{project.name}</span>
      </nav>

      <header className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="truncate text-xl font-semibold tracking-tight text-ink">{project.name}</h1>
              <Badge tone={status.tone} dot>
                {status.label}
              </Badge>
              {project.code && <span className="label-tech">{project.code}</span>}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="size-3.5 shrink-0" aria-hidden />
                {isStaff ? project.clients?.full_name : project.organizations?.name}
              </span>
              {project.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0" aria-hidden /> {project.location}
                </span>
              )}
              {project.lead && (
                <span className="hidden sm:inline">
                  Arquiteto: {project.lead.full_name || project.lead.email}
                </span>
              )}
            </div>
          </div>

          <dl className="flex shrink-0 divide-x divide-line rounded-lg border border-line bg-surface">
            <div className="px-4 py-2">
              <dt className="label-tech">Início</dt>
              <dd className="mt-1 font-mono text-[13px] tabular-nums">{formatDate(project.start_date)}</dd>
            </div>
            <div className="px-4 py-2">
              <dt className="label-tech">Entrega</dt>
              <dd className="mt-1 font-mono text-[13px] font-medium tabular-nums">
                {formatDate(project.due_date)}
              </dd>
            </div>
            <div className="min-w-32 px-4 py-2">
              <dt className="label-tech">Progresso</dt>
              <dd className="mt-1 flex items-center gap-2">
                <Progress value={project.progress} className="w-14" />
                <span className="font-mono text-[13px] tabular-nums">{project.progress}%</span>
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <ProjectTabs tabs={tabs} />
      <div className="mt-5">{children}</div>
    </>
  );
}
