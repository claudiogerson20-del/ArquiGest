import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/session";

/** Carrega o projeto (RLS garante o acesso) e o papel do utilizador nele. */
export const getProject = cache(async (id: string) => {
  const session = await requireSession();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select(
      "*, clients (id, full_name, email, phone, user_id), organizations (name), lead:profiles!projects_lead_architect_id_fkey (full_name, email)",
    )
    .eq("id", id)
    .maybeSingle();
  if (!project) notFound();

  const isStaff = session.org?.id === project.org_id;
  return { project, session, isStaff, supabase };
});
