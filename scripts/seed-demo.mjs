// Cria dados de demonstração no Supabase local.
// Uso: node --env-file=.env.local scripts/seed-demo.mjs
// Contas: arquiteta@demo.arquigest / cliente@demo.arquigest (palavra-passe: demo12345)
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url?.includes("127.0.0.1") && !url?.includes("localhost")) {
  throw new Error("Este script só pode correr contra o Supabase local.");
}

const PASSWORD = "demo12345";
const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

async function ensureUser(email, fullName) {
  const { data: existing } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  if (existing) return existing.id;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error) throw error;
  return data.user.id;
}

async function signedIn(email) {
  const client = createClient(url, anonKey, { auth: { persistSession: false } });
  const { error } = await client.auth.signInWithPassword({ email, password: PASSWORD });
  if (error) throw error;
  return client;
}

const must = ({ data, error }) => {
  if (error) throw error;
  return data;
};

await ensureUser("arquiteta@demo.arquigest", "Ana Ribeiro");
await ensureUser("cliente@demo.arquigest", "Carlos Mendes");

const arq = await signedIn("arquiteta@demo.arquigest");
const { data: memberships } = await arq.from("organization_members").select("org_id");
if (memberships.length) {
  console.log("Dados de demonstração já existem.");
  process.exit(0);
}

const arqId = (await arq.auth.getUser()).data.user.id;
const orgId = must(await arq.rpc("create_organization", { p_name: "Atelier Ribeiro Arquitetos", p_country: "PT" }));
const client = must(
  await arq
    .from("clients")
    .insert({ org_id: orgId, full_name: "Carlos Mendes", email: "cliente@demo.arquigest", phone: "+351 912 345 678" })
    .select("id")
    .single(),
);

const start = new Date();
start.setDate(start.getDate() - 45);
const projectId = must(
  await arq.rpc("create_project", {
    p_org: orgId,
    p_client: client.id,
    p_name: "Moradia T4 em Cascais",
    p_description: "Construção de moradia unifamiliar com 280 m², piscina e jardim.\nLote com 900 m² na Quinta da Marinha.",
    p_location: "Cascais, Lisboa",
    p_typology: "Moradia unifamiliar",
    p_start: start.toISOString().slice(0, 10),
    p_code: "2026-014",
  }),
);

const phases = must(await arq.from("project_phases").select("id, position").eq("project_id", projectId).order("position"));
must(await arq.from("project_phases").update({ status: "completed" }).eq("id", phases[0].id));
must(await arq.from("project_phases").update({ status: "awaiting_client" }).eq("id", phases[1].id));

const inDays = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
must(
  await arq.from("milestones").insert([
    { project_id: projectId, org_id: orgId, phase_id: phases[1].id, title: "Reunião de apresentação do Estudo Prévio", due_date: inDays(3), visible_to_client: true },
    { project_id: projectId, org_id: orgId, phase_id: phases[2].id, title: "Entrega do Anteprojeto", due_date: inDays(30), visible_to_client: true },
    { project_id: projectId, org_id: orgId, phase_id: phases[0].id, title: "Levantamento topográfico", due_date: inDays(-2), visible_to_client: true },
    { project_id: projectId, org_id: orgId, phase_id: null, title: "Revisão interna de custos", due_date: inDays(10), visible_to_client: false },
  ]),
);

must(
  await arq.from("document_requests").insert([
    { project_id: projectId, org_id: orgId, title: "Caderneta predial / Certidão de matrícula", description: "", due_date: inDays(7), requested_by: arqId },
    { project_id: projectId, org_id: orgId, title: "Levantamento topográfico", description: "Formato DWG ou PDF.", due_date: inDays(14), requested_by: arqId },
  ]),
);

must(await arq.from("messages").insert({ project_id: projectId, org_id: orgId, sender_id: arqId, body: "Bom dia Carlos! O Estudo Prévio já está disponível nos documentos. Diga-me o que acha." }));

const cli = await signedIn("cliente@demo.arquigest");
const cliId = (await cli.auth.getUser()).data.user.id;
must(await cli.from("messages").insert({ project_id: projectId, org_id: orgId, sender_id: cliId, body: "Olá Ana, obrigado! Vou ver ainda hoje com a minha mulher." }));

console.log("Dados de demonstração criados.");
console.log("  Arquiteta: arquiteta@demo.arquigest /", PASSWORD);
console.log("  Cliente:   cliente@demo.arquigest /", PASSWORD);
