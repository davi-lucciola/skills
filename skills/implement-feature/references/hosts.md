# Hosts and models

Read this before launching a subagent. `implement-feature` points here so the launch rule stays in one place.

## Parent

Run `implement-feature` on a high or xhigh effort. This file does not name a model id. The child runs on the parent's model and on the parent's effort.

The parent reads a single repo, writes the plan, codes a single contract, runs the suite, and opens the PR.

## Who launches

- **Explorer.** More than one repo. One `explore-feature` per repo, in parallel. A single repo stays with the parent.
- **Coder.** Two or more contracts with disjoint owned paths, or contracts in different repos. One contract stays with the parent. A fix resumes this same coder by its id.
- **Reviewer.** After the code is committed. One per repo, in parallel when the feature spans repos. The prompt is the contract and `git diff <base>...HEAD`.
- **Tester.** A Scenario in `plan.md` that the suite does not cover. The prompt points at those scenarios. The parent runs the suite.

## Which tool you have

The tool you will call is the host.

- **Cursor** has the Task tool.
- **Claude Code** has the Agent tool.
- **Codex** has `spawn_agent`.
- **Antigravity** has `invoke_subagent`.
- **Gemini CLI** has `generalist`.

## Launch

Pass the parent's model.

- Cursor: Task `model` `inherit`.
- Claude Code: omit `model` and `effort`.
- Codex: omit `model` and `reasoning_effort`. Keep `fork_turns: none`.
- Antigravity: `invoke_subagent` with `TypeName` `self`, `Model` `inherit`, and `Workspace` `inherit`. Omit a separate effort. The prompt names the worktree path.
- Gemini CLI: call `generalist`. Omit `model`, `temperature`, and `max_turns`. The prompt names the worktree path and carries the contract or the findings. The child does not launch another subagent.

`fork_turns: none` starts a fresh thread. The prompt carries a path under `.feature-evidence/<slug>/` and the contract. A review prompt carries the contract and `git diff <base>...HEAD`. A resumed coder carries the findings. A child does not inherit this conversation. `inherit` is the model only.

## When that launch is refused

On Cursor, Claude Code, and Codex, read the live allowlist the host exposed in this session. Launch once more with one slug copied from that list.

- Explorer: the entry the list marks as faster or smaller, when the list shows that mark.
- Coder, reviewer, and tester: an entry of the parent's family, when the list shows that family, at the parent's capability.

The slug comes from the list. A second refusal ends the launch. Show the host error and the list.

On Antigravity, `Model` is a tier: `inherit`, `flash`, or `pro`. There is no effort field and no slug allowlist. When the call is refused, launch once more with one tier copied from the error. A second refusal ends the launch.

On the Gemini CLI, the first call omits `model`. When that call is refused and the session lists model ids, launch once more with one id copied from that list. A second refusal ends the launch. Show the host error and the list.

## How to launch

Cursor:

```text
Task
  subagent_type: generalPurpose
  model: inherit
```

When the first launch is refused, `model` is the slug copied from the live allowlist.

Claude Code:

```text
Agent
```

Omit `model` and `effort` on the first launch. When that launch is refused, set `model` to the slug copied from the live allowlist.

Codex:

```text
spawn_agent
  fork_turns: none
```

Omit `model` and `reasoning_effort` on the first launch. When that launch is refused, set `model` to the slug copied from the live allowlist. Keep `fork_turns: none`.

Antigravity:

```text
invoke_subagent
  TypeName: self
  Model: inherit
  Workspace: inherit
```

The prompt names the worktree path. `Workspace` stays `inherit`. Do not pass `branch`: that opens a second worktree beside the one this flow creates. A fix calls `send_message` on that subagent's conversation id. When the first launch is refused, `Model` is one tier copied from the error: `inherit`, `flash`, or `pro`.

Gemini CLI:

```text
generalist
```

Omit `model`, `temperature`, and `max_turns` on the first launch. The prompt names the worktree path and carries the contract or the findings. A fix is a new `generalist` call, and that prompt carries the findings. The child does not launch another subagent. When the first launch is refused, set `model` to one id copied from the list the session shows.
