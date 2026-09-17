import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardHeader } from "@/components/ui";
import { getProject } from "../data";
import { ProjectSettingsForm } from "./form";

export const metadata: Metadata = { title: "Definições do projeto" };

export default async function ProjectSettingsPage({ params }: PageProps<"/projetos/[id]/definicoes">) {
  const { id } = await params;
  const { project, isStaff } = await getProject(id);
  if (!isStaff) notFound();

  return (
    <Card className="max-w-3xl">
      <CardHeader title="Definições do projeto" />
      <div className="p-5">
        <ProjectSettingsForm project={project} />
      </div>
    </Card>
  );
}
