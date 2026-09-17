-- Modelos de fases de projeto de arquitetura por país.
-- Fontes e justificação em docs/fases-projeto.md.

insert into public.phase_templates (country, position, code, name, description, default_weeks) values
-- Portugal — Portaria n.º 701-H/2008 + RJUE (DL 555/99, alterado pelo DL 10/2024 "Simplex Urbanístico")
('PT', 1, 'PB',  'Programa Base',
 'Levantamento do existente, programa preliminar do cliente e programa base validado (áreas, custos, requisitos).', 2),
('PT', 2, 'EP',  'Estudo Prévio',
 'Conceção geral da solução: implantação, volumetria, plantas esquemáticas e estimativa de custo.', 4),
('PT', 3, 'AP',  'Anteprojeto / Projeto Base',
 'Desenvolvimento do estudo prévio aprovado: plantas, cortes e alçados à escala, memória descritiva e estimativa orçamental.', 4),
('PT', 4, 'LIC', 'Licenciamento Municipal',
 'Submissão do projeto de arquitetura à Câmara Municipal (licenciamento ou comunicação prévia) e acompanhamento do processo.', 12),
('PT', 5, 'ESP', 'Projetos de Especialidades',
 'Coordenação de estruturas, águas e esgotos, eletricidade, ITED, AVAC, térmica, acústica, gás e segurança contra incêndio.', 6),
('PT', 6, 'PE',  'Projeto de Execução',
 'Pormenorização construtiva, mapas de quantidades, caderno de encargos e peças para concurso/obra.', 6),
('PT', 7, 'AT',  'Assistência Técnica à Obra',
 'Esclarecimento de dúvidas, visitas à obra, verificação da conformidade e telas finais.', 26),

-- Angola — tradição normativa luso-angolana + Decreto n.º 80/06 (licenciamento de obras de construção)
('AO', 1, 'PB',  'Programa Base',
 'Levantamento topográfico e do existente, programa do cliente e programa base validado.', 2),
('AO', 2, 'EP',  'Estudo Prévio',
 'Conceção geral da solução: implantação, volumetria, plantas esquemáticas e estimativa de custo.', 4),
('AO', 3, 'AP',  'Anteprojecto',
 'Desenvolvimento do estudo prévio aprovado, com peças desenhadas à escala e memória descritiva.', 4),
('AO', 4, 'LIC', 'Licenciamento',
 'Submissão do projecto à Administração Municipal / Governo Provincial e obtenção da licença de construção.', 12),
('AO', 5, 'ESP', 'Projectos de Especialidades',
 'Coordenação de estruturas, águas e esgotos, electricidade, telecomunicações, AVAC e segurança contra incêndio.', 6),
('AO', 6, 'PE',  'Projecto de Execução',
 'Pormenorização construtiva, medições, orçamento e caderno de encargos.', 6),
('AO', 7, 'AT',  'Assistência Técnica à Obra',
 'Acompanhamento da obra, esclarecimentos e verificação da conformidade com o projecto.', 26),

-- Brasil — ABNT NBR 16636-2:2017 + aprovação na Prefeitura
('BR', 1, 'LV',  'Levantamento de Dados',
 'Levantamento de informações preliminares: terreno, legislação urbanística, topografia e condicionantes.', 2),
('BR', 2, 'PN',  'Programa de Necessidades',
 'Definição dos ambientes, áreas, requisitos e expectativas do cliente.', 1),
('BR', 3, 'EV',  'Estudo de Viabilidade',
 'Análise da viabilidade legal, técnica e econômica do empreendimento.', 2),
('BR', 4, 'EP',  'Estudo Preliminar',
 'Concepção inicial da solução arquitetônica: partido, implantação e volumetria.', 4),
('BR', 5, 'AP',  'Anteprojeto',
 'Solução definida com plantas, cortes e fachadas em escala, compatível com projetos complementares.', 4),
('BR', 6, 'PL',  'Projeto Legal',
 'Projeto para aprovação na Prefeitura e demais órgãos (alvará de construção), com RRT junto ao CAU.', 12),
('BR', 7, 'PE',  'Projeto Executivo',
 'Projeto para execução com detalhamentos, compatibilização dos complementares, especificações e quantitativos.', 8),
('BR', 8, 'ACO', 'Acompanhamento de Obra',
 'Assistência à execução da obra, visitas técnicas e as built.', 26);
