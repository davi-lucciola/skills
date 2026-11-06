# Skills

Instalador das skills deste repositório. Cada skill entra depois, como uma pasta com `SKILL.md`.

Rode na raiz do repositório que deve receber as skills:

```bash
npx --yes github:davi-lucciola/skills
```

O comando pergunta o destino e o escopo.

- **Cursor** copia para `.cursor/skills` neste repositório, ou para `~/.cursor/skills` na home. Só o Cursor lê esse caminho.
- **Padrão universal** copia para `.agents/skills`, ou para `~/.agents/skills`. O Cursor também lê esse caminho.
- **Claude Code** copia para `.claude/skills`, ou para `~/.claude/skills`.
- **Codex** copia para `.agents/skills`, ou para `~/.agents/skills`. É a mesma pasta do padrão universal.
- **OpenCode** copia para `.agents/skills` neste repositório, ou para `~/.config/opencode/skills` na home.

Devin, Windsurf, Amp e Pi ainda não aparecem no menu.

Para pular as perguntas:

```bash
npx --yes github:davi-lucciola/skills --target cursor --yes
npx --yes github:davi-lucciola/skills --target agents --global --yes
npx --yes github:davi-lucciola/skills --target claude-code --yes
npx --yes github:davi-lucciola/skills --target codex --global --yes
npx --yes github:davi-lucciola/skills --target opencode --global --yes
```

`--yes` só confirma a substituição de uma skill que já existe. Sem `--global`, o destino é o repositório em que o comando rodou.

Para atualizar, rode o mesmo comando com `update`. Se a skill já existe, o comando pergunta e avisa que ela será substituída pela nova. `--yes` confirma essa substituição. O destino e o escopo continuam valendo. Uma skill que saiu deste pacote permanece no destino.

```bash
npx --yes github:davi-lucciola/skills update --target claude-code
npx --yes github:davi-lucciola/skills update --target codex --global
```

O instalador copia os arquivos. Não cria symlink: o cache do `npx` some, e um link quebraria no repositório de destino.

`npx skills@latest add davi-lucciola/skills` é outro programa, o CLI da Vercel. Ele não pergunta entre `.cursor/skills` e `.agents/skills`.
