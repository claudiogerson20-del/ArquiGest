import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { getProject } from "../data";
import { Chat } from "./chat";

export const metadata: Metadata = { title: "Conversa" };

export default async function ConversationPage({ params }: PageProps<"/projetos/[id]/conversa">) {
  const { id } = await params;
  const { project, session, supabase } = await getProject(id);

  const { data: messages } = await supabase
    .from("messages")
    .select("id, body, created_at, sender_id, sender:profiles (full_name, email)")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <Card className="overflow-hidden">
      <Chat
        projectId={id}
        orgId={project.org_id}
        currentUserId={session.userId}
        initialMessages={(messages ?? []).reverse()}
      />
    </Card>
  );
}
