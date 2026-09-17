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
      .limit(6),
    supabase
      .from("milestones")
      .select("id, title, due_date")
      .eq("project_id", id)
      .is("done_at", null)
      .order("due_date")
      .limit(4),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader
          title="Fases do projeto"
          description={isStaff ? "Atualize o estado de cada fase — o cliente vê as alterações de imediato." : undefined}
        />
        <ol className="px-5 py-4">
          {phases?.map((phase, i) => {
            const st = PHASE_STATUS[phase.status];
            const done = phase.status === "completed";
            const current = phase.status === "in_progress" || phase.status === "awaiting_client";
            const late = !done && phase.due_date && daysUntil(phase.due_date) < 0;
            return (
              <li key={phase.id} className="relative flex gap-4 pb-6 last:pb-0">
                {i < phases.length - 1 && (
                  <span
                    className={cn("absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-px", done ? "bg-accent" : "bg-line")}
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    "z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                    done && "border-accent bg-accent text-white",
                    current && "border-accent bg-white text-accent",
                    !done && !current && "border-line bg-white text-muted",
                  )}
                >
                  {done ? <Check className="size-3.5" aria-hidden /> : phase.position}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={cn("font-medium", !done && !current && "text-muted")}>{phase.name}</h3>
                    <Badge tone={st.tone}>{st.label}</Badge>
                    {late && <Badge tone="red">Atrasada</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-muted">{phase.description}</p>
                  <p className="mt-1 text-xs text-muted">
                    {formatDate(phase.start_date)} → {formatDate(phase.due_date)}
                    {phase.completed_at && ` · concluída em ${formatDate(phase.completed_at)}`}
                  </p>
                  {isStaff && <PhaseEditor projectId={id} phase={phase} />}
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      <div className="flex flex-col gap-6">
        {project.description && (
          <Card className="p-5">
            <h2 className="font-semibold">Sobre o projeto</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-muted">{project.description}</p>
            {project.typology && <p className="mt-3 text-xs text-muted">Tipologia: {project.typology}</p>}
          </Card>
        )}

        <Card>
          <CardHeader
            title="Próximos prazos"
            action={
              <Link href={`/projetos/${id}/prazos`} className="text-sm text-accent hover:underline">
                Ver todos
              </Link>
            }
          />
          {milestones?.length ? (
            <ul className="divide-y divide-line">
              {milestones.map((m) => {
                const d = daysUntil(m.due_date);
                return (
                  <li key={m.id} className="flex items-center justify-between gap-2 px-5 py-3 text-sm">
                    <span>{m.title}</span>
                    <span className={cn("shrink-0 text-xs", d < 0 ? "font-medium text-red-700" : "text-muted")}>
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
              <Link href={`/projetos/${id}/linha-temporal`} className="text-sm text-accent hover:underline">
                Ver tudo
              </Link>
            }
          />
          <div className="px-5 py-4">
            <EventList events={events ?? []} compact />
          </div>
        </Card>
      </div>
    </div>
  );
}
