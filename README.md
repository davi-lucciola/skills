**English** | [Português](README.pt-BR.md)

# Skills

Installer for the skills in this repository. Each skill is a folder with a `SKILL.md`. Requires Node.js 20 or newer.

Run the command from the root of the repository that should receive the skills.

## Getting started

Install the skills for your harness using the section below, then ask the agent to use `ask-davi`. That skill is the map of this package: it says which skill or step fits what you want to do.

- `ask-davi` — map of the flow. Use it when you are unsure which skill or step fits.
- `implement-feature` — ships one feature: explore, an accepted plan, parallel coders, review, a test on a running instance, and a pull request into `develop`.
- `explore-feature` — reads the repository and returns a note of files, business rules, and open gaps.
- `code-feature` — implements one contract inside a worktree, or fixes review findings and test bugs.
- `review-feature` — reviews the diff against the contract on Standards and Spec, and leaves the code unchanged.
- `validate-feature` — validates a feature that is already running: business cases, curl, database rows, and screenshots.

The pull request step follows Matt Pocock's `pr` skill. Install that skill separately. This package does not include it.

## Cursor

Copies to `.cursor/skills` in this repository, or to `~/.cursor/skills` in your home directory. Only Cursor reads this path.

This repository:

```bash
npx --yes github:davi-lucciola/skills --target cursor --yes
```

Home directory, available in every project:

```bash
npx --yes github:davi-lucciola/skills --target cursor --global --yes
```

## Universal (`.agents`)

Copies to `.agents/skills` in this repository, or to `~/.agents/skills` in your home directory. Cursor also reads this path.

This repository:

```bash
npx --yes github:davi-lucciola/skills --target agents --yes
```

Home directory, available in every project:

```bash
npx --yes github:davi-lucciola/skills --target agents --global --yes
```

## Claude Code

Copies to `.claude/skills` in this repository, or to `~/.claude/skills` in your home directory.

This repository:

```bash
npx --yes github:davi-lucciola/skills --target claude-code --yes
```

Home directory, available in every project:

```bash
npx --yes github:davi-lucciola/skills --target claude-code --global --yes
```

## Codex

Codex uses the same folder as the universal layout: `.agents/skills` in this repository, or `~/.agents/skills` in your home directory. Installing both targets writes the same files twice.

This repository:

```bash
npx --yes github:davi-lucciola/skills --target codex --yes
```

Home directory, available in every project:

```bash
npx --yes github:davi-lucciola/skills --target codex --global --yes
```

## OpenCode

Copies to `.agents/skills` in this repository, or to `~/.config/opencode/skills` in your home directory.

This repository:

```bash
npx --yes github:davi-lucciola/skills --target opencode --yes
```

Home directory, available in every project:

```bash
npx --yes github:davi-lucciola/skills --target opencode --global --yes
```

Devin, Windsurf, Amp, and Pi are not in the installer menu yet.

## Update

Run the same command with `update` before the flags. The target and the scope stay the same. If a skill already exists, it is replaced by the new copy. A skill that left this package stays in the destination.

### Cursor

This repository:

```bash
npx --yes github:davi-lucciola/skills update --target cursor --yes
```

Home directory:

```bash
npx --yes github:davi-lucciola/skills update --target cursor --global --yes
```

### Universal (`.agents`)

This repository:

```bash
npx --yes github:davi-lucciola/skills update --target agents --yes
```

Home directory:

```bash
npx --yes github:davi-lucciola/skills update --target agents --global --yes
```

### Claude Code

This repository:

```bash
npx --yes github:davi-lucciola/skills update --target claude-code --yes
```

Home directory:

```bash
npx --yes github:davi-lucciola/skills update --target claude-code --global --yes
```

### Codex

This repository:

```bash
npx --yes github:davi-lucciola/skills update --target codex --yes
```

Home directory:

```bash
npx --yes github:davi-lucciola/skills update --target codex --global --yes
```

### OpenCode

This repository:

```bash
npx --yes github:davi-lucciola/skills update --target opencode --yes
```

Home directory:

```bash
npx --yes github:davi-lucciola/skills update --target opencode --global --yes
```

## Notes

The installer copies the files. It does not create a symlink: the `npx` cache disappears, and a link would break in the destination repository.

`npx skills@latest add davi-lucciola/skills` is a different program, the Vercel CLI. It does not ask you to choose between `.cursor/skills` and `.agents/skills`.
