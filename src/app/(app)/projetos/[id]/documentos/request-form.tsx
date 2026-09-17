"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormMessage, SubmitButton } from "@/components/forms";
import { Field, Input, Textarea } from "@/components/ui";
import { createDocumentRequest } from "../../actions";

const SUGGESTIONS = [
  "Caderneta predial / Certidão de matrícula",
  "Certidão do registo predial",
  "Levantamento topográfico",
  "Documento de identificação do proprietário",
  "Planta de localização",
  "Escritura / Contrato de compra",
];

export function RequestForm({ projectId }: { projectId: string }) {
  const [state, action] = useActionState(createDocumentRequest.bind(null, projectId), undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-4">
      <Field label="Documento">
        <Input name="title" list="doc-suggestions" required />
        <datalist id="doc-suggestions">
          {SUGGESTIONS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </Field>
      <Field label="Instruções">
        <Textarea name="description" rows={2} placeholder="Formato, validade, onde obter…" />
      </Field>
      <Field label="Prazo">
        <Input name="due_date" type="date" />
      </Field>
      <FormMessage state={state} />
      <SubmitButton>Pedir documento</SubmitButton>
    </form>
  );
}
