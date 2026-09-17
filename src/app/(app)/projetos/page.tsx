import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ButtonLink, Card, EmptyState, PageHeader, cn } from "@/components/ui";
import { PROJECT_CARD_SELECT, ProjectCard } from "@/components/project-card";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { PROJECT_STATUS } from "@/lib/format";
import type { Database } from "@/lib/database.types";

export const metadata: Metadata = { title: "Projetos" };

type Status = Database["public"]["Enums"]["project_status"];

export default async function ProjectsPage({ searchParams }: PageProps<"/projetos">) {
  const session = await requireStaff();
  const { estado } = await searchParams;
  const filter = typeof estado === "string" && estado in PROJECT_STATUS ? (estado as Status) : null;

  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select(PROJECT_CARD_SELECT)
    .eq("org_id", session.org.id)
    .order("updated_at", { ascending: false });
  if (filter) query = query.eq("status", filter);
  const { data: projects } = await query;

  return (
    <>
      <PageHeader
        title="Projetos"
        action={
          <ButtonLink href="/projetos/novo">
            <Plus className="size-4" aria-hidden /> Novo projeto
          </ButtonLink>
        }
      />
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterLink href="/projetos" active={!filter}>
          Todos
        </FilterLink>
        {(Object.keys(PROJECT_STATUS) as Status[]).map((s) => (
          <FilterLink key={s} href={`/projetos?estado=${s}`} active={filter === s}>
            {PROJECT_STATUS[s].label}
          </FilterLink>
        ))}
      </div>
      {projects?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} showClient />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState title="Nenhum projeto encontrado" />
        </Card>
      )}
    </>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1 text-sm",
        active ? "border-ink bg-ink text-white" : "border-line bg-white text-muted hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
