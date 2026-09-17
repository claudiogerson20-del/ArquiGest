"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button, cn } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/format";

export type ChatMessage = {
  id: string;
  body: string;
  created_at: string;
  sender_id: string;
  sender: { full_name: string; email: string } | null;
};

export function Chat({
  projectId,
  orgId,
  currentUserId,
  initialMessages,
}: {
  projectId: string;
  orgId: string;
  currentUserId: string;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const [supabase] = useState(createClient);

  // Mensagens em tempo real
  useEffect(() => {
    const names = new Map<string, ChatMessage["sender"]>();
    const channel = supabase
      .channel(`messages:${projectId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `project_id=eq.${projectId}` },
        async (payload) => {
          const row = payload.new as Omit<ChatMessage, "sender">;
          let sender = names.get(row.sender_id);
          if (sender === undefined) {
            const { data } = await supabase
              .from("profiles")
              .select("full_name, email")
              .eq("id", row.sender_id)
              .maybeSingle();
            sender = data;
            names.set(row.sender_id, sender);
          }
          setMessages((prev) => (prev.some((m) => m.id === row.id) ? prev : [...prev, { ...row, sender }]));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, supabase]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setSending(true);
    setError(null);
    const { data, error } = await supabase
      .from("messages")
      .insert({ project_id: projectId, org_id: orgId, sender_id: currentUserId, body: text })
      .select("id, body, created_at, sender_id, sender:profiles (full_name, email)")
      .single();
    setSending(false);
    if (error || !data) return setError("Não foi possível enviar a mensagem.");
    setBody("");
    setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]));
  }

  return (
    <div className="flex h-[65vh] min-h-[420px] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto bg-paper/50 px-4 py-5">
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">
            Ainda não há mensagens. Escreva a primeira — a conversa fica guardada no projeto.
          </p>
        )}
        {messages.map((m, i) => {
          const mine = m.sender_id === currentUserId;
          const showName = !mine && messages[i - 1]?.sender_id !== m.sender_id;
          return (
            <div key={m.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
              {showName && (
                <span className="mb-1 px-1 text-xs font-medium text-muted">
                  {m.sender?.full_name || m.sender?.email || "Utilizador"}
                </span>
              )}
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm",
                  mine ? "rounded-br-sm bg-ink text-white" : "rounded-bl-sm border border-line bg-white",
                )}
              >
                {m.body}
              </div>
              <span className="mt-0.5 px-1 text-[11px] text-muted">{formatDateTime(m.created_at)}</span>
            </div>
          );
        })}
        <div ref={bottom} />
      </div>
      <form onSubmit={send} className="flex items-end gap-2 border-t border-line bg-white p-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          rows={1}
          maxLength={5000}
          placeholder="Escreva uma mensagem… (Enter para enviar, Shift+Enter para nova linha)"
          aria-label="Mensagem"
          className="max-h-40 min-h-10 flex-1 resize-none rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <Button type="submit" disabled={sending || !body.trim()} aria-label="Enviar">
          <SendHorizontal className="size-4" aria-hidden />
        </Button>
      </form>
      {error && <p className="bg-white px-3 pb-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
