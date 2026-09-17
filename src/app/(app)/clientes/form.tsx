"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormMessage, SubmitButton } from "@/components/forms";
import { Field, Input } from "@/components/ui";
import { createClientRecord } from "./actions";

export function ClientForm({ taxLabel }: { taxLabel: string }) {
  const [state, action] = useActionState(createClientRecord, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-4">
      <Field label="Nome">
        <Input name="full_name" required />
      </Field>
      <Field label="E-mail">
        <Input name="email" type="email" required />
      </Field>
      <Field label="Telefone">
        <Input name="phone" type="tel" />
      </Field>
      <Field label={taxLabel}>
        <Input name="tax_id" />
      </Field>
      <Field label="Morada">
        <Input name="address" />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="invite" defaultChecked className="size-4 accent-accent" />
        Enviar convite de acesso ao portal
      </label>
      <FormMessage state={state} />
      <SubmitButton>Adicionar cliente</SubmitButton>
    </form>
  );
}
