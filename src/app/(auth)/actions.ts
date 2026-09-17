"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/components/forms";

const credentials = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(8, "A palavra-passe deve ter pelo menos 8 caracteres"),
});

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/painel";
}

async function siteUrl() {
  const h = await headers();
  return process.env.NEXT_PUBLIC_SITE_URL ?? `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
}

export async function signIn(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentials.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "E-mail ou palavra-passe incorretos." };

  redirect(safeNext(formData.get("next")));
}

export async function signUp(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentials
    .extend({ full_name: z.string().trim().min(2, "Indique o seu nome") })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { email, password, full_name } = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      emailRedirectTo: `${await siteUrl()}/auth/confirm?next=/onboarding`,
    },
  });
  if (error) return { error: error.message };

  if (!data.session) {
    return { ok: "Conta criada. Confirme o seu e-mail através da ligação que lhe enviámos." };
  }
  redirect("/onboarding");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(_: FormState, formData: FormData): Promise<FormState> {
  const email = z.string().trim().email().safeParse(formData.get("email"));
  if (!email.success) return { error: "E-mail inválido" };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${await siteUrl()}/auth/confirm?next=/definir-senha`,
  });
  // Resposta igual quer a conta exista ou não.
  return { ok: "Se existir uma conta com este e-mail, receberá uma ligação para redefinir a palavra-passe." };
}

export async function setPassword(_: FormState, formData: FormData): Promise<FormState> {
  const schema = z
    .object({
      password: z.string().min(8, "A palavra-passe deve ter pelo menos 8 caracteres"),
      confirm: z.string(),
      full_name: z.string().trim().optional(),
    })
    .refine((v) => v.password === v.confirm, { message: "As palavras-passe não coincidem" });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { error: "Sessão expirada. Abra novamente a ligação do e-mail." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };

  if (parsed.data.full_name) {
    await supabase.from("profiles").update({ full_name: parsed.data.full_name }).eq("id", user.user.id);
  }
  redirect("/painel");
}
