"use client";

import { useActionState } from "react";
import { FormMessage, SubmitButton } from "@/components/forms";
import { Field, Input, Select, Textarea } from "@/components/ui";
import { PROJECT_STATUS } from "@/lib/format";
import type { Database } from "@/lib/database.types";
import { updateProject } from "../../actions";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export function ProjectSettingsForm({ project }: { project: Project }) {
  const [state, action] = useActionState(updateProject.bind(null, project.id), undefined);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <Field label="Nome do projeto" className="sm:col-span-2">
        <Input name="name" defaultValue={project.name} required />
      </Field>
      <Field label="Estado">
        <Select name="status" defaultValue={project.status}>
          {Object.entries(PROJECT_STATUS).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Referência interna">
        <Input name="code" defaultValue={project.code ?? ""} />
      </Field>
      <Field label="Localização">
        <Input name="location" defaultValue={project.location} />
      </Field>
      <Field label="Tipologia">
        <Input name="typology" defaultValue={project.typology} />
      </Field>
      <Field label="Data de início">
        <Input name="start_date" type="date" defaultValue={project.start_date ?? ""} required />
      </Field>
      <Field label="Entrega final prevista">
        <Input name="due_date" type="date" defaultValue={project.due_date ?? ""} />
      </Field>
      <Field label="Descrição" className="sm:col-span-2">
        <Textarea name="description" rows={5} defaultValue={project.description} />
      </Field>
      <div className="flex flex-col gap-3 sm:col-span-2">
        <FormMessage state={state} />
        <SubmitButton className="self-start">Guardar alterações</SubmitButton>
      </div>
    </form>
  );
}
