import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "../forms";

export const metadata: Metadata = { title: "Criar conta" };

export default function SignUpPage() {
  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">Criar conta de escritório</h1>
      <p className="mb-5 mt-1 text-[13px] text-muted">
        Os clientes não precisam de se registar: recebem um convite do seu arquiteto.
      </p>
      <SignUpForm />
      <p className="mt-5 border-t border-line pt-4 text-center text-[13px] text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </>
  );
}
