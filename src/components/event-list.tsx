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
  if (!events.length) return <p className="text-[13px] text-muted">Ainda sem atividade.</p>;
  return (
    <ol className="relative">
      {events.map((e, i) => {
        const Icon = iconFor(e.type);
        const tone =
          e.type === "request_rejected"
            ? "text-danger"
            : e.type === "phase_completed" || e.type === "request_approved" || e.type === "milestone_done"
              ? "text-success"
              : "text-faint";
        return (
          <li key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < events.length - 1 && (
              <span className="absolute bottom-0 left-[11px] top-6 w-px bg-line" aria-hidden />
            )}
            <span
              className={cn(
                "z-10 flex size-[22px] shrink-0 items-center justify-center rounded-full border border-line bg-surface",
                tone,
              )}
            >
              <Icon className="size-3" aria-hidden />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[13px] leading-snug text-ink">{e.title}</p>
              <p className="mt-0.5 font-mono text-[11px] text-faint" title={formatDateTime(e.created_at)}>
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
