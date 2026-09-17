import type { Metadata } from "next";
import { Badge, Button, Card, CardHeader, PageHeader } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { ROLE_LABEL, formatDate } from "@/lib/format";
import { cancelInvitation, removeMember } from "./actions";
import { InviteForm } from "./form";

export const metadata: Metadata = { title: "Equipa" };

export default async function TeamPage() {
  const session = await requireStaff();
  const isAdmin = session.org.role !== "architect";
  const supabase = await createClient();

  const [{ data: members }, { data: invitations }] = await Promise.all([
    supabase
      .from("organization_members")
      .select("user_id, role, created_at, profiles (full_name, email)")
      .eq("org_id", session.org.id)
      .order("created_at"),
    supabase
      .from("organization_invitations")
      .select("id, email, role, created_at")
      .eq("org_id", session.org.id)
      .is("accepted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <PageHeader title="Equipa" description={`Arquitetos e colaboradores de ${session.org.name}.`} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader title="Membros" />
            <ul className="divide-y divide-line">
              {members?.map((m) => (
                <li key={m.user_id} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {m.profiles?.full_name || m.profiles?.email}
                      {m.user_id === session.userId && <span className="text-muted"> (você)</span>}
                    </p>
                    <p className="text-xs text-muted">{m.profiles?.email}</p>
                  </div>
                  <Badge tone={m.role === "owner" ? "blue" : "neutral"}>{ROLE_LABEL[m.role]}</Badge>
                  {isAdmin && m.role !== "owner" && m.user_id !== session.userId && (
                    <form action={removeMember.bind(null, m.user_id)}>
                      <Button size="sm" variant="ghost">
                        Remover
                      </Button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          {!!invitations?.length && (
            <Card>
              <CardHeader title="Convites pendentes" />
              <ul className="divide-y divide-line">
                {invitations.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                    <span className="flex-1">{i.email}</span>
                    <span className="text-xs text-muted">
                      {ROLE_LABEL[i.role]} · {formatDate(i.created_at)}
                    </span>
                    {isAdmin && (
                      <form action={cancelInvitation.bind(null, i.id)}>
                        <Button size="sm" variant="ghost">
                          Cancelar
                        </Button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {isAdmin && (
          <Card className="h-fit">
            <CardHeader title="Convidar arquiteto" />
            <div className="p-5">
              <InviteForm />
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
