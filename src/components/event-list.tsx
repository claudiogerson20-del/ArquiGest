import {
  CalendarCheck2,
  CalendarPlus,
  CircleDot,
  FileCheck2,
  FilePlus2,
  FileQuestion,
  FileX2,
  Flag,
  FolderPlus,
} from "lucide-react";
import { cn } from "@/components/ui";
import { formatDateTime, timeAgo } from "@/lib/format";

export type EventItem = {
  id: string;
  title: string;
  type: string;
  created_at: string;
  actor: { full_name: string } | null;
};

function iconFor(type: string) {
  if (type === "project_created") return FolderPlus;
  if (type === "document_uploaded") return FilePlus2;
  if (type === "request_created") return FileQuestion;
  if (type === "request_approved") return FileCheck2;
  if (type === "request_rejected") return FileX2;
  if (type === "milestone_done") return CalendarCheck2;
  if (type.startsWith("milestone")) return CalendarPlus;
  if (type.startsWith("phase")) return Flag;
  return CircleDot;
}

export function EventList({ events, compact = false }: { events: EventItem[]; compact?: boolean }) {
  if (!events.length) return <p className="text-sm text-muted">Ainda sem atividade.</p>;
  return (
    <ol className="space-y-4">
      {events.map((e) => {
        const Icon = iconFor(e.type);
        const tone =
          e.type === "request_rejected"
            ? "bg-red-50 text-red-700"
            : e.type === "phase_completed" || e.type === "request_approved" || e.type === "milestone_done"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-paper text-muted";
        return (
          <li key={e.id} className="flex gap-3">
            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", tone)}>
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm">{e.title}</p>
              <p className="text-xs text-muted" title={formatDateTime(e.created_at)}>
                {compact ? timeAgo(e.created_at) : formatDateTime(e.created_at)}
                {e.actor?.full_name && ` · ${e.actor.full_name}`}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
