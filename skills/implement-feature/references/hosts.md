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

## Launch

Pass the parent's model.

- Cursor: Task `model` `inherit`.
- Claude Code: omit `model` and `effort`.
- Codex: omit `model` and `reasoning_effort`. Keep `fork_turns: none`.

`fork_turns: none` starts a fresh thread. The prompt carries a path under `.feature-evidence/<slug>/` and the contract. A review prompt carries the contract and `git diff <base>...HEAD`. A resumed coder carries the findings. A child does not inherit this conversation. `inherit` is the model only.

## When that launch is refused

Read the live allowlist the host exposed in this session. Launch once more with one slug copied from that list.

- Explorer: the entry the list marks as faster or smaller, when the list shows that mark.
- Coder, reviewer, and tester: an entry of the parent's family, when the list shows that family, at the parent's capability.

The slug comes from the list. A second refusal ends the launch. Show the host error and the list.

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
