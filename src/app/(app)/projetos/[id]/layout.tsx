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

      <header className="mb-6 rounded-xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            {project.code && <p className="text-xs font-medium text-muted">{project.code}</p>}
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
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
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="font-medium">Progresso</span>
              <span className="text-muted">{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
          </div>
          <p className="text-sm">
            <span className="text-muted">Início </span>
            {formatDate(project.start_date)}
          </p>
          <p className="text-sm">
            <span className="text-muted">Entrega </span>
            <strong>{formatDate(project.due_date)}</strong>
          </p>
        </div>
      </header>

      <ProjectTabs tabs={tabs} />
      <div className="mt-6">{children}</div>
    </>
  );
}
