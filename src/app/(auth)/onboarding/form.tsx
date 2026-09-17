"use client";

import { useActionState } from "react";
import { FormMessage, SubmitButton } from "@/components/forms";
import { Field, Input, Select } from "@/components/ui";
import { createOrganization } from "./actions";

export function OnboardingForm() {
  const [state, action] = useActionState(createOrganization, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Nome do escritório">
        <Input name="name" placeholder="Ex.: Atelier Silva Arquitetos" required />
      </Field>
      <Field label="País">
        <Select name="country" defaultValue="PT" required>
          <option value="PT">Portugal (EUR)</option>
          <option value="AO">Angola (AOA)</option>
          <option value="BR">Brasil (BRL)</option>
        </Select>
      </Field>
      <FormMessage state={state} />
      <SubmitButton pendingText="A criar…">Criar escritório</SubmitButton>
    </form>
  );
}
