import type { Metadata } from "next";
import Link from "next/link";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { COUNTRY_LABEL } from "@/lib/format";
import { NewProjectForm } from "./form";

export const metadata: Metadata = { title: "Novo projeto" };

export default async function NewProjectPage() {
  const session = await requireStaff();
  const supabase = await createClient();
  const [{ data: clients }, { data: phases }] = await Promise.all([
    supabase.from("clients").select("id, full_name, email").eq("org_id", session.org.id).order("full_name"),
    supabase
      .from("phase_templates")
      .select("position, name, default_weeks")
      .eq("country", session.org.country)
      .order("position"),
  ]);

  return (
    <>
      <PageHeader
        title="Novo projeto"
        description={`As fases são criadas segundo o modelo de ${COUNTRY_LABEL[session.org.country]}. Pode ajustar as datas depois.`}
      />
      {clients?.length ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <NewProjectForm clients={clients} />
          </Card>
          <Card className="h-fit p-5">
            <h2 className="font-semibold">Fases que serão criadas</h2>
            <ol className="mt-3 space-y-2 text-sm">
              {phases?.map((p) => (
                <li key={p.position} className="flex justify-between gap-2">
                  <span>
                    {p.position}. {p.name}
                  </span>
                  <span className="shrink-0 text-muted">{p.default_weeks} sem.</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      ) : (
        <Card>
          <EmptyState title="Primeiro registe um cliente">
            Cada projeto pertence a um cliente.{" "}
            <Link href="/clientes" className="font-medium text-ink underline underline-offset-4">
              Adicionar cliente
            </Link>
          </EmptyState>
        </Card>
      )}
    </>
  );
}
