import type { Metadata } from "next";
import { requireSession } from "@/lib/session";
import { SetPasswordForm } from "../forms";

export const metadata: Metadata = { title: "Definir palavra-passe" };

export default async function SetPasswordPage() {
  const session = await requireSession();
  return (
    <>
      <h1 className="text-xl font-semibold">Bem-vindo ao ArquiGest</h1>
      <p className="mb-6 mt-1 text-sm text-muted">
        Defina a palavra-passe da conta <strong className="text-ink">{session.email}</strong>.
      </p>
      <SetPasswordForm askName={!session.fullName} />
    </>
  );
}
