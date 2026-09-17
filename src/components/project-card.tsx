import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Badge, Progress } from "@/components/ui";
import { PROJECT_STATUS, daysUntil, formatDate } from "@/lib/format";
import type { Database } from "@/lib/database.types";

export type ProjectCardData = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  "id" | "name" | "code" | "location" | "status" | "progress" | "due_date"
> & {
  clients: { full_name: string } | null;
  project_phases: { name: string; status: string; position: number }[];
};

export function currentPhase(phases: ProjectCardData["project_phases"]) {
  const sorted = [...phases].sort((a, b) => a.position - b.position);
  return (
    sorted.find((p) => p.status === "in_progress" || p.status === "awaiting_client") ??
    sorted.find((p) => p.status === "pending") ??
    sorted.at(-1)
  );
}

export function ProjectCard({ project, showClient }: { project: ProjectCardData; showClient: boolean }) {
  const status = PROJECT_STATUS[project.status];
  const phase = currentPhase(project.project_phases);
  const late = project.due_date && project.status === "active" && daysUntil(project.due_date) < 0;

  return (
    <Link
      href={`/projetos/${project.id}`}
      className="group flex flex-col rounded-xl border border-line bg-surface p-6 transition-[border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-card)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label-tech">{project.code || "sem referência"}</p>
          <h3 className="mt-1.5 font-display text-2xl leading-tight tracking-tight">{project.name}</h3>
        </div>
        <ArrowUpRight
          className="size-5 shrink-0 text-faint transition-colors duration-200 group-hover:text-accent"
          aria-hidden
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        {showClient && project.clients && <span>{project.clients.full_name}</span>}
        {project.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden /> {project.location}
          </span>
        )}
      </div>

      <div className="mt-auto pt-8">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-ink">{phase?.name ?? "Sem fases"}</span>
          <span className="font-mono tabular-nums text-muted">{project.progress}%</span>
        </div>
        <Progress value={project.progress} />
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className={`text-xs ${late ? "font-medium text-danger" : "text-muted"}`}>
            Entrega {formatDate(project.due_date)}
            {late && " · atrasado"}
          </p>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>
      </div>
    </Link>
  );
}

export const PROJECT_CARD_SELECT =
  "id, name, code, location, status, progress, due_date, clients (full_name), project_phases (name, status, position)";
