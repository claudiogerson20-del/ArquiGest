import type { Metadata } from "next";
import { requireSession } from "@/lib/session";
import { SetPasswordForm } from "../forms";

export const metadata: Metadata = { title: "Definir palavra-passe" };

export default async function SetPasswordPage() {
  const session = await requireSession();
  return (
    <>
      <h1 className="font-display text-3xl leading-tight tracking-tight">Bem-vindo ao ArquiGest</h1>
      <p className="mb-6 mt-1 text-sm text-muted">
        Defina a palavra-passe da conta <strong className="text-ink">{session.email}</strong>.
      </p>
      <SetPasswordForm askName={!session.fullName} />
    </>
  );
}
