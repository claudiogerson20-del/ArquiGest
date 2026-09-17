import type { Metadata } from "next";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { Card, CardHeader, cn } from "@/components/ui";
import { EventList } from "@/components/event-list";
import { PHASE_STATUS, formatDate } from "@/lib/format";
import { getProject } from "../data";

export const metadata: Metadata = { title: "Linha temporal" };

const barTone = {
  pending: "bg-stone-300",
  in_progress: "bg-sky-500",
  awaiting_client: "bg-amber-500",
  completed: "bg-accent",
};

export default async function TimelinePage({ params }: PageProps<"/projetos/[id]/linha-temporal">) {
  const { id } = await params;
  const { supabase } = await getProject(id);

  const [{ data: phases }, { data: milestones }, { data: events }] = await Promise.all([
    supabase.from("project_phases").select("id, name, status, start_date, due_date").eq("project_id", id).order("position"),
    supabase.from("milestones").select("id, title, due_date, done_at").eq("project_id", id).order("due_date"),
    supabase
      .from("project_events")
      .select("id, title, type, created_at, actor:profiles (full_name)")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  // Escala do gráfico de Gantt
  const dates = [
    ...(phases ?? []).flatMap((p) => [p.start_date, p.due_date]),
    ...(milestones ?? []).map((m) => m.due_date),
  ].filter((d): d is string => Boolean(d));
  const hasChart = dates.length >= 2;
  const min = hasChart ? dates.reduce((a, b) => (a < b ? a : b)) : "";
  const max = hasChart ? dates.reduce((a, b) => (a > b ? a : b)) : "";
  const span = hasChart ? Math.max(differenceInCalendarDays(parseISO(max), parseISO(min)), 1) : 1;
  const pos = (d: string) => (differenceInCalendarDays(parseISO(d), parseISO(min)) / span) * 100;
  const today = new Date().toISOString().slice(0, 10);
  const todayPos = hasChart && today >= min && today <= max ? pos(today) : null;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Cronograma" description={hasChart ? `${formatDate(min)} → ${formatDate(max)}` : undefined} />
        {hasChart ? (
          <div className="overflow-x-auto px-5 py-4">
            <div className="min-w-[640px]">
              {phases?.map((p) => (
                <div key={p.id} className="grid grid-cols-[200px_1fr] items-center gap-3 py-1.5">
                  <div className="truncate text-sm" title={p.name}>
                    {p.name}
                    <span className="block text-xs text-muted">{PHASE_STATUS[p.status].label}</span>
                  </div>
                  <div className="relative h-6 rounded bg-paper">
                    {p.start_date && p.due_date && (
                      <div
                        className={cn("absolute top-1 h-4 rounded", barTone[p.status])}
                        style={{
                          left: `${pos(p.start_date)}%`,
                          width: `${Math.max(pos(p.due_date) - pos(p.start_date), 0.8)}%`,
                        }}
                        title={`${formatDate(p.start_date)} → ${formatDate(p.due_date)}`}
                      />
                    )}
                    {todayPos !== null && (
                      <div className="absolute inset-y-0 w-px bg-red-500" style={{ left: `${todayPos}%` }} />
                    )}
                  </div>
                </div>
              ))}
              {!!milestones?.length && (
                <div className="grid grid-cols-[200px_1fr] items-center gap-3 border-t border-line pt-2">
                  <div className="text-sm text-muted">Prazos</div>
                  <div className="relative h-6">
                    {milestones.map((m) => (
                      <span
                        key={m.id}
                        className={cn(
                          "absolute top-1.5 size-3 -translate-x-1/2 rotate-45",
                          m.done_at ? "bg-emerald-600" : "bg-ink",
                        )}
                        style={{ left: `${pos(m.due_date)}%` }}
                        title={`${m.title} — ${formatDate(m.due_date)}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                {Object.entries(PHASE_STATUS).map(([k, v]) => (
                  <span key={k} className="inline-flex items-center gap-1.5">
                    <span className={cn("size-2.5 rounded-sm", barTone[k as keyof typeof barTone])} /> {v.label}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-px bg-red-500" /> Hoje
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="px-5 py-6 text-sm text-muted">Defina datas nas fases para ver o cronograma.</p>
        )}
      </Card>

      <Card>
        <CardHeader title="Histórico" description="Tudo o que aconteceu no projeto, do mais recente para o mais antigo." />
        <div className="px-5 py-5">
          <EventList events={events ?? []} />
        </div>
      </Card>
    </div>
  );
}
