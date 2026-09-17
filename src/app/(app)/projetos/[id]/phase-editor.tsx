"use client";

import { useActionState, useState } from "react";
import { FormMessage, SubmitButton } from "@/components/forms";
import { Button, Input, Select } from "@/components/ui";
import { PHASE_STATUS } from "@/lib/format";
import type { Database } from "@/lib/database.types";
import { updatePhase } from "../actions";

type Phase = Database["public"]["Tables"]["project_phases"]["Row"];

export function PhaseEditor({ projectId, phase }: { projectId: string; phase: Phase }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(updatePhase.bind(null, projectId, phase.id), undefined);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-2 text-xs font-medium text-accent hover:underline">
        Editar fase
      </button>
    );
  }

  return (
    <form action={action} className="mt-3 grid gap-2 rounded-lg bg-paper p-3 sm:grid-cols-3">
      <label className="flex flex-col gap-1 text-xs text-muted">
        Estado
        <Select name="status" defaultValue={phase.status} className="h-9">
          {Object.entries(PHASE_STATUS).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Início
        <Input name="start_date" type="date" defaultValue={phase.start_date ?? ""} className="h-9" />
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Fim previsto
        <Input name="due_date" type="date" defaultValue={phase.due_date ?? ""} className="h-9" />
      </label>
      <div className="flex flex-wrap items-center gap-2 sm:col-span-3">
        <SubmitButton size="sm">Guardar</SubmitButton>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Fechar
        </Button>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
