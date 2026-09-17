import type { Metadata } from "next";
import { FileText, Trash2 } from "lucide-react";
import { Badge, Button, Card, CardHeader, EmptyState, Input } from "@/components/ui";
import { DOCUMENT_KIND, REQUEST_STATUS, daysUntil, formatBytes, formatDate, formatDateTime } from "@/lib/format";
import { deleteDocument, deleteDocumentRequest, reviewDocumentRequest } from "../../actions";
import { getProject } from "../data";
import { DownloadButton } from "./download-button";
import { RequestForm } from "./request-form";
import { StaffUploader, UploadButton } from "./uploader";

export const metadata: Metadata = { title: "Documentos" };

export default async function DocumentsPage({ params }: PageProps<"/projetos/[id]/documentos">) {
  const { id } = await params;
  const { project, isStaff, supabase } = await getProject(id);

  const [{ data: requests }, { data: documents }, { data: phases }] = await Promise.all([
    supabase.from("document_requests").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase
      .from("documents")
      .select("*, uploader:profiles!documents_uploaded_by_fkey (full_name), project_phases (name)")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    isStaff
      ? supabase.from("project_phases").select("id, name").eq("project_id", id).order("position")
      : Promise.resolve({ data: [] }),
  ]);

  const byRequest = new Map<string, NonNullable<typeof documents>>();
  for (const d of documents ?? []) {
    if (!d.request_id) continue;
    byRequest.set(d.request_id, [...(byRequest.get(d.request_id) ?? []), d]);
  }
  const projectFiles = (documents ?? []).filter((d) => !d.request_id);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        {/* Pedidos de documentos ao cliente */}
        <Card>
          <CardHeader
            title="Documentos pedidos ao cliente"
            description={isStaff ? "Aprove ou rejeite o que o cliente enviou." : "Envie os documentos que o seu arquiteto pediu."}
          />
          {requests?.length ? (
            <ul className="divide-y divide-line">
              {requests.map((r) => {
                const st = REQUEST_STATUS[r.status];
                const files = byRequest.get(r.id) ?? [];
                const canUpload = !isStaff && (r.status === "pending" || r.status === "rejected");
                const overdue = r.due_date && r.status === "pending" && daysUntil(r.due_date) < 0;
                return (
                  <li key={r.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{r.title}</p>
                          <Badge tone={st.tone}>{st.label}</Badge>
                          {overdue && <Badge tone="red">Fora do prazo</Badge>}
                        </div>
                        {r.description && <p className="mt-0.5 text-sm text-muted">{r.description}</p>}
                        {r.due_date && <p className="mt-0.5 text-xs text-muted">Prazo: {formatDate(r.due_date)}</p>}
                        {r.review_note && (
                          <p className="mt-2 rounded-lg bg-paper px-3 py-2 text-sm">
                            <span className="font-medium">Nota do arquiteto:</span> {r.review_note}
                          </p>
                        )}
                      </div>
                      {canUpload && (
                        <UploadButton
                          orgId={project.org_id}
                          projectId={id}
                          requestId={r.id}
                          label={r.status === "rejected" ? "Reenviar" : "Enviar"}
                        />
                      )}
                      {isStaff && r.status !== "approved" && (
                        <form action={deleteDocumentRequest.bind(null, id, r.id)}>
                          <Button size="sm" variant="ghost" aria-label="Eliminar pedido">
                            <Trash2 className="size-4" aria-hidden />
                          </Button>
                        </form>
                      )}
                    </div>

                    {files.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {files.map((f) => (
                          <FileRow key={f.id} file={f} projectId={id} isStaff={isStaff} />
                        ))}
                      </ul>
                    )}

                    {isStaff && r.status === "submitted" && (
                      <form className="mt-3 flex flex-wrap items-center gap-2">
                        <Input name="note" placeholder="Nota para o cliente (opcional)" className="h-8 max-w-xs flex-1" />
                        <Button size="sm" formAction={reviewDocumentRequest.bind(null, id, r.id, true)}>
                          Aprovar
                        </Button>
                        <Button size="sm" variant="danger" formAction={reviewDocumentRequest.bind(null, id, r.id, false)}>
                          Rejeitar
                        </Button>
                      </form>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState title="Sem pedidos de documentos" />
          )}
        </Card>

        {/* Peças do projeto */}
        <Card>
          <CardHeader
            title="Ficheiros do projeto"
            description="Plantas, renders, modelos e outros documentos partilhados."
            action={
              !isStaff && <UploadButton orgId={project.org_id} projectId={id} label="Enviar outro documento" variant="secondary" />
            }
          />
          {projectFiles.length ? (
            <ul className="space-y-1.5 px-5 py-4">
              {projectFiles.map((f) => (
                <FileRow key={f.id} file={f} projectId={id} isStaff={isStaff} />
              ))}
            </ul>
          ) : (
            <EmptyState title="Ainda não há ficheiros" />
          )}
        </Card>
      </div>

      {isStaff && (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Publicar ficheiros" />
            <div className="p-5">
              <StaffUploader orgId={project.org_id} projectId={id} phases={phases ?? []} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Pedir documento ao cliente" />
            <div className="p-5">
              <RequestForm projectId={id} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

type FileRowData = {
  id: string;
  name: string;
  kind: keyof typeof DOCUMENT_KIND;
  version: number;
  size_bytes: number | null;
  created_at: string;
  visible_to_client: boolean;
  uploader: { full_name: string } | null;
  project_phases: { name: string } | null;
};

function FileRow({ file, projectId, isStaff }: { file: FileRowData; projectId: string; isStaff: boolean }) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-line px-3 py-2">
      <FileText className="size-5 shrink-0 text-muted" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium" title={file.name}>
          {file.name}
          {file.version > 1 && <span className="ml-1.5 text-xs text-accent">v{file.version}</span>}
        </p>
        <p className="truncate text-xs text-muted">
          {DOCUMENT_KIND[file.kind]}
          {file.project_phases && ` · ${file.project_phases.name}`} · {formatBytes(file.size_bytes)} ·{" "}
          {formatDateTime(file.created_at)}
          {file.uploader?.full_name && ` · ${file.uploader.full_name}`}
          {isStaff && !file.visible_to_client && " · interno"}
        </p>
      </div>
      <DownloadButton documentId={file.id} />
      {isStaff && (
        <form action={deleteDocument.bind(null, projectId, file.id)}>
          <Button size="sm" variant="ghost" aria-label="Eliminar ficheiro">
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </form>
      )}
    </li>
  );
}
