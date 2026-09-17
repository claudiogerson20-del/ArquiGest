"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/components/forms";

const schema = z.object({
  name: z.string().trim().min(2, "Indique o nome do escritório").max(120),
  country: z.enum(["PT", "AO", "BR"]),
});

export async function createOrganization(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_organization", {
    p_name: parsed.data.name,
    p_country: parsed.data.country,
  });
  if (error) return { error: "Não foi possível criar o escritório. Tente novamente." };

  redirect("/painel");
}
