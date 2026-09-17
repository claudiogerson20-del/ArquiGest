import type { Metadata } from "next";
import Link from "next/link";
import { addDays, formatISO } from "date-fns";
import { Plus } from "lucide-react";
import { Badge, ButtonLink, Card, CardHeader, EmptyState, PageHeader } from "@/components/ui";
import { PROJECT_CARD_SELECT, ProjectCard } from "@/components/project-card";
import { createClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/session";
import { REQUEST_STATUS, daysUntil, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Painel" };

export default async function DashboardPage() {
  const session = await requireSession();
  const supabase = await createClient();
  const isStaff = Boolean(session.org);
  const horizon = formatISO(addDays(new Date(), 30), { representation: "date" });

  const [{ data: projects }, { data: milestones }, { data: requests }] = await Promise.all([
    supabase
      .from("projects")
      .select(PROJECT_CARD_SELECT)
      .in("status", ["active", "on_hold", "draft"])
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("milestones")
      .select("id, title, due_date, project_id, projects (name)")
      .is("done_at", null)
      .lte("due_date", horizon)
      .order("due_date")
      .limit(8),
    supabase
      .from("document_requests")
      .select("id, title, status, due_date, project_id, projects (name)")
      .in("status", isStaff ? ["submitted"] : ["pending", "rejected"])
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const late = (milestones ?? []).filter((m) => daysUntil(m.due_date) < 0).length;
  const firstName = (session.fullName || session.email).split(" ")[0];

  return (
    <>
      <PageHeader
        title={`Olá, ${firstName}`}
        description={isStaff ? "Resumo do seu escritório." : "Acompanhe aqui os seus projetos."}
        action={
          isStaff && (
            <ButtonLink href="/projetos/novo">
              <Plus className="size-4" aria-hidden /> Novo projeto
            </ButtonLink>
          )
        }
      />

      {isStaff && (
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Projetos em curso" value={projects?.filter((p) => p.status === "active").length ?? 0} />
          <Stat label="Prazos nos próximos 30 dias" value={milestones?.length ?? 0} />
          <Stat label="Prazos em atraso" value={late} alert={late > 0} />
          <Stat label="Documentos por rever" value={requests?.length ?? 0} alert={(requests?.length ?? 0) > 0} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-3 font-semibold">{isStaff ? "Projetos ativos" : "Os meus projetos"}</h2>
          {projects?.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} showClient={isStaff} />
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState title="Ainda não há projetos">
                {isStaff ? (
                  <Link href="/projetos/novo" className="text-accent hover:underline">
                    Criar o primeiro projeto
                  </Link>
                ) : (
                  "Quando o seu arquiteto criar um projeto, ele aparece aqui."
                )}
              </EmptyState>
            </Card>
          )}
        </section>

        <aside className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Próximos prazos" />
            {milestones?.length ? (
              <ul className="divide-y divide-line">
                {milestones.map((m) => {
                  const d = daysUntil(m.due_date);
                  return (
                    <li key={m.id}>
                      <Link href={`/projetos/${m.project_id}/prazos`} className="block px-5 py-3 hover:bg-paper">
                        <p className="text-sm font-medium">{m.title}</p>
                        <p className="text-xs text-muted">{m.projects?.name}</p>
                        <p className={`mt-1 text-xs ${d < 0 ? "font-medium text-red-700" : d <= 7 ? "text-amber-700" : "text-muted"}`}>
                          {formatDate(m.due_date)} · {d < 0 ? `${-d} dia(s) em atraso` : d === 0 ? "hoje" : `faltam ${d} dia(s)`}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState title="Sem prazos próximos" />
            )}
          </Card>

          <Card>
            <CardHeader title={isStaff ? "Documentos para rever" : "Documentos pedidos"} />
            {requests?.length ? (
              <ul className="divide-y divide-line">
                {requests.map((r) => (
                  <li key={r.id}>
                    <Link href={`/projetos/${r.project_id}/documentos`} className="block px-5 py-3 hover:bg-paper">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{r.title}</p>
                        <Badge tone={REQUEST_STATUS[r.status].tone}>{REQUEST_STATUS[r.status].label}</Badge>
                      </div>
                      <p className="text-xs text-muted">
                        {r.projects?.name}
                        {r.due_date && ` · até ${formatDate(r.due_date)}`}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="Nada pendente" />
            )}
          </Card>
        </aside>
      </div>
    </>
  );
}

function Stat({ label, value, alert }: { label: string; value: number; alert?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${alert ? "text-red-700" : ""}`}>{value}</p>
    </div>
  );
}
