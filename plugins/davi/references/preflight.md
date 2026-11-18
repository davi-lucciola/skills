# Preflight

A checklist that runs before work that cannot stop to ask questions: the gate of `implement-workitem` (step 1) and the start of every QA round. Its point is to fail early, with a precise list, instead of halfway through a loop. Inspired by the pre-flight readiness phase of [EricTechPro/super-board](https://github.com/EricTechPro/super-board) (MIT).

Write the result into `.workitem-evidence/<KEY>/plan.md` under `## Preflight`, one line per item, `[x]` or `[ ]` plus the reason. Every `[ ]` stops the gate.

## Items

### Tools

- [ ] `git` and `gh` work, and `gh auth status` has access to the repo.
- [ ] The runtime the repo needs (Node, Python, Go, …) at the version in its manifest or `.tool-versions`.
- [ ] The project's dependencies are installed in the worktree (install them with the documented command if not).
- [ ] For items with UI: the Chrome DevTools MCP is connected (or Claude in Chrome as a fallback).
- [ ] The Atlassian MCP is connected.

### Commands

- [ ] The typecheck, lint, single-test, full-suite, and start commands are known (from `AGENTS.md`, the standards, or the README). Ask for any that are missing and offer to document them in `AGENTS.md`.
- [ ] The start command brings the app up and its health endpoint or first page answers. Stop it again after the check.

### Environment

Never read a dotenv file. The `guard-secrets` hook blocks it, and the values must not reach the transcript. Use the plugin's `scripts/env-check.py` (two levels above this skill's folder) from the worktree root:

```bash
python3 <plugin-root>/scripts/env-check.py
```

It reads the key names from `.env.example` and prints `KEY present | empty | missing` for the local dotenv file, never a value.

- [ ] Every key the change or the app needs is `present`.
- [ ] Test user credentials: their **location** is documented (`AGENTS.md`, the README, or a seed command). Record the location, never the value.
- [ ] The database (or other backing services) the app needs is reachable, through the project's documented command (for example `docker compose up -d`).
- [ ] Seed data is available through a documented seed or fixture command.

### Evidence

- [ ] Evidence can be attached to the card: the Atlassian MCP exposes `uploadAttachmentToJiraIssue` (`discover` "add attachment to jira issue") and `ffmpeg` is installed for video compression, or the developer accepts local-only evidence for this run.

## When an item fails

- If the agent can fix it inside the worktree (install dependencies, start a documented service), do it and mark the item.
- If it needs the developer, ask in the gate.
- If it needs someone else (a credential, access, an environment), block the card with [blocked.md](blocked.md), naming the owner, and stop.
