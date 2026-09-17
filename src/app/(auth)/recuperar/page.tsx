import type { Metadata } from "next";
import Link from "next/link";
import { ResetForm } from "../forms";

export const metadata: Metadata = { title: "Recuperar palavra-passe" };

export default function ResetPage() {
  return (
    <>
      <h1 className="font-display text-3xl leading-tight tracking-tight">Recuperar palavra-passe</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Enviamos uma ligação para o seu e-mail.</p>
      <ResetForm />
      <Link href="/login" className="mt-6 block text-center text-sm text-muted hover:text-ink">
        Voltar a entrar
      </Link>
    </>
  );
}
