# ArquiGest — sistema de design (v4, betão e luz quente)

Produto: **web app profissional (SaaS)** para escritórios de arquitetura.
Linguagem: **minimalista e contemporânea**, com a paleta de um interior de betão à vista:
**betão** (paredes e teto), **aço preto** (escada), **pedra escura**, **nogueira** (degraus),
**couro conhaque** (sofá), **luz de cobre** dos candeeiros e o **branco quente** das cortinas.
Os componentes seguem o estilo das apps modernas (cantos generosos, contornos subtis, vidro fosco,
chips de ícone, tipografia grotesca a negrito).

## Princípios

1. **A luz é a cor de ação.** No modo escuro o botão principal é a luz de cobre dos candeeiros;
   no claro é couro conhaque. O resto da interface é betão, aço e pedra.
2. **Calor com moderação.** Nogueira e couro aparecem só no que importa: ação principal, fase em
   curso, progresso e o cartão de destaque (`.feature-card`, gradiente de couro com brilho de cobre).
   Os estados usam verde, âmbar, vermelho e azul suaves, sempre com texto.
3. **Textura de betão.** O fundo tem um grão muito subtil (`.concrete`); a página pública tem luz
   ambiente quente (`.ambient`).
4. **Superfícies em camadas.** Fundo `bg` → cartões `surface` com contorno subtil → zonas
   `elevated` dentro dos cartões. As barras superiores usam vidro fosco (`bg-glass` + blur).
5. **Formas generosas.** Cartões 18–20px, botões e campos 12px, chips 10–12px, badges em pílula.
6. **Títulos em grotesca, dados em mono.** Space Grotesk a negrito para títulos, Inter para a
   interface, JetBrains Mono com `tabular-nums` para datas, percentagens e referências.

## Tokens de cor

Definidos em [globals.css](../src/app/globals.css). Os componentes usam só tokens, sem variantes
`dark:`.

| Token | Uso | Claro | Escuro |
|-------|-----|-------|--------|
| `bg` | fundo — betão | `#e9e7e3` | `#121211` |
| `surface` | cartões, barras — estuque / betão na penumbra | `#f6f5f2` | `#1b1a19` |
| `elevated` | zonas dentro de cartões, item ativo | `#e2e0db` | `#252422` |
| `ink` | texto — aço preto / branco das cortinas | `#1b1a18` | `#ede9e2` |
| `muted` / `faint` | texto secundário / metadados | `#5b5852` / `#66625b` | `#a9a399` / `#968f85` |
| `line` / `line-strong` | separadores | `#dcd9d3` / `#cbc7bf` | `#2e2c29` / `#3d3a36` |
| `control` | contorno de campos e botões secundários | `#827c73` | `#726c63` |
| `primary` | ação principal — couro / luz de cobre | `#6b3a25` | `#d8965a` |
| `accent` / `accent-soft` | "em curso" — nogueira / couro na sombra | `#7c4a2c` / `#ecdfd3` | `#d8965a` / `#3a2518` |
| `success` `warning` `danger` `info` (+ `-soft`) | estados | — | — |

## Componentes

Em [src/components/ui.tsx](../src/components/ui.tsx):

- **Button:** `primary` (couro/cobre com brilho suave), `secondary`, `ghost`, `accent`, `danger`;
  tamanhos `sm` 32px, `md` 40px, `lg` 48px.
- **Input / Select / Textarea:** 40px, cantos 12px, anel de foco neutro.
- **Card / CardHeader:** 18px, contorno subtil, cabeçalho sem linha (hierarquia pelo espaço).
- **Stat:** etiqueta, número grande em grotesca, ícone num chip.
- **IconChip:** ícone num quadrado arredondado (neutro, acento ou estado).
- **Badge:** pílula com ponto de cor e texto.
- **ProjectTabs:** controlo segmentado; o separador ativo usa a cor principal.

## Acessibilidade (medida no browser, nos dois modos)

- Texto principal ≥ 14:1; secundário ≥ 5,3:1; metadados ≥ 4,6:1.
- Botão principal: 8,7:1 (claro) e 7,4:1 (escuro). Acento sobre o seu fundo ≥ 5,5:1.
- Contornos de campos e botões secundários ≥ 3,2:1 (WCAG 2.2, critério 1.4.11).
- Estado ativo com `aria-current`; estados nunca só por cor; foco visível; movimento reduzido
  respeitado; sem scroll horizontal a 375px.
