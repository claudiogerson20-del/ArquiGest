# ArquiGest

SaaS que liga escritórios de arquitetura aos seus clientes (Portugal · Angola · Brasil).

O cliente acompanha o projeto num portal próprio: fases, progresso, prazos, linha temporal,
documentos e conversa direta com o arquiteto.

- **Backlog e sprints:** [docs/backlog.md](docs/backlog.md)
- **Fases de projeto por país:** [docs/fases-projeto.md](docs/fases-projeto.md)

## Tecnologias

- Next.js 16 (App Router, Server Actions) + TypeScript + Tailwind CSS 4
- Supabase: Postgres com RLS multi-tenant, Auth, Storage e Realtime

## Arranque local

Requisitos: Node 20+ e Docker.

```bash
npm install
npx supabase start          # base de dados, auth, storage e e-mail local
node --env-file=.env.local scripts/seed-demo.mjs   # dados de demonstração (opcional)
npm run dev
```

1. Copie `.env.example` para `.env.local` e preencha-o com os valores que o `supabase start` mostra
   (URL, anon key e service role key).
2. Abra http://localhost:3000.
3. Os e-mails (convites, confirmações) ficam no Mailpit: http://127.0.0.1:54324.

Contas de demonstração (palavra-passe `demo12345`):
- `arquiteta@demo.arquigest`: escritório "Atelier Ribeiro Arquitetos"
- `cliente@demo.arquigest`: cliente do projeto "Moradia T4 em Cascais"

## Testes

```bash
# Isolamento entre escritórios e permissões do cliente (RLS)
docker exec -i supabase_db_arquigest psql -U postgres -v ON_ERROR_STOP=1 < supabase/tests/rls_test.sql
npm run lint
npm run build
```

## Estrutura

```
src/app/(auth)/          login, registo, recuperar, definir-senha, onboarding
src/app/(app)/painel     painel (arquiteto ou cliente)
src/app/(app)/projetos   lista, novo e detalhe (visão geral, linha temporal, prazos, documentos, conversa)
src/app/(app)/clientes   clientes e convites
src/app/(app)/equipa     membros do escritório
src/app/auth/confirm     ligações de e-mail (token_hash / PKCE)
src/lib/                 clientes Supabase, sessão, convites, formatação
supabase/migrations/     esquema, RLS, triggers e modelos de fases
supabase/templates/      e-mails de autenticação em português
```

## Base de dados de produção

| Campo | Valor |
|-------|-------|
| Projeto / base de dados Supabase | `ArquiGest` |
| Palavra-passe | variável `SUPABASE_DB_PASSWORD` no ficheiro `.env.local` (não versionado) |

A palavra-passe **não** fica no repositório. Está no `.env.local` desta máquina; guarde uma cópia
num gestor de palavras-passe (Bitwarden, 1Password…) para não depender deste computador. Para ligar
o projeto local ao Supabase na nuvem:

```bash
npx supabase link --project-ref <ref-do-projeto> -p "$SUPABASE_DB_PASSWORD"
```

## Produção (Supabase na nuvem)

1. Crie o projeto e aplique as migrações: `npx supabase link` e depois `npx supabase db push`.
2. Em **Auth → Email Templates**, copie os modelos de `supabase/templates/`. As ligações usam
   `token_hash` para funcionar em qualquer browser.
3. Em **Auth → URL Configuration**, defina o Site URL e os Redirect URLs do domínio.
4. Configure as variáveis de `.env.example` no alojamento (ex.: Vercel).
5. Para produção, configure um SMTP próprio (ex.: Resend).
