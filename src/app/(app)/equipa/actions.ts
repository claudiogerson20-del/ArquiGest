"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { sendInvite } from "@/lib/invites";
import type { FormState } from "@/components/forms";

const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  role: z.enum(["admin", "architect"]),
});

export async function inviteMember(_: FormState, formData: FormData): Promise<FormState> {
  const session = await requireStaff();
  if (session.org.role === "architect") return { error: "Só administradores podem convidar." };
  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { email, role } = parsed.data;

  // Inserção com o cliente do utilizador: a RLS confirma que é administrador.
  const supabase = await createClient();
  const { data: invitation, error } = await supabase
    .from("organization_invitations")
    .upsert({ org_id: session.org.id, email, role, invited_by: session.userId }, { onConflict: "org_id,email" })
    .select("id")
    .single();
  if (error || !invitation) return { error: "Não foi possível criar o convite." };

  try {
    const active = await sendInvite(email);
    if (active) {
      // Conta já confirmada: o trigger de auth não volta a correr, por isso adiciona-se já.
      const admin = createAdminClient();
      const { data: profile } = await admin.from("profiles").select("id").eq("email", email).single();
      if (profile) {
        await admin
          .from("organization_members")
          .upsert({ org_id: session.org.id, user_id: profile.id, role }, { onConflict: "org_id,user_id", ignoreDuplicates: true });
        await admin.from("organization_invitations").update({ accepted_at: new Date().toISOString() }).eq("id", invitation.id);
      }
    }
    revalidatePath("/equipa");
    return { ok: active ? `${email} foi adicionado à equipa.` : `Convite enviado para ${email}.` };
  } catch {
    return { error: "O convite foi guardado, mas o e-mail não foi enviado." };
  }
}

export async function removeMember(userId: string) {
  const session = await requireStaff();
  const supabase = await createClient();
  // A RLS só permite a administradores e nunca ao proprietário.
  await supabase.from("organization_members").delete().eq("org_id", session.org.id).eq("user_id", userId);
  revalidatePath("/equipa");
}

export async function cancelInvitation(invitationId: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("organization_invitations").delete().eq("id", invitationId);
  revalidatePath("/equipa");
}
