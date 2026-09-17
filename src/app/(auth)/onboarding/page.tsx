import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { OnboardingForm } from "./form";

export const metadata: Metadata = { title: "Configurar escritório" };

export default async function OnboardingPage() {
  const session = await requireSession();
  if (session.org) redirect("/painel");
  return (
    <>
      <h1 className="text-xl font-semibold">O seu escritório</h1>
      <p className="mb-6 mt-1 text-sm text-muted">
        O país define as fases de projeto, a terminologia e a moeda.
      </p>
      <OnboardingForm />
    </>
  );
}
