# Hosts and models

Read this before launching a subagent. `implement-feature` points here so the model rows stay in one place.

## Parent

Run `implement-feature` on a high or xhigh effort. This file does not pin the parent's model id. Pass the subagent rows below as written. When the named model is unavailable, follow [When the named model is unavailable](#when-the-named-model-is-unavailable).

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

- Cursor: Task `model` `grok-4.7-high`.
- Codex: `model` `gpt-5.6-terra`, `reasoning_effort` `medium`.
- Claude Code: Agent `model` `sonnet`, `effort` `high`.

## Reviewer and tester

Same Cursor and Codex rows as the coder. On Claude Code both use Agent `model` `sonnet` and `effort` `medium`. The coder stays at high on Claude Code.

## When the named model is unavailable

Launch with the row above.

When that model is absent from the live allowlist, the host rejects the slug, or the launch fails for any other reason, launch the subagent on the parent model. On Cursor, Task `model` is `inherit`. On Claude Code and Codex, omit the model override so the child uses the current agent's model.

`inherit` selects the parent model. The row stays the preferred model. A fast slug, another effort, Sol, and Terra are different models and stay off this launch.

## How to launch

Cursor:

```text
Task
  subagent_type: generalPurpose
  model: <slug from the row, or inherit>
```

Claude Code:

```text
Agent
  model: <alias from the row>
  effort: <effort from the row>
```

When the named model is unavailable, omit `model` and `effort`.

Codex:

```text
spawn_agent
  model: <id from the row>
  reasoning_effort: <effort from the row>
  fork_turns: none
```

When the named model is unavailable, omit `model` and `reasoning_effort`. Keep `fork_turns: none`.

`fork_turns: none` starts a fresh thread. The prompt carries the contract, the notes, and the findings. A child does not inherit this conversation. `inherit` is the model only.
