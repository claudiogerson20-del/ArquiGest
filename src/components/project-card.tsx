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
  const late = project.due_date && project.status === "active" && daysUntil(project.due_date) < 0;

  return (
    <Link
      href={`/projetos/${project.id}`}
      className="group flex flex-col rounded-xl border border-line bg-white p-5 transition hover:border-stone-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {project.code && <p className="text-xs font-medium text-muted">{project.code}</p>}
          <h3 className="truncate font-semibold group-hover:text-accent">{project.name}</h3>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>
      {showClient && project.clients && (
        <p className="mt-1 text-sm text-muted">{project.clients.full_name}</p>
      )}
      {project.location && (
        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <MapPin className="size-3.5" aria-hidden /> {project.location}
        </p>
      )}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium">{phase?.name ?? "Sem fases"}</span>
          <span className="text-muted">{project.progress}%</span>
        </div>
        <Progress value={project.progress} />
      </div>
      <p className={`mt-3 text-xs ${late ? "font-medium text-red-700" : "text-muted"}`}>
        Entrega prevista: {formatDate(project.due_date)}
        {late && " · atrasado"}
      </p>
    </Link>
  );
}

export const PROJECT_CARD_SELECT =
  "id, name, code, location, status, progress, due_date, clients (full_name), project_phases (name, status, position)";
