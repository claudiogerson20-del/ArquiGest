import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

export type OrgRole = Database["public"]["Enums"]["org_role"];
export type Country = Database["public"]["Enums"]["country_code"];

export type Session = {
  userId: string;
  email: string;
  fullName: string;
  /** Escritório ativo (o primeiro de que é membro), se for arquiteto */
  org: { id: string; name: string; country: Country; currency: string; role: OrgRole } | null;
  /** É cliente em algum escritório */
  isClient: boolean;
};

export const getSession = cache(async (): Promise<Session | null> => {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) return null;

  const [{ data: profile }, { data: memberships }, { count: clientCount }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", userId).single(),
    supabase
      .from("organization_members")
      .select("role, organizations (id, name, country, currency)")
      .eq("user_id", userId)
      .order("created_at")
      .limit(1),
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  const m = memberships?.[0];
  return {
    userId,
    email: profile?.email ?? String(claims.claims.email ?? ""),
    fullName: profile?.full_name ?? "",
    org: m?.organizations ? { ...m.organizations, role: m.role } : null,
    isClient: (clientCount ?? 0) > 0,
  };
});

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** Exige conta de arquiteto (membro de escritório). */
export async function requireStaff() {
  const session = await requireSession();
  if (!session.org) redirect(session.isClient ? "/painel" : "/onboarding");
  return session as Session & { org: NonNullable<Session["org"]> };
}
