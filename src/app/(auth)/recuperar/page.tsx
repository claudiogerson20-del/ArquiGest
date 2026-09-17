import type { Metadata } from "next";
import Link from "next/link";
import { ResetForm } from "../forms";

export const metadata: Metadata = { title: "Recuperar palavra-passe" };

export default function ResetPage() {
  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">Recuperar palavra-passe</h1>
      <p className="mb-5 mt-1 text-[13px] text-muted">Enviamos uma ligação para o seu e-mail.</p>
      <ResetForm />
      <Link href="/login" className="mt-5 block text-center text-[13px] text-muted hover:text-ink">
        Voltar a entrar
      </Link>
    </>
  );
}
