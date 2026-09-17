# ArquiGest — Backlog ágil

Metodologia: **Scrum leve**, com sprints de 2 semanas, backlog priorizado e uma entrega utilizável
no fim de cada sprint.

**Definição de Pronto (DoD):** o código compila (`npm run build`), passa o lint, as políticas RLS
cobrem a funcionalidade, a funcionalidade foi testada manualmente com as contas de arquiteto e de
cliente, a história tem commit próprio e o backlog está atualizado.

Legenda: ✅ feito · 🔄 em curso · ⬜ por fazer

---

## Épicos

| ID | Épico | Prioridade |
|----|-------|-----------|
| E1 | Contas, escritórios e convites | Alta |
| E2 | Projetos e fases | Alta |
| E3 | Prazos e linha temporal | Alta |
| E4 | Documentos (pedidos, envio e aprovação) | Alta |
| E5 | Conversa direta arquiteto ↔ cliente | Alta |
| E6 | Visualizador do projeto (PDF, imagens, IFC/Revit) | Média |
| E7 | Notificações (e-mail e app) | Média |
| E8 | Assinaturas SaaS (planos e pagamentos) | Média |
| E9 | Internacionalização PT-PT / PT-AO / PT-BR | Baixa |

---

## Sprint 1 — Fundações (MVP núcleo) ✅

Objetivo: um escritório gere os seus projetos e o cliente acompanha-os.

| ID | História de utilizador | Estado |
|----|------------------------|--------|
| US-01 | Como **arquiteto**, quero criar conta e o meu escritório (nome e país) para começar a usar a plataforma. | ✅ |
| US-02 | Como **arquiteto**, quero iniciar e terminar sessão com e-mail e palavra-passe. | ✅ |
| US-03 | Como **arquiteto**, quero registar clientes e enviar-lhes um convite por e-mail para acederem ao portal. | ✅ |
| US-04 | Como **arquiteto**, quero criar um projeto com as fases do meu país já preenchidas e com datas sugeridas. | ✅ |
| US-05 | Como **arquiteto**, quero alterar o estado e as datas de cada fase para manter o cliente informado. | ✅ |
| US-06 | Como **cliente**, quero ver os meus projetos, a fase atual e o progresso. | ✅ |
| US-07 | Como **arquiteto**, quero definir prazos de entrega (marcos) e marcá-los como cumpridos. | ✅ |
| US-08 | Como **cliente**, quero ver os prazos, com destaque para os atrasados e os próximos. | ✅ |
| US-09 | Como **cliente/arquiteto**, quero ver a linha temporal com tudo o que aconteceu no projeto. | ✅ |
| US-10 | Como **arquiteto**, quero pedir documentos ao cliente (ex.: caderneta predial) com prazo. | ✅ |
| US-11 | Como **cliente**, quero enviar os documentos pedidos e ver se foram aprovados ou rejeitados. | ✅ |
| US-12 | Como **arquiteto**, quero publicar peças do projeto (plantas, renders, modelos) com controlo de versões. | ✅ |
| US-13 | Como **cliente/arquiteto**, quero conversar em tempo real dentro de cada projeto. | ✅ |
| US-14 | Como **dono do escritório**, quero convidar outros arquitetos para a minha equipa. | ✅ |

## Sprint 1.5 — Identidade visual ✅

| ID | História | Estado |
|----|----------|--------|
| US-28 | Como **utilizador**, quero uma interface que transmita a elegância da arquitetura, com tipografia editorial e tokens semânticos. | ✅ |
| US-29 | Como **utilizador**, quero modo escuro (claro/escuro/sistema), guardado entre sessões e sem cintilação ao carregar. | ✅ |
| US-25b | Como **utilizador**, quero contraste conforme (texto ≥4,5:1, contornos ≥3:1) e foco visível nos dois modos. | ✅ |

Ver [design-system.md](design-system.md).

## Sprint 2 — Visualizador

| ID | História | Estado |
|----|----------|--------|
| US-15 | Como **cliente**, quero ver plantas em PDF no browser, com zoom e mudança de página. | ⬜ |
| US-16 | Como **cliente**, quero ver renders e imagens em galeria. | ⬜ |
| US-17 | Como **cliente**, quero navegar no modelo 3D (IFC exportado do Revit): rodar, cortar e ver pisos. | ⬜ |
| US-18 | Como **cliente**, quero clicar num elemento do modelo e ver as suas propriedades (material, área). | ⬜ |
| US-19 | Como **arquiteto**, quero comparar duas versões de um desenho. | ⬜ |

**Decisão técnica (Revit):** o formato nativo `.rvt` é proprietário e só pode ser visto na web
através do Autodesk Platform Services, que é pago por conversão. O Revit exporta **IFC** de forma
nativa (*File → Export → IFC*), e o IFC é visto no browser com a biblioteca open-source
**That Open Engine** (`@thatopen/components`, `web-ifc`), sem custo. Adotamos **IFC** e deixamos o APS
como opção futura num plano premium.

## Sprint 3 — Notificações e comentários no desenho

| ID | História | Estado |
|----|----------|--------|
| US-20 | Receber e-mail quando há novo documento, pedido ou mensagem. | ⬜ |
| US-21 | Ver um contador de mensagens e novidades por ler. | ⬜ |
| US-22 | Marcar pontos numa planta ou no modelo e comentar ("pins"). | ⬜ |
| US-23 | Aprovar formalmente uma fase (registo de aceitação do cliente). | ⬜ |

## Sprint 4 — SaaS

| ID | História | Estado |
|----|----------|--------|
| US-24 | Escolher um plano (Starter / Pro / Escritório) e pagar (Stripe; Multicaixa e PIX a estudar). | ⬜ |
| US-25 | Personalizar o portal com o logótipo e as cores do escritório. | ⬜ |
| US-26 | Aplicar limites por plano (projetos ativos, armazenamento, utilizadores). | ⬜ |
| US-27 | Adaptar a terminologia e o formato de datas e moeda ao país (PT/AO/BR). | ⬜ |

---

## Registo de sprints

### Sprint 1 (início 16/09/2026)
- Pesquisa das fases por país: ver [fases-projeto.md](fases-projeto.md).
- Arquitetura: Next.js 16 (App Router) + Supabase (Postgres, Auth, Storage, Realtime) com RLS multi-tenant.
- Entregue: US-01 a US-14.
- Verificação:
  - `supabase/tests/rls_test.sql` passa (isolamento entre escritórios, restrições do cliente, versões, progresso).
  - Testes manuais no browser como arquiteta e como cliente: painel, fases, cronograma, prazos,
    envio e aprovação de documentos, conversa, convite por e-mail até à definição da palavra-passe.
- Dívida técnica / próximos passos:
  - A tecla Enter no chat foi validada só com um evento sintético.
  - Faltam notificações por e-mail para mensagens e documentos (US-20).
  - Faltam testes E2E automatizados (Playwright).
  - A terminologia PT-BR ainda não está adaptada na interface (US-27).

### Sprint 1.5 (17/09/2026)
- Redesenho completo da interface: direção editorial/arquitetónica, tokens semânticos, tipografia
  Instrument Serif + Inter + JetBrains Mono, modo escuro com seletor de três estados.
- Contrastes medidos no browser nos dois modos; token `control` criado para cumprir o critério
  WCAG 1.4.11 nos contornos de campos.
