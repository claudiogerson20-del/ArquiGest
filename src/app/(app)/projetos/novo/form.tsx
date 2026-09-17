"use client";

import { useActionState } from "react";
import { FormMessage, SubmitButton } from "@/components/forms";
import { Field, Input, Select, Textarea } from "@/components/ui";
import { createProject } from "../actions";

const TYPOLOGIES = [
  "Moradia unifamiliar",
  "Apartamento / Remodelação",
  "Edifício habitacional",
  "Comércio / Serviços",
  "Equipamento",
  "Industrial",
  "Outro",
];

export function NewProjectForm({ clients }: { clients: { id: string; full_name: string; email: string }[] }) {
  const [state, action] = useActionState(createProject, undefined);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <Field label="Nome do projeto" className="sm:col-span-2">
        <Input name="name" placeholder="Ex.: Moradia T4 em Cascais" required />
      </Field>
      <Field label="Cliente">
        <Select name="client_id" required defaultValue="">
          <option value="" disabled>
            Selecione…
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name} ({c.email})
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Referência interna" hint="Opcional, ex.: 2026-014">
        <Input name="code" />
      </Field>
      <Field label="Localização">
        <Input name="location" placeholder="Cidade, bairro ou morada" />
      </Field>
      <Field label="Tipologia">
        <Select name="typology" defaultValue={TYPOLOGIES[0]}>
          {TYPOLOGIES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field label="Data de início">
        <Input name="start_date" type="date" defaultValue={today} required />
      </Field>
      <Field label="Entrega final prevista" hint="Se vazio, é calculada pelas fases">
        <Input name="due_date" type="date" />
      </Field>
      <Field label="Descrição" className="sm:col-span-2">
        <Textarea name="description" rows={4} placeholder="Âmbito, áreas, observações para o cliente…" />
      </Field>
      <div className="flex flex-col gap-3 sm:col-span-2">
        <FormMessage state={state} />
        <SubmitButton className="self-start" pendingText="A criar projeto…">
          Criar projeto
        </SubmitButton>
      </div>
    </form>
  );
}
