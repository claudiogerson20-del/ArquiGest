import type { Metadata } from "next";
import Link from "next/link";
import { addDays, formatISO } from "date-fns";
import { AlertTriangle, CalendarClock, FileClock, FolderKanban, Plus } from "lucide-react";
import {
  Badge,
  ButtonLink,
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  SectionTitle,
  Stat,
} from "@/components/ui";
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
      .limit(7),
    supabase
      .from("document_requests")
      .select("id, title, status, due_date, project_id, projects (name)")
      .in("status", isStaff ? ["submitted"] : ["pending", "rejected"])
      .order("created_at", { ascending: false })
      .limit(7),
  ]);

  const late = (milestones ?? []).filter((m) => daysUntil(m.due_date) < 0).length;
  const firstName = (session.fullName || session.email).split(" ")[0];

  return (
    <>
      <PageHeader
        title={`Olá, ${firstName}`}
        description={
          isStaff ? "Resumo do escritório e do que precisa de atenção." : "Acompanhe aqui os seus projetos."
        }
        action={
          isStaff && (
            <ButtonLink href="/projetos/novo">
              <Plus className="size-4" aria-hidden /> Novo projeto
            </ButtonLink>
          )
        }
      />

      {isStaff && (
        <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <Stat
            label="Projetos em curso"
            value={projects?.filter((p) => p.status === "active").length ?? 0}
            icon={<FolderKanban className="size-4" aria-hidden />}
          />
          <Stat
            label="Prazos · 30 dias"
            value={milestones?.length ?? 0}
            icon={<CalendarClock className="size-4" aria-hidden />}
          />
          <Stat
            label="Prazos em atraso"
            value={late}
            tone={late > 0 ? "red" : "neutral"}
            icon={<AlertTriangle className="size-4" aria-hidden />}
          />
          <Stat
            label="Documentos por rever"
            value={requests?.length ?? 0}
            tone={(requests?.length ?? 0) > 0 ? "red" : "neutral"}
            icon={<FileClock className="size-4" aria-hidden />}
          />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <SectionTitle
            action={
              isStaff && (
                <Link href="/projetos" className="text-[13px] text-accent hover:underline">
                  Ver todos
                </Link>
              )
            }
          >
            {isStaff ? "Projetos ativos" : "Os meus projetos"}
          </SectionTitle>
          {projects?.length ? (
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
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

        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Próximos prazos" />
            {milestones?.length ? (
              <ul className="divide-y divide-line">
                {milestones.map((m) => {
                  const d = daysUntil(m.due_date);
                  return (
                    <li key={m.id}>
                      <Link
                        href={`/projetos/${m.project_id}/prazos`}
                        className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-elevated"
                      >
                        <span
                          className={`size-1.5 shrink-0 rounded-full ${
                            d < 0 ? "bg-danger" : d <= 7 ? "bg-warning" : "bg-control"
                          }`}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] text-ink">{m.title}</span>
                          <span className="block truncate text-xs text-muted">{m.projects?.name}</span>
                        </span>
                        <span
                          className={`shrink-0 font-mono text-[11px] tabular-nums ${
                            d < 0 ? "text-danger" : "text-muted"
                          }`}
                        >
                          {d < 0 ? `${-d}d atraso` : d === 0 ? "hoje" : `${d}d`}
                        </span>
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
                    <Link
                      href={`/projetos/${r.project_id}/documentos`}
                      className="block px-4 py-2.5 transition-colors hover:bg-elevated"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] text-ink">{r.title}</span>
                        <Badge tone={REQUEST_STATUS[r.status].tone} dot>
                          {REQUEST_STATUS[r.status].label}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-muted">
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
