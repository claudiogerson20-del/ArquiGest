import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { Badge, Button, Card, CardHeader, EmptyState, PageHeader } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { resendClientInvite } from "./actions";
import { ClientForm } from "./form";

export const metadata: Metadata = { title: "Clientes" };

export default async function ClientsPage() {
  const session = await requireStaff();
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*, projects (id)")
    .eq("org_id", session.org.id)
    .order("full_name");

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Cada cliente recebe acesso ao portal para acompanhar os seus projetos."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={`${clients?.length ?? 0} cliente(s)`} />
          {clients?.length ? (
            <ul className="divide-y divide-line">
              {clients.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-elevated text-sm font-semibold">
                    {c.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{c.full_name}</p>
                    <p className="flex flex-wrap gap-x-3 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="size-3" aria-hidden /> {c.email}
                      </span>
                      {c.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="size-3" aria-hidden /> {c.phone}
                        </span>
                      )}
                      <span>{c.projects.length} projeto(s)</span>
                    </p>
                  </div>
                  {c.user_id ? (
                    <Badge tone="green">Acesso ativo</Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge tone="amber">Convite pendente</Badge>
                      <form action={resendClientInvite.bind(null, c.id)}>
                        <Button size="sm" variant="secondary">
                          Enviar convite
                        </Button>
                      </form>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Ainda não há clientes">Registe o primeiro cliente no formulário.</EmptyState>
          )}
        </Card>
        <Card className="h-fit">
          <CardHeader title="Novo cliente" />
          <div className="p-4">
            <ClientForm taxLabel={session.org.country === "BR" ? "CPF / CNPJ" : "NIF"} />
          </div>
        </Card>
      </div>
    </>
  );
}
