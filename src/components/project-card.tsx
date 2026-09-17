import Link from "next/link";
import { MapPin } from "lucide-react";
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
  const done = project.project_phases.filter((p) => p.status === "completed").length;
  const late = project.due_date && project.status === "active" && daysUntil(project.due_date) < 0;

  return (
    <Link
      href={`/projetos/${project.id}`}
      className="group flex flex-col rounded-lg border border-line bg-surface p-4 transition-[border-color,box-shadow] duration-150 hover:border-line-strong hover:shadow-[var(--shadow-raised)]"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="label-tech">{project.code || "s/ ref."}</span>
        <Badge tone={status.tone} dot>
          {status.label}
        </Badge>
      </div>

      <h3 className="mt-2 truncate text-[15px] font-semibold tracking-tight text-ink group-hover:text-accent">
        {project.name}
      </h3>

      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
        {showClient && project.clients && <span className="truncate">{project.clients.full_name}</span>}
        {project.location && (
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="size-3 shrink-0" aria-hidden />
            <span className="truncate">{project.location}</span>
          </span>
        )}
      </div>

      <div className="mt-4 pt-1">
        <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
          <span className="truncate text-ink">{phase?.name ?? "Sem fases"}</span>
          <span className="shrink-0 font-mono tabular-nums text-muted">
            {done}/{project.project_phases.length}
          </span>
        </div>
        <Progress value={project.progress} />
      </div>

      <p
        className={`mt-2.5 font-mono text-[11px] tabular-nums ${late ? "font-medium text-danger" : "text-muted"}`}
      >
        entrega {formatDate(project.due_date)}
        {late && " · atrasado"}
      </p>
    </Link>
  );
}

export const PROJECT_CARD_SELECT =
  "id, name, code, location, status, progress, due_date, clients (full_name), project_phases (name, status, position)";
