# Skills

Instalador das skills deste repositório. Este primeiro commit só traz o comando. Cada skill entra depois, como uma pasta com `SKILL.md`.

Rode na raiz do repositório que deve receber as skills:

```bash
npx --yes github:davi-lucciola/skills
```

O comando pergunta duas coisas.

- **Cursor** copia para `.cursor/skills` neste repositório, ou para `~/.cursor/skills` na home. Só o Cursor lê esse caminho.
- **Padrão universal** copia para `.agents/skills`, ou para `~/.agents/skills`. O Cursor também lê esse caminho. OpenCode, Devin, Windsurf, Amp e Pi ainda não aparecem no menu.

Para pular as perguntas:

```bash
npx --yes github:davi-lucciola/skills --target cursor --yes
npx --yes github:davi-lucciola/skills --target agents --global --yes
```

`--yes` só confirma a substituição de uma skill que já existe. Sem `--global`, o destino é o repositório em que o comando rodou.

O instalador copia os arquivos. Não cria symlink: o cache do `npx` some, e um link quebraria no repositório de destino.

`npx skills@latest add davi-lucciola/skills` é outro programa, o CLI da Vercel. Ele não pergunta entre `.cursor/skills` e `.agents/skills`.
