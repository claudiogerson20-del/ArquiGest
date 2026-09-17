"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormMessage, SubmitButton } from "@/components/forms";
import { Field, Input, Select, Textarea } from "@/components/ui";
import { createMilestone } from "../../actions";

export function MilestoneForm({ projectId, phases }: { projectId: string; phases: { id: string; name: string }[] }) {
  const [state, action] = useActionState(createMilestone.bind(null, projectId), undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-4">
      <Field label="Título">
        <Input name="title" placeholder="Ex.: Entrega do Estudo Prévio" required />
      </Field>
      <Field label="Data">
        <Input name="due_date" type="date" required />
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
      <Field label="Notas">
        <Textarea name="description" rows={2} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="visible_to_client" defaultChecked className="size-4 accent-[var(--accent)]" />
        Visível para o cliente
      </label>
      <FormMessage state={state} />
      <SubmitButton>Adicionar prazo</SubmitButton>
    </form>
  );
}
