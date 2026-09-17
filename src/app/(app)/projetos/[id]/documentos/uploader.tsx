"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button, Field, Select, buttonClass, cn } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { DOCUMENT_KIND } from "@/lib/format";
import type { Database } from "@/lib/database.types";

type Kind = Database["public"]["Enums"]["document_kind"];

const MAX_BYTES = 500 * 1024 * 1024;

function safeName(name: string) {
  return name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w.-]+/g, "_").slice(-120);
}

async function uploadFiles(opts: {
  files: File[];
  orgId: string;
  projectId: string;
  requestId?: string;
  kind?: Kind;
  phaseId?: string | null;
  visibleToClient?: boolean;
}) {
  const supabase = createClient();
  for (const file of opts.files) {
    if (file.size > MAX_BYTES) throw new Error(`"${file.name}" excede 500 MB.`);
    const path = `${opts.orgId}/${opts.projectId}/${crypto.randomUUID()}-${safeName(file.name)}`;
    const { error: upErr } = await supabase.storage
      .from("project-files")
      .upload(path, file, { contentType: file.type || undefined });
    if (upErr) throw new Error(`Falha ao enviar "${file.name}".`);

    const { error } = await supabase.from("documents").insert({
      project_id: opts.projectId,
      org_id: opts.orgId,
      request_id: opts.requestId ?? null,
      phase_id: opts.phaseId ?? null,
      name: file.name,
      kind: opts.kind ?? "client_upload",
      storage_path: path,
      mime_type: file.type || null,
      size_bytes: file.size,
      visible_to_client: opts.visibleToClient ?? true,
    });
    if (error) throw new Error(`Falha ao registar "${file.name}".`);
  }
}

/** Botão simples de envio (cliente a responder a um pedido, ou envio livre). */
export function UploadButton({
  orgId,
  projectId,
  requestId,
  label = "Enviar ficheiro",
  variant = "primary",
}: {
  orgId: string;
  projectId: string;
  requestId?: string;
  label?: string;
  variant?: "primary" | "secondary";
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    setError(null);
    try {
      await uploadFiles({ files, orgId, projectId, requestId });
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <label className={cn(buttonClass(variant, "sm"), "cursor-pointer", busy && "pointer-events-none opacity-50")}>
        <Upload className="size-4" aria-hidden />
        {busy ? "A enviar…" : label}
        <input ref={input} type="file" multiple className="sr-only" onChange={onChange} disabled={busy} />
      </label>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

/** Painel do arquiteto para publicar peças do projeto. */
export function StaffUploader({
  orgId,
  projectId,
  phases,
}: {
  orgId: string;
  projectId: string;
  phases: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ error?: string; ok?: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!files.length) return setMessage({ error: "Escolha pelo menos um ficheiro." });
    setBusy(true);
    setMessage(null);
    try {
      await uploadFiles({
        files,
        orgId,
        projectId,
        kind: data.get("kind") as Kind,
        phaseId: (data.get("phase_id") as string) || null,
        visibleToClient: data.get("visible") === "on",
      });
      setFiles([]);
      form.reset();
      setMessage({ ok: "Documentos publicados." });
      router.refresh();
    } catch (err) {
      setMessage({ error: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-line px-4 py-6 text-center text-sm text-muted hover:border-accent">
        <Upload className="size-5" aria-hidden />
        {files.length ? `${files.length} ficheiro(s): ${files.map((f) => f.name).join(", ")}` : "Escolher ficheiros"}
        <span className="text-xs">PDF, imagens, IFC, DWG… até 500 MB</span>
        <input
          type="file"
          multiple
          className="sr-only"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
      </label>
      <Field label="Tipo">
        <Select name="kind" defaultValue="drawing">
          {(Object.keys(DOCUMENT_KIND) as Kind[])
            .filter((k) => k !== "client_upload")
            .map((k) => (
              <option key={k} value={k}>
                {DOCUMENT_KIND[k]}
              </option>
            ))}
        </Select>
      </Field>
      <Field label="Fase">
        <Select name="phase_id" defaultValue="">
          <option value="">— Nenhuma —</option>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="visible" defaultChecked className="size-4 accent-[var(--accent)]" />
        Visível para o cliente
      </label>
      {message?.error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{message.error}</p>}
      {message?.ok && <p className="rounded-lg bg-success-soft px-3 py-2 text-sm text-success">{message.ok}</p>}
      <Button type="submit" disabled={busy}>
        {busy ? "A publicar…" : "Publicar"}
      </Button>
    </form>
  );
}
