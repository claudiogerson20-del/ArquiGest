import "server-only";
import { headers } from "next/headers";
import { createClient as createAnonClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/server";

export async function siteUrl() {
  const h = await headers();
  return process.env.NEXT_PUBLIC_SITE_URL ?? `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
}

/**
 * Envia um convite por e-mail.
 * - Conta inexistente: convite do Supabase Auth (o utilizador define a palavra-passe).
 * - Conta criada mas por confirmar: reenvia uma ligação de acesso.
 * - Conta confirmada: não envia nada; os triggers da base de dados já deram acesso.
 * Devolve true se a pessoa já tem conta ativa.
 */
export async function sendInvite(email: string, fullName?: string): Promise<boolean> {
  const admin = createAdminClient();
  const redirectTo = `${await siteUrl()}/auth/confirm?next=/definir-senha`;

  const { data: profile } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  if (!profile) {
    const { error } = await admin.auth.admin.inviteUserByEmail(email, {
      data: fullName ? { full_name: fullName } : undefined,
      redirectTo,
    });
    if (error) throw error;
    return false;
  }

  const { data: user } = await admin.auth.admin.getUserById(profile.id);
  if (user.user?.email_confirmed_at) return true;

  const anon = createAnonClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
  const { error } = await anon.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
  });
  if (error) throw error;
  return false;
}
