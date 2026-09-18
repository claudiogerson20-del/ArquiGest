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
  const total = project.project_phases.length;
  const done = project.project_phases.filter((p) => p.status === "completed").length;
  const late = project.due_date && project.status === "active" && daysUntil(project.due_date) < 0;

  return (
    <Link
      href={`/projetos/${project.id}`}
      className="group relative flex flex-col rounded-[18px] border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-raised)]"
    >
      <div className="flex items-center justify-between gap-2">
        <Badge tone={status.tone} dot>
          {status.label}
        </Badge>
        <span className="flex size-8 items-center justify-center rounded-full bg-elevated text-muted transition-colors group-hover:bg-primary group-hover:text-on-primary">
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>

      <p className="label-tech mt-5">{project.code || "sem referência"}</p>
      <h3 className="mt-1 truncate text-lg font-semibold tracking-tight text-ink">{project.name}</h3>

      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-muted">
        {showClient && project.clients && <span className="truncate">{project.clients.full_name}</span>}
        {project.location && (
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{project.location}</span>
          </span>
        )}
      </div>

      <div className="mt-6 rounded-xl bg-elevated/70 p-3">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs">
          <span className="truncate font-medium text-ink">{phase?.name ?? "Sem fases"}</span>
          <span className="shrink-0 font-mono tabular-nums text-muted">
            {done}/{total} fases
          </span>
        </div>
        <Progress value={project.progress} />
      </div>

      <p className={`mt-3 text-xs ${late ? "font-medium text-danger" : "text-muted"}`}>
        Entrega <span className="font-mono tabular-nums">{formatDate(project.due_date)}</span>
        {late && " · atrasado"}
      </p>
    </Link>
  );
}

export const PROJECT_CARD_SELECT =
  "id, name, code, location, status, progress, due_date, clients (full_name), project_phases (name, status, position)";
