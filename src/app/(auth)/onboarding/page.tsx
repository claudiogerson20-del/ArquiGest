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
      <h1 className="text-xl font-semibold tracking-tight">O seu escritório</h1>
      <p className="mb-5 mt-1 text-[13px] text-muted">
        O país define as fases de projeto, a terminologia e a moeda.
      </p>
      <OnboardingForm />
    </>
  );
}
