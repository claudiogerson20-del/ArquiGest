# ArquiGest — sistema de design

Direção: **editorial / arquitetónico**. Neutros de betão e marfim, uma cor de acento (terracota),
linhas finas, muito espaço em branco e tipografia serifada nos títulos. A leitura deve lembrar um
caderno de projeto, não um painel de administração genérico.

## Modos claro e escuro

Todas as cores são **tokens semânticos** definidos em [globals.css](../src/app/globals.css). Os
componentes nunca usam cores em bruto (`bg-white`, `text-red-700`), apenas tokens — por isso o modo
escuro não precisa de variantes `dark:`.

| Token | Uso | Claro | Escuro |
|-------|-----|-------|--------|
| `bg` | fundo da página | `#f4f2ee` | `#0e0e0f` |
| `surface` | cartões, barras, campos | `#fbfaf8` | `#17171a` |
| `elevated` | zonas destacadas dentro de cartões | `#eeebe4` | `#202024` |
| `ink` | texto principal | `#1a1917` | `#f3f1ed` |
| `muted` | texto secundário | `#6a6660` | `#a4a09a` |
| `faint` | metadados e etiquetas técnicas | `#6c675f` | `#918d87` |
| `line` / `line-strong` | separadores | `#e3e0d9` / `#cbc6ba` | `#2a2a2f` / `#3b3b42` |
| `control` | contorno de campos e botões secundários | `#8d887f` | `#6d6d74` |
| `accent` | acento, progresso, estado ativo | `#a04b22` | `#e4926a` |
| `invert` / `on-invert` | botão principal | preto / marfim | marfim / preto |
| `success` `warning` `danger` `info` (+ `-soft`) | estados | — | — |

**Escolha do tema:** botão de três estados (Claro · Escuro · Sistema) na barra lateral e na página
pública. A preferência fica em `localStorage` e é aplicada por um script inline antes da primeira
pintura, por isso não há cintilação. Sem escolha, segue o sistema operativo.

## Tipografia

| Papel | Fonte | Onde |
|-------|-------|------|
| Títulos | **Instrument Serif** | títulos de página, nomes de projeto, números das métricas |
| Interface | **Inter** | corpo, botões, formulários |
| Técnica | **JetBrains Mono** | etiquetas (`.label-tech`), datas, percentagens, referências |

A classe `.label-tech` (mono, maiúsculas, espaçamento largo) é a "anotação de desenho" do produto:
usa-se para rótulos como `ESCRITÓRIO`, `PROGRESSO` ou a referência do projeto.

## Componentes

Todos em [src/components/ui.tsx](../src/components/ui.tsx): `Button` (primary, secondary, ghost,
danger), `Input`, `Textarea`, `Select`, `Field`, `Badge`, `Card`, `CardHeader`, `EmptyState`,
`PageHeader`, `Progress` (linha fina, não barra gorda) e `Stat`.

## Acessibilidade verificada

- Texto ≥ 4,5:1 em ambos os modos, incluindo texto secundário e etiquetas técnicas.
- Contornos de campos e botões secundários ≥ 3:1 (WCAG 2.2, critério 1.4.11).
- Anel de foco visível (`:focus-visible`, 2px de acento) em todos os elementos interativos.
- Altura mínima de 44px nos campos e nos botões principais.
- `prefers-reduced-motion` desliga animações e transições.
- Estado ativo da navegação marcado com `aria-current` e não apenas por cor.

## Movimento

Transições de 200ms nas mudanças de estado, 500ms na barra de progresso, entrada `rise` (8px +
opacidade) apenas no conteúdo principal da página pública. Sem animações decorativas em listas de
dados.
