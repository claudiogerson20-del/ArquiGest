"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { sendInvite } from "@/lib/invites";
import type { FormState } from "@/components/forms";

const clientSchema = z.object({
  full_name: z.string().trim().min(2, "Indique o nome").max(160),
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  phone: z.string().trim().max(40).default(""),
  tax_id: z.string().trim().max(40).default(""),
  address: z.string().trim().max(300).default(""),
  invite: z.preprocess((v) => v === "on", z.boolean()),
});

export async function createClientRecord(_: FormState, formData: FormData): Promise<FormState> {
  const session = await requireStaff();
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { invite, ...v } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("clients").insert({
    org_id: session.org.id,
    full_name: v.full_name,
    email: v.email,
    phone: v.phone || null,
    tax_id: v.tax_id || null,
    address: v.address || null,
  });
  if (error) {
    return { error: error.code === "23505" ? "Já existe um cliente com este e-mail." : "Não foi possível guardar o cliente." };
  }

  revalidatePath("/clientes");
  if (!invite) return { ok: "Cliente registado." };

  try {
    const active = await sendInvite(v.email, v.full_name);
    return {
      ok: active
        ? "Cliente registado. Já tinha conta no ArquiGest e tem acesso imediato."
        : `Cliente registado e convite enviado para ${v.email}.`,
    };
  } catch {
    return { error: "Cliente registado, mas o convite não foi enviado. Tente reenviar." };
  }
}

export async function resendClientInvite(clientId: string) {
  const session = await requireStaff();
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("email, full_name, user_id")
    .eq("id", clientId)
    .eq("org_id", session.org.id)
    .single();
  if (!client || client.user_id) return;
  await sendInvite(client.email, client.full_name).catch(() => null);
  revalidatePath("/clientes");
}
