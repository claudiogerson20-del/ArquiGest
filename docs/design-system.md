# ArquiGest — sistema de design

Produto: **web app profissional (SaaS)** para escritórios de arquitetura.
Materiais da linguagem visual: **betão** (cinzas frios, estrutura, linhas) e **barro/madeira**
(o acento quente). Densidade de aplicação de trabalho, não de página de revista.

## Princípios

1. **Densidade primeiro.** Escala de espaçamento 4/8/12/16/24/32. Cartões com 16px de padding,
   linhas de lista com 40–44px, barra superior e lateral com 56px. O ecrã mostra informação,
   não ar.
2. **Cinza estrutura, quente destaca.** O acento aparece só onde há ação ou estado: botão
   principal, item ativo, fase em curso, progresso.
3. **Números em mono.** Datas, percentagens, contagens e referências em JetBrains Mono com
   `tabular-nums`, para as colunas não dançarem.
4. **Hierarquia por tamanho e espaço, não por cor.**

## Modos claro e escuro

Todas as cores são **tokens semânticos** em [globals.css](../src/app/globals.css); os componentes
não usam cores em bruto, por isso não há variantes `dark:` espalhadas pelo código.

| Token | Uso | Claro (betão) | Escuro (grafite) |
|-------|-----|---------------|------------------|
| `bg` | fundo da aplicação | `#eeeeec` | `#0b0c0d` |
| `surface` | painéis, barras, campos | `#fdfdfc` | `#131416` |
| `elevated` | zonas destacadas dentro de painéis | `#f2f2f0` | `#1b1d1f` |
| `sunken` | calhas de progresso, fundos recuados | `#e6e6e3` | `#0f1011` |
| `ink` | texto principal | `#16181a` | `#f0f0ee` |
| `muted` | texto secundário | `#61656a` | `#a0a4a9` |
| `faint` | metadados e etiquetas técnicas | `#62666b` | `#8e9297` |
| `line` / `line-strong` | separadores e contornos | `#e0e0dd` / `#c9c9c5` | `#26282b` / `#35383c` |
| `control` | contorno de campos e botões secundários | `#8b8d90` | `#6b6f74` |
| `accent` / `accent-hover` / `accent-soft` | ação, estado ativo, progresso | `#9a4a26` / `#833d1f` / `#f2e5de` | `#e08a5b` / `#eda077` / `#33200f` |
| `success` `warning` `danger` `info` (+ `-soft`) | estados | — | — |

**Seletor de tema:** Claro · Escuro · Sistema, na barra superior. A escolha fica em `localStorage`
e é aplicada por um script inline antes da primeira pintura (sem cintilação).

## Tipografia

| Papel | Fonte | Onde |
|-------|-------|------|
| Interface | **Plus Jakarta Sans** | tudo: títulos, corpo, botões, formulários |
| Técnica | **JetBrains Mono** | etiquetas `.label-tech`, datas, percentagens, códigos de fase |
| Editorial | **Instrument Serif** | reservada; não usada na aplicação |

Escala: 11px (mono/etiquetas) · 13px (interface densa) · 14px · 15px (títulos de cartão) ·
20px (título de página) · 36–54px (apenas na página pública).

## Estrutura da aplicação

- **Barra lateral (≥1024px):** logótipo, escritório, navegação, ação principal fixa no fundo.
- **Barra superior:** navegação em ecrãs pequenos, seletor de tema e menu de conta.
- **Conteúdo:** largura máxima de 1400px, gutters de 16/24px, grelha até 4 colunas de métricas
  e 3 de projetos.
- **Página de projeto:** migalhas, título com estado, bloco de métricas (início, entrega,
  progresso) e separadores compactos.

## Acessibilidade verificada (medida no browser, nos dois modos)

- Texto principal ≥ 15:1; secundário ≥ 5,2:1; etiquetas técnicas ≥ 4,7:1.
- Botão principal: 6,2:1 (claro) e 6,7:1 (escuro). Item de navegação ativo: ≥ 5:1.
- Contornos de campos e botões secundários ≥ 3:1 (WCAG 2.2, critério 1.4.11).
- Estado ativo assinalado com `aria-current`, não apenas por cor. Badges de estado têm ponto
  colorido **e** texto.
- Etiquetas de métricas quebram linha em vez de serem cortadas (375px verificado, sem scroll
  horizontal).
- Foco visível (2px de acento) e `prefers-reduced-motion` respeitado.

## Movimento

Transições de 150ms nos estados, 500ms na barra de progresso, entrada `rise` apenas no hero da
página pública. Sem animação decorativa em listas de dados.
