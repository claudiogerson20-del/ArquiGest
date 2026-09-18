import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "../forms";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next, erro } = await searchParams;
  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">Entrar</h1>
      <p className="mb-5 mt-1 text-[13px] text-muted">Aceda aos seus projetos.</p>
      <LoginForm next={typeof next === "string" ? next : undefined} linkError={erro === "link"} />
      <p className="mt-5 border-t border-line pt-4 text-center text-[13px] text-muted">
        É um escritório de arquitetura?{" "}
        <Link href="/registo" className="font-medium text-ink underline underline-offset-4">
          Criar conta
        </Link>
      </p>
    </>
  );
}
