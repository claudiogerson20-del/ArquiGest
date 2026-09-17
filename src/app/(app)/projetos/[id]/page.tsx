import Link from "next/link";
import { Check } from "lucide-react";
import { Badge, Card, CardHeader, EmptyState, cn } from "@/components/ui";
import { EventList } from "@/components/event-list";
import { PHASE_STATUS, daysUntil, formatDate } from "@/lib/format";
import { getProject } from "./data";
import { PhaseEditor } from "./phase-editor";

export default async function ProjectOverview({ params }: PageProps<"/projetos/[id]">) {
  const { id } = await params;
  const { project, isStaff, supabase } = await getProject(id);

  const [{ data: phases }, { data: events }, { data: milestones }] = await Promise.all([
    supabase.from("project_phases").select("*").eq("project_id", id).order("position"),
    supabase
      .from("project_events")
      .select("id, title, type, created_at, actor:profiles (full_name)")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(7),
    supabase
      .from("milestones")
      .select("id, title, due_date")
      .eq("project_id", id)
      .is("done_at", null)
      .order("due_date")
      .limit(5),
  ]);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card>
        <CardHeader
          title="Fases do projeto"
          description={isStaff ? "Atualize o estado — o cliente vê as alterações de imediato." : undefined}
        />
        <ul className="divide-y divide-line">
          {phases?.map((phase) => {
            const st = PHASE_STATUS[phase.status];
            const done = phase.status === "completed";
            const current = phase.status === "in_progress" || phase.status === "awaiting_client";
            const late = !done && phase.due_date && daysUntil(phase.due_date) < 0;
            return (
              <li key={phase.id} className={cn("px-4 py-3", current && "bg-accent-soft/40")}>
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px] ring-1 ring-inset",
                      done && "bg-accent text-on-accent ring-accent",
                      current && "bg-surface text-accent ring-accent",
                      !done && !current && "bg-elevated text-faint ring-line-strong",
                    )}
                  >
                    {done ? <Check className="size-3.5" aria-hidden /> : phase.position}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={cn(
                          "text-[13px] font-semibold tracking-tight",
                          done || current ? "text-ink" : "text-muted",
                        )}
                      >
                        {phase.name}
                      </h3>
                      <Badge tone={st.tone} dot>
                        {st.label}
                      </Badge>
                      {late && <Badge tone="red">Atrasada</Badge>}
                      <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-muted">
                        {formatDate(phase.start_date)} → {formatDate(phase.due_date)}
                      </span>
                    </div>
                    {(current || isStaff) && phase.description && (
                      <p className="mt-1 text-xs leading-relaxed text-muted">{phase.description}</p>
                    )}
                    {isStaff && <PhaseEditor projectId={id} phase={phase} />}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="flex flex-col gap-4">
        {project.description && (
          <Card>
            <CardHeader title="Sobre o projeto" />
            <div className="px-4 py-3">
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-muted">
                {project.description}
              </p>
              {project.typology && <p className="label-tech mt-3">{project.typology}</p>}
            </div>
          </Card>
        )}

        <Card>
          <CardHeader
            title="Próximos prazos"
            action={
              <Link href={`/projetos/${id}/prazos`} className="text-xs text-accent hover:underline">
                Ver todos
              </Link>
            }
          />
          {milestones?.length ? (
            <ul className="divide-y divide-line">
              {milestones.map((m) => {
                const d = daysUntil(m.due_date);
                return (
                  <li key={m.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                    <span className="truncate text-[13px] text-ink">{m.title}</span>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[11px] tabular-nums",
                        d < 0 ? "font-medium text-danger" : "text-muted",
                      )}
                    >
                      {formatDate(m.due_date)}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState title="Sem prazos pendentes" />
          )}
        </Card>

        <Card>
          <CardHeader
            title="Atividade recente"
            action={
              <Link href={`/projetos/${id}/linha-temporal`} className="text-xs text-accent hover:underline">
                Ver tudo
              </Link>
            }
          />
          <div className="px-4 py-3.5">
            <EventList events={events ?? []} compact />
          </div>
        </Card>
      </div>
    </div>
  );
}
