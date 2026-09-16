# Fases do projeto de arquitetura (PT · AO · BR)

O ArquiGest cria automaticamente as fases de cada projeto a partir do país do escritório
(tabela `phase_templates`, migração `20260916000002_phase_templates.sql`).
O arquiteto pode depois ajustar datas e estados de cada fase.

## Portugal

Base legal:
- **Portaria n.º 701-H/2008**, "Instruções para a Elaboração de Projetos de Obras". Define o faseamento
  Programa Base → Estudo Prévio → Anteprojeto (Projeto Base) → Projeto de Execução → Assistência Técnica.
  É obrigatória nas obras públicas e é a referência habitual nas obras particulares.
- **RJUE** (DL 555/99), alterado pelo **DL 10/2024 (Simplex Urbanístico)**. A Câmara Municipal aprecia
  o projeto de arquitetura. Os projetos de especialidades passam a ser entregues com termos de
  responsabilidade e já não são apreciados pela Câmara.

| # | Código | Fase | Entregáveis típicos |
|---|--------|------|---------------------|
| 1 | PB  | Programa Base | Levantamento, programa preliminar, áreas, orçamento-alvo |
| 2 | EP  | Estudo Prévio | Implantação, volumetria, plantas esquemáticas, estimativa |
| 3 | AP  | Anteprojeto / Projeto Base | Plantas, cortes e alçados à escala, memória descritiva |
| 4 | LIC | Licenciamento Municipal | Processo na Câmara (licenciamento ou comunicação prévia) |
| 5 | ESP | Projetos de Especialidades | Estruturas, águas, eletricidade, ITED, AVAC, térmica, acústica, gás, SCIE |
| 6 | PE  | Projeto de Execução | Pormenores, mapas de quantidades, caderno de encargos |
| 7 | AT  | Assistência Técnica à Obra | Visitas, esclarecimentos, telas finais |

## Angola

Base legal:
- **Decreto n.º 80/06, de 30 de outubro**, Regulamento de Licenciamento das Operações de Loteamento,
  Obras de Urbanização e Obras de Construção. O licenciamento é feito junto da Administração Municipal
  ou do Governo Provincial.
- O faseamento do projeto segue a tradição luso-angolana, igual ao português. A terminologia usa a
  grafia corrente em Angola (Anteprojecto, Projecto).

Fases: Programa Base → Estudo Prévio → Anteprojecto → Licenciamento → Projectos de Especialidades →
Projecto de Execução → Assistência Técnica à Obra.

## Brasil

Base normativa:
- **ABNT NBR 16636-1 e 16636-2 (2017)**, "Elaboração e desenvolvimento de serviços técnicos
  especializados de projetos arquitetônicos e urbanísticos". Divide o trabalho em:
  - **Atividades preparatórias:** levantamento, programa de necessidades e estudo de viabilidade.
  - **Elaboração e desenvolvimento:** estudo preliminar, anteprojeto, projeto legal, projeto básico
    (opcional) e projeto para execução.
- Aprovação na **Prefeitura** (alvará de construção) e **RRT** no CAU.

| # | Código | Fase |
|---|--------|------|
| 1 | LV  | Levantamento de Dados |
| 2 | PN  | Programa de Necessidades |
| 3 | EV  | Estudo de Viabilidade |
| 4 | EP  | Estudo Preliminar |
| 5 | AP  | Anteprojeto |
| 6 | PL  | Projeto Legal |
| 7 | PE  | Projeto Executivo |
| 8 | ACO | Acompanhamento de Obra |

O *Projeto Básico* da NBR 16636 é opcional e fica de fora do modelo padrão. Pode ser adicionado por projeto.

## Estados de cada fase

`pending` (por iniciar) → `in_progress` (em curso) → `awaiting_client` (aguarda aprovação do cliente)
→ `completed` (concluída). O progresso do projeto é a percentagem de fases concluídas.

## Fontes

- [Portaria n.º 701-H/2008 (ANACOM)](https://anacom.pt/render.jsp?contentId=962957)
- [Ordem dos Arquitectos — Alterações à Portaria 701-H/2008](https://ordemdosarquitectos.org/noticias/Portaria-701-H2008)
- [Ordem dos Arquitectos — Decreto-Lei n.º 10/2024](https://www.ordemdosarquitectos.org/noticias/noticia-decreto_lei_10_24)
- [Ordem dos Engenheiros — Simplex Urbanístico](https://www.ordemdosengenheiros.pt/pt/posicoes-oficiais/simplex-decreto-lei-n-10-2024-de-8-de-janeiro-reforma-e-simplificacao-dos-licenciamentos-no-ambito-do-urbanismo-ordenamento-do-territorio-e-industria/)
- [LEX.AO — Decreto n.º 80/06](https://lex.ao/docs/conselho-de-ministros/2006/decreto-n-o-80-06-de-30-de-outubro/)
- [ABNT NBR 16636-2:2017 (UESB)](https://www2.uesb.br/biblioteca/wp-content/uploads/2022/07/Norma-ABNT-Elabora%C3%A7%C3%A3o-e-desenv-servi%C3%A7os-t%C3%A9cnicos-especializados-projeto-arquitet%C3%B4nico-e-urban%C3%ADstico-Proj-Arquitet%C3%B4nico-Parte-2-NBR16636-2.pdf)
- [Sienge — O que é a NBR 16636](https://sienge.com.br/blog/nbr-16636/)
