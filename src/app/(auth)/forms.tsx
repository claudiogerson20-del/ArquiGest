"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormMessage, SubmitButton } from "@/components/forms";
import { Field, Input } from "@/components/ui";
import { requestPasswordReset, setPassword, signIn, signUp } from "./actions";

export function LoginForm({ next, linkError }: { next?: string; linkError?: boolean }) {
  const [state, action] = useActionState(
    signIn,
    linkError ? { error: "A ligação expirou ou é inválida. Inicie sessão ou peça uma nova." } : undefined,
  );
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="E-mail">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Palavra-passe">
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>
      <FormMessage state={state} />
      <SubmitButton pendingText="A entrar…">Entrar</SubmitButton>
      <Link href="/recuperar" className="text-center text-sm text-muted hover:text-ink">
        Esqueceu a palavra-passe?
      </Link>
    </form>
  );
}

export function SignUpForm() {
  const [state, action] = useActionState(signUp, undefined);
  if (state?.ok) return <FormMessage state={state} />;
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Nome completo">
        <Input name="full_name" autoComplete="name" required />
      </Field>
      <Field label="E-mail profissional">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Palavra-passe" hint="Mínimo 8 caracteres">
        <Input name="password" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <FormMessage state={state} />
      <SubmitButton pendingText="A criar conta…">Criar conta</SubmitButton>
    </form>
  );
}

export function ResetForm() {
  const [state, action] = useActionState(requestPasswordReset, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="E-mail">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <FormMessage state={state} />
      <SubmitButton pendingText="A enviar…">Enviar ligação</SubmitButton>
    </form>
  );
}

export function SetPasswordForm({ askName }: { askName: boolean }) {
  const [state, action] = useActionState(setPassword, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      {askName && (
        <Field label="Nome completo">
          <Input name="full_name" autoComplete="name" required />
        </Field>
      )}
      <Field label="Nova palavra-passe" hint="Mínimo 8 caracteres">
        <Input name="password" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <Field label="Confirmar palavra-passe">
        <Input name="confirm" type="password" autoComplete="new-password" required />
      </Field>
      <FormMessage state={state} />
      <SubmitButton>Guardar e continuar</SubmitButton>
    </form>
  );
}
