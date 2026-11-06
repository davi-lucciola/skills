[English](README.md) | **Português**

# Skills

Instalador das skills deste repositório. Cada skill é uma pasta com um `SKILL.md`. Requer Node.js 20 ou mais recente.

Rode o comando na raiz do repositório que deve receber as skills.

## Primeiros passos

Instale as skills do seu harness na seção abaixo e peça ao agente para usar `ask-davi`. Essa skill é o mapa deste pacote: ela diz qual skill ou passo cabe no que você quer fazer.

- `ask-davi` — mapa do fluxo. Use quando não souber qual skill ou passo cabe.
- `implement-feature` — entrega uma feature: exploração, plano aceito, coders em paralelo, review, teste numa instância rodando e pull request para `develop`.
- `explore-feature` — lê o repositório e devolve uma nota com arquivos, regras de negócio e lacunas.
- `code-feature` — implementa um contrato num worktree, ou corrige findings de review e bugs de teste.
- `review-feature` — revisa o diff contra o contrato em Standards e Spec, e deixa o código como está.
- `validate-feature` — valida uma feature que já está rodando: casos de negócio, curl, linhas do banco e screenshots.
- `clean-worktrees` — remove o worktree irmão depois que o pull request entra na branch de integração do repositório.

O passo do pull request segue a skill `pr` do Matt Pocock. Instale essa skill à parte. Este pacote não a inclui.

## Cursor

Copia para `.cursor/skills` neste repositório, ou para `~/.cursor/skills` na home. Só o Cursor lê esse caminho.

Neste repositório:

```bash
npx --yes github:davi-lucciola/skills --target cursor --yes
```

Na home, disponível em todos os projetos:

```bash
npx --yes github:davi-lucciola/skills --target cursor --global --yes
```

## Padrão universal (`.agents`)

Copia para `.agents/skills` neste repositório, ou para `~/.agents/skills` na home. O Cursor também lê esse caminho.

Neste repositório:

```bash
npx --yes github:davi-lucciola/skills --target agents --yes
```

Na home, disponível em todos os projetos:

```bash
npx --yes github:davi-lucciola/skills --target agents --global --yes
```

## Claude Code

Copia para `.claude/skills` neste repositório, ou para `~/.claude/skills` na home.

Neste repositório:

```bash
npx --yes github:davi-lucciola/skills --target claude-code --yes
```

Na home, disponível em todos os projetos:

```bash
npx --yes github:davi-lucciola/skills --target claude-code --global --yes
```

## Codex

O Codex usa a mesma pasta do padrão universal: `.agents/skills` neste repositório, ou `~/.agents/skills` na home. Instalar os dois destinos grava os mesmos arquivos duas vezes.

Neste repositório:

```bash
npx --yes github:davi-lucciola/skills --target codex --yes
```

Na home, disponível em todos os projetos:

```bash
npx --yes github:davi-lucciola/skills --target codex --global --yes
```

## OpenCode

Copia para `.agents/skills` neste repositório, ou para `~/.config/opencode/skills` na home.

Neste repositório:

```bash
npx --yes github:davi-lucciola/skills --target opencode --yes
```

Na home, disponível em todos os projetos:

```bash
npx --yes github:davi-lucciola/skills --target opencode --global --yes
```

Devin, Windsurf, Amp e Pi ainda não entram no menu do instalador.

## Atualizar

Rode o mesmo comando com `update` antes das flags. O destino e o escopo continuam os mesmos. Se a skill já existe, ela é substituída pela cópia nova. Uma skill que saiu deste pacote permanece no destino.

### Cursor

Neste repositório:

```bash
npx --yes github:davi-lucciola/skills update --target cursor --yes
```

Na home:

```bash
npx --yes github:davi-lucciola/skills update --target cursor --global --yes
```

### Padrão universal (`.agents`)

Neste repositório:

```bash
npx --yes github:davi-lucciola/skills update --target agents --yes
```

Na home:

```bash
npx --yes github:davi-lucciola/skills update --target agents --global --yes
```

### Claude Code

Neste repositório:

```bash
npx --yes github:davi-lucciola/skills update --target claude-code --yes
```

Na home:

```bash
npx --yes github:davi-lucciola/skills update --target claude-code --global --yes
```

### Codex

Neste repositório:

```bash
npx --yes github:davi-lucciola/skills update --target codex --yes
```

Na home:

```bash
npx --yes github:davi-lucciola/skills update --target codex --global --yes
```

### OpenCode

Neste repositório:

```bash
npx --yes github:davi-lucciola/skills update --target opencode --yes
```

Na home:

```bash
npx --yes github:davi-lucciola/skills update --target opencode --global --yes
```

## Notas

O instalador copia os arquivos. Ele não cria symlink: o cache do `npx` some, e um link quebraria no repositório de destino.

`npx skills@latest add davi-lucciola/skills` é outro programa, o CLI da Vercel. Ele não pergunta entre `.cursor/skills` e `.agents/skills`.
