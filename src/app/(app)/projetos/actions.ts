"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireSession, requireStaff } from "@/lib/session";
import type { FormState } from "@/components/forms";

// Todas as ações verificam a sessão; as políticas RLS garantem a autorização por linha.

const optionalDate = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .pipe(z.string().date("Data inválida").nullable());

const projectSchema = z.object({
  name: z.string().trim().min(2, "Indique o nome do projeto").max(160),
  client_id: z.string().uuid("Selecione o cliente"),
  code: z.string().trim().max(40).default(""),
  location: z.string().trim().max(200).default(""),
  typology: z.string().trim().max(80).default(""),
  description: z.string().trim().max(4000).default(""),
  start_date: z.string().date("Data de início inválida"),
  due_date: optionalDate,
});

export async function createProject(_: FormState, formData: FormData): Promise<FormState> {
  const session = await requireStaff();
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const v = parsed.data;

  const supabase = await createClient();
  const { data: id, error } = await supabase.rpc("create_project", {
    p_org: session.org.id,
    p_client: v.client_id,
    p_name: v.name,
    p_description: v.description,
    p_location: v.location,
    p_typology: v.typology,
    p_start: v.start_date,
    p_due: v.due_date ?? undefined,
    p_code: v.code,
  });
  if (error || !id) return { error: "Não foi possível criar o projeto." };

  redirect(`/projetos/${id}`);
}

const updateProjectSchema = projectSchema.omit({ client_id: true }).extend({
  status: z.enum(["draft", "active", "on_hold", "completed", "cancelled"]),
});

export async function updateProject(projectId: string, _: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const parsed = updateProjectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ ...parsed.data, code: parsed.data.code || null })
    .eq("id", projectId);
  if (error) return { error: "Não foi possível guardar." };

  revalidatePath(`/projetos/${projectId}`, "layout");
  return { ok: "Projeto atualizado." };
}

// --- Fases -----------------------------------------------------------------

const phaseSchema = z.object({
  status: z.enum(["pending", "in_progress", "awaiting_client", "completed"]),
  start_date: optionalDate,
  due_date: optionalDate,
});

export async function updatePhase(
  projectId: string,
  phaseId: string,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireStaff();
  const parsed = phaseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("project_phases").update(parsed.data).eq("id", phaseId);
  if (error) return { error: "Não foi possível atualizar a fase." };

  revalidatePath(`/projetos/${projectId}`, "layout");
  return { ok: "Fase atualizada." };
}

// --- Prazos ----------------------------------------------------------------

const milestoneSchema = z.object({
  title: z.string().trim().min(2, "Indique o título").max(160),
  description: z.string().trim().max(1000).default(""),
  due_date: z.string().date("Data inválida"),
  phase_id: z
    .string()
    .transform((v) => v || null)
    .pipe(z.string().uuid().nullable()),
  visible_to_client: z.preprocess((v) => v === "on", z.boolean()),
});

export async function createMilestone(projectId: string, _: FormState, formData: FormData): Promise<FormState> {
  const session = await requireStaff();
  const parsed = milestoneSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("milestones")
    .insert({ ...parsed.data, project_id: projectId, org_id: session.org.id });
  if (error) return { error: "Não foi possível criar o prazo." };

  revalidatePath(`/projetos/${projectId}`, "layout");
  return { ok: "Prazo adicionado." };
}

export async function toggleMilestone(projectId: string, milestoneId: string, done: boolean) {
  await requireStaff();
  const supabase = await createClient();
  await supabase
    .from("milestones")
    .update({ done_at: done ? new Date().toISOString() : null })
    .eq("id", milestoneId);
  revalidatePath(`/projetos/${projectId}`, "layout");
}

export async function deleteMilestone(projectId: string, milestoneId: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("milestones").delete().eq("id", milestoneId);
  revalidatePath(`/projetos/${projectId}`, "layout");
}

// --- Pedidos de documentos --------------------------------------------------

const requestSchema = z.object({
  title: z.string().trim().min(2, "Indique o documento pedido").max(160),
  description: z.string().trim().max(1000).default(""),
  due_date: optionalDate,
});

export async function createDocumentRequest(
  projectId: string,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireStaff();
  const parsed = requestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("document_requests").insert({
    ...parsed.data,
    project_id: projectId,
    org_id: session.org.id,
    requested_by: session.userId,
  });
  if (error) return { error: "Não foi possível criar o pedido." };

  revalidatePath(`/projetos/${projectId}`, "layout");
  return { ok: "Pedido enviado ao cliente." };
}

export async function reviewDocumentRequest(
  projectId: string,
  requestId: string,
  approve: boolean,
  formData: FormData,
) {
  await requireStaff();
  const note = String(formData.get("note") ?? "").slice(0, 1000);
  const supabase = await createClient();
  await supabase.rpc("review_document_request", {
    p_request: requestId,
    p_approve: approve,
    p_note: note,
  });
  revalidatePath(`/projetos/${projectId}`, "layout");
}

export async function deleteDocumentRequest(projectId: string, requestId: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("document_requests").delete().eq("id", requestId);
  revalidatePath(`/projetos/${projectId}`, "layout");
}

// --- Documentos -------------------------------------------------------------

export async function deleteDocument(projectId: string, documentId: string) {
  await requireStaff();
  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", documentId)
    .single();
  if (!doc) return;
  await supabase.storage.from("project-files").remove([doc.storage_path]);
  await supabase.from("documents").delete().eq("id", documentId);
  revalidatePath(`/projetos/${projectId}`, "layout");
}

/** URL temporária (10 min) para abrir/descarregar um documento. */
export async function getDocumentUrl(documentId: string) {
  await requireSession();
  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("storage_path, name")
    .eq("id", documentId)
    .single();
  if (!doc) return null;
  const { data } = await supabase.storage
    .from("project-files")
    .createSignedUrl(doc.storage_path, 600, { download: doc.name });
  return data?.signedUrl ?? null;
}

export async function refreshProject(projectId: string) {
  await requireSession();
  revalidatePath(`/projetos/${projectId}`, "layout");
}
