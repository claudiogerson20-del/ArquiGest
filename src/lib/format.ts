import { differenceInCalendarDays, format, formatDistanceToNow, parseISO } from "date-fns";
import { pt, ptBR } from "date-fns/locale";
import type { Database } from "@/lib/database.types";

type Enums = Database["public"]["Enums"];

const locale = pt;

export function formatDate(value: string | null | undefined, pattern = "dd/MM/yyyy") {
  if (!value) return "—";
  return format(parseISO(value), pattern, { locale });
}

export function formatDateTime(value: string) {
  return format(parseISO(value), "dd/MM/yyyy HH:mm", { locale });
}

export function timeAgo(value: string) {
  return formatDistanceToNow(parseISO(value), { addSuffix: true, locale });
}

/** Dias até à data (negativo = atrasado). */
export function daysUntil(value: string) {
  return differenceInCalendarDays(parseISO(value), new Date());
}

export function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export const COUNTRY_LABEL: Record<Enums["country_code"], string> = {
  PT: "Portugal",
  AO: "Angola",
  BR: "Brasil",
};

export const COUNTRY_LOCALE = { PT: pt, AO: pt, BR: ptBR };

export const PROJECT_STATUS: Record<Enums["project_status"], { label: string; tone: Tone }> = {
  draft: { label: "Rascunho", tone: "neutral" },
  active: { label: "Em curso", tone: "blue" },
  on_hold: { label: "Suspenso", tone: "amber" },
  completed: { label: "Concluído", tone: "green" },
  cancelled: { label: "Cancelado", tone: "red" },
};

export const PHASE_STATUS: Record<Enums["phase_status"], { label: string; tone: Tone }> = {
  pending: { label: "Por iniciar", tone: "neutral" },
  in_progress: { label: "Em curso", tone: "blue" },
  awaiting_client: { label: "Aguarda cliente", tone: "amber" },
  completed: { label: "Concluída", tone: "green" },
};

export const REQUEST_STATUS: Record<Enums["request_status"], { label: string; tone: Tone }> = {
  pending: { label: "Pendente", tone: "amber" },
  submitted: { label: "Enviado — em análise", tone: "blue" },
  approved: { label: "Aprovado", tone: "green" },
  rejected: { label: "Rejeitado", tone: "red" },
};

export const DOCUMENT_KIND: Record<Enums["document_kind"], string> = {
  drawing: "Desenho / Planta",
  model: "Modelo 3D (IFC)",
  render: "Render / Imagem",
  contract: "Contrato / Orçamento",
  client_upload: "Enviado pelo cliente",
  other: "Outro",
};

export const ROLE_LABEL: Record<Enums["org_role"], string> = {
  owner: "Proprietário",
  admin: "Administrador",
  architect: "Arquiteto",
};

export type Tone = "neutral" | "blue" | "amber" | "green" | "red";
