# Hosts and models

Read this before launching a subagent. `implement-feature` points here so the model rows stay in one place.

## Parent

Run `implement-feature` on a high or xhigh effort. This file does not pin the parent's model id. Pass the subagent rows below as written.

## Which tool you have

The tool you will call is the host.

- **Cursor** has the Task tool.
- **Claude Code** has the Agent tool.
- **Codex** has `spawn_agent`.

## Explorer

- Cursor: Task `model` `composer-2.5`. Fast stays off. `composer-2.5-fast` is a different model.
- Codex: `model` `gpt-5.6-luna`, `reasoning_effort` `low`. That effort is the thinking level.
- Claude Code: Agent `model` `haiku`, `effort` `medium`. The Agent tool takes the alias `haiku`, not a full model id. Haiku 5.5 already thinks, and the Agent tool has no per-subagent thinking switch.

## Coder

- Cursor: Task `model` `grok-4.7-medium`.
- Codex: `model` `gpt-5.6-terra`, `reasoning_effort` `medium`.
- Claude Code: Agent `model` `sonnet`, `effort` `high`.

## Reviewer and tester

Same Cursor and Codex rows as the coder. On Claude Code both use Agent `model` `sonnet` and `effort` `medium`. The coder stays at high on Claude Code.

## When the slug is missing

Stop and show the live allowlist. Keep the row above. A fast slug does not stand in for the standard one. A higher effort does not stand in for medium.

On Cursor, when the inline Task `model` parameter rejects the slug, write a subagent file in the workspace that owns the Task tool and dispatch that type:

```markdown
---
name: feature-explorer
description: Read-only feature exploration on Composer 2.5 with fast off.
model: composer-2.5[fast=false]
---
```

Coder, reviewer, and tester use `model: grok-4.7[reasoning_effort=medium]` in the same kind of file, one file per role. The task prompt still comes from `implement-feature`.

On Codex, when `spawn_agent` rejects `gpt-5.6-luna`, stop and show the error. Sol and Terra do not stand in for Luna.

## How to launch

Cursor:

```text
Task
  subagent_type: generalPurpose
  model: <slug from the row>
```

Claude Code:

```text
Agent
  model: <alias from the row>
  effort: <effort from the row>
```

Codex:

```text
spawn_agent
  model: <id from the row>
  reasoning_effort: <effort from the row>
  fork_turns: none
```

`fork_turns: none` starts a fresh thread. The prompt carries the contract, the notes, and the findings. A child does not inherit this conversation.
