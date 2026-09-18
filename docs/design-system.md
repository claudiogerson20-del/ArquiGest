# ArquiGest — sistema de design (v3, contemporâneo)

Produto: **web app profissional (SaaS)** para escritórios de arquitetura.
Linguagem: **minimalista e contemporânea**. Monocromático — branco, betão e preto — com um único
toque de **carvalho** para o que está "em curso". A referência para os componentes foi o estilo de
apps modernas (cantos generosos, contornos subtis, camadas translúcidas, chips de ícone, tipografia
grotesca a negrito), com uma paleta sóbria de arquitetura em vez de cores de marca.

## Princípios

1. **O preto é a cor de ação.** O botão principal é preto no modo claro e branco no escuro.
   Não há uma "cor de marca" a competir com o conteúdo.
2. **Um só acento, com significado.** O carvalho marca apenas o que está em curso (fase atual,
   etiqueta "em curso"). Os estados usam verde, âmbar, vermelho e azul suaves, sempre com texto.
3. **Superfícies em camadas.** Fundo `bg` → cartões `surface` com contorno subtil → zonas
   `elevated` dentro dos cartões. As barras superiores usam vidro fosco (`bg-glass` + blur).
4. **Formas generosas.** Cartões 18–20px, botões e campos 12px, chips 10–12px, badges em pílula.
5. **Títulos em grotesca, dados em mono.** Space Grotesk a negrito para títulos, Inter para a
   interface, JetBrains Mono com `tabular-nums` para datas, percentagens e referências.

## Tokens de cor

Definidos em [globals.css](../src/app/globals.css). Os componentes usam só tokens, sem variantes
`dark:`.

| Token | Uso | Claro | Escuro |
|-------|-----|-------|--------|
| `bg` | fundo da aplicação | `#f5f5f3` | `#0a0a0a` |
| `surface` | cartões, barras | `#ffffff` | `#131313` |
| `elevated` | zonas dentro de cartões, item ativo | `#f0f0ee` | `#1b1b1b` |
| `glass` | barras com vidro fosco | branco 72% | `#131313` 72% |
| `ink` / `muted` / `faint` | texto principal / secundário / metadados | `#0f0f0f` / `#5d5d5a` / `#6b6b67` | `#f5f5f3` / `#a3a3a0` / `#93938f` |
| `line` / `line-strong` | separadores | `#e7e7e3` / `#d6d6d1` | `#232323` / `#333333` |
| `control` | contorno de campos e botões secundários | `#8a8a85` | `#6e6e6a` |
| `primary` / `on-primary` | ação principal | preto / branco | branco / preto |
| `accent` / `accent-soft` | carvalho — "em curso" | `#8a5a32` / `#f3ebe3` | `#d4a276` / `#2a1f15` |
| `success` `warning` `danger` `info` (+ `-soft`) | estados | — | — |

## Componentes

Em [src/components/ui.tsx](../src/components/ui.tsx):

- **Button:** `primary` (preto/branco com sombra suave), `secondary`, `ghost`, `accent`, `danger`;
  tamanhos `sm` 32px, `md` 40px, `lg` 48px.
- **Input / Select / Textarea:** 40px, cantos 12px, anel de foco neutro.
- **Card / CardHeader:** 18px, contorno subtil, cabeçalho sem linha (hierarquia pelo espaço).
- **Stat:** etiqueta, número grande em grotesca, ícone num chip.
- **IconChip:** ícone num quadrado arredondado (neutro, acento ou estado).
- **Badge:** pílula com ponto de cor e texto.
- **ProjectTabs:** controlo segmentado; o separador ativo fica preto.

## Acessibilidade (medida no browser, nos dois modos)

- Texto principal ≥ 17:1; secundário ≥ 5,8:1; metadados ≥ 4,7:1.
- Botão principal ≥ 17:1. Acento sobre o seu fundo ≥ 4,9:1.
- Contornos de campos e botões secundários ≥ 3,4:1 (WCAG 2.2, critério 1.4.11).
- Estado ativo com `aria-current`; estados nunca só por cor; foco visível; movimento reduzido
  respeitado; sem scroll horizontal a 375px.
