"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormMessage, SubmitButton } from "@/components/forms";
import { Field, Input, Select } from "@/components/ui";
import { inviteMember } from "./actions";

export function InviteForm() {
  const [state, action] = useActionState(inviteMember, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-4">
      <Field label="E-mail">
        <Input name="email" type="email" required />
      </Field>
      <Field label="Função">
        <Select name="role" defaultValue="architect">
          <option value="architect">Arquiteto</option>
          <option value="admin">Administrador</option>
        </Select>
      </Field>
      <FormMessage state={state} />
      <SubmitButton pendingText="A enviar…">Enviar convite</SubmitButton>
    </form>
  );
}
