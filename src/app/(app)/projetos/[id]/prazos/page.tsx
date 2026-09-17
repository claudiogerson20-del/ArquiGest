import type { Metadata } from "next";
import { Check, RotateCcw, Trash2 } from "lucide-react";
import { Badge, Button, Card, CardHeader, EmptyState, cn } from "@/components/ui";
import { daysUntil, formatDate } from "@/lib/format";
import { deleteMilestone, toggleMilestone } from "../../actions";
import { getProject } from "../data";
import { MilestoneForm } from "./form";

export const metadata: Metadata = { title: "Prazos" };

function dueLabel(due: string) {
  const d = daysUntil(due);
  if (d < 0) return { text: `${-d} dia(s) em atraso`, tone: "red" as const };
  if (d === 0) return { text: "Hoje", tone: "amber" as const };
  if (d <= 7) return { text: `Faltam ${d} dia(s)`, tone: "amber" as const };
  return { text: `Faltam ${d} dias`, tone: "neutral" as const };
}

export default async function MilestonesPage({ params }: PageProps<"/projetos/[id]/prazos">) {
  const { id } = await params;
  const { isStaff, supabase } = await getProject(id);

  const [{ data: milestones }, { data: phases }] = await Promise.all([
    supabase
      .from("milestones")
      .select("*, project_phases (name)")
      .eq("project_id", id)
      .order("due_date"),
    isStaff
      ? supabase.from("project_phases").select("id, name").eq("project_id", id).order("position")
      : Promise.resolve({ data: [] }),
  ]);

  const pending = milestones?.filter((m) => !m.done_at) ?? [];
  const done = milestones?.filter((m) => m.done_at) ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Card>
          <CardHeader title="Prazos por cumprir" description={`${pending.length} pendente(s)`} />
          {pending.length ? (
            <ul className="divide-y divide-line">
              {pending.map((m) => {
                const label = dueLabel(m.due_date);
                return (
                  <li key={m.id} className="flex flex-wrap items-start gap-3 px-5 py-4">
                    <div className="min-w-[8rem] text-sm">
                      <p className="font-semibold">{formatDate(m.due_date)}</p>
                      <Badge tone={label.tone}>{label.text}</Badge>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{m.title}</p>
                      {m.description && <p className="text-sm text-muted">{m.description}</p>}
                      <p className="mt-1 text-xs text-muted">
                        {m.project_phases?.name}
                        {isStaff && !m.visible_to_client && " · interno (o cliente não vê)"}
                      </p>
                    </div>
                    {isStaff && (
                      <div className="flex gap-1">
                        <form action={toggleMilestone.bind(null, id, m.id, true)}>
                          <Button size="sm" variant="secondary" title="Marcar como cumprido">
                            <Check className="size-4" aria-hidden /> Cumprido
                          </Button>
                        </form>
                        <form action={deleteMilestone.bind(null, id, m.id)}>
                          <Button size="sm" variant="ghost" title="Eliminar" aria-label="Eliminar prazo">
                            <Trash2 className="size-4" aria-hidden />
                          </Button>
                        </form>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState title="Não há prazos pendentes" />
          )}
        </Card>

        {done.length > 0 && (
          <Card>
            <CardHeader title="Cumpridos" />
            <ul className="divide-y divide-line">
              {done.map((m) => (
                <li key={m.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <Check className="size-4 text-emerald-600" aria-hidden />
                  <span className={cn("flex-1 text-muted line-through")}>{m.title}</span>
                  <span className="text-xs text-muted">
                    previsto {formatDate(m.due_date)} · cumprido {formatDate(m.done_at)}
                  </span>
                  {isStaff && (
                    <form action={toggleMilestone.bind(null, id, m.id, false)}>
                      <Button size="sm" variant="ghost" title="Reabrir" aria-label="Reabrir prazo">
                        <RotateCcw className="size-4" aria-hidden />
                      </Button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {isStaff && (
        <Card className="h-fit">
          <CardHeader title="Novo prazo" description="Entregas, reuniões, submissões à câmara/prefeitura…" />
          <div className="p-5">
            <MilestoneForm projectId={id} phases={phases ?? []} />
          </div>
        </Card>
      )}
    </div>
  );
}
