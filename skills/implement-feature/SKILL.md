---
name: implement-feature
description: "Ship one feature through an accepted plan, code in a sibling worktree, a diff review, and a pull request to the integration branch: develop, then main, then master."
disable-model-invocation: true
---

# Implement a feature

You are the parent. Run this session at high or xhigh effort. Launch a subagent for work that is actually parallel, or for a look that did not write the code. Launch each subagent on this agent's model. The launch rule is [references/hosts.md](references/hosts.md). Read that file before the first launch.

A child starts a new thread. It does not see this chat. The prompt carries a path under `.feature-evidence/<slug>/` and the contract. It leaves the exploration note out. `inherit` selects the model only.

A **contract** is one slice of the feature: one repo, or one seam whose files do not overlap another slice. Two contracts run together only when their owned paths do not overlap. Two repos means two coder subagents.

A **worktree** is where the feature is implemented. For a repo at `<parent>/<name>`, the worktree is the sibling `<parent>/<name>--<slug>`. Reading and planning use the original checkout. Code, review, tests, fixes, and the PR use the worktree.

The feature handoff is `.feature-evidence/<slug>/plan.md` in the worktree. Do not install or call a memory tool.

Keep secrets out of notes, prompts, and the PR. Write `<REDACTED>` in their place.

## 1. Explore

One repository: read it yourself. Follow the reading rules in `explore-feature`. Hold the note in this chat.

More than one repository: launch one read-only `explore-feature` per repo, in parallel. The prompt names the feature, the repo path, and the sections the note must return.

Done when you can name the relevant files, the business rules already in the product, and the open gaps. The original checkout stays unchanged.

## 2. Write the plan

Fill business and technical gaps from the repos and the docs. Ask the user about a gap the repo and the docs leave open, and wait for the answer before the plan is final.

Write `plan.md` with two halves. Behavior states observable outcomes. The contract states where the slice lives. A path, a class, or a library choice belongs in the contract.

```text
# <slug>

## Why

## Behavior

### ADDED Requirements

### Requirement: <name>
The system SHALL <observable behavior>.

#### Scenario: <name>
- WHEN <condition>
- THEN <observable result>

### MODIFIED Requirements

### REMOVED Requirements

## Contracts

repo:
owned paths:
interface other slices rely on:
seams and the tests at them:
out of scope:
```

`SHALL` and `MUST` are absolute. `SHOULD` allows an exception. `MAY` is optional. Each scenario is something a test can prove. One requirement has at least one scenario. Leave an empty heading in place when that kind of change is absent.

A requirement the product already has goes under MODIFIED or REMOVED. A new one goes under ADDED.

Write one contract per slice. No two contracts share an owned path. Each seam names the test that locks it.

Done when every slice has a contract, every requirement has a scenario, and no two contracts share an owned path.

## 3. Accept the plan

Show the plan and stop. Creating a worktree, writing code, or editing a repo waits for an explicit acceptance.

Acceptance runs the rest of this skill through the open PR. That acceptance is the request to commit, push, and open the PR. The parent does not ask again. A task list that stops at validation leaves this skill unfinished.

## 4. Open the worktrees

After acceptance, fetch `origin` and resolve `<base>`. `<base>` is the first of `develop`, `main`, and `master` whose ref `refs/remotes/origin/<name>` exists. Create the worktree from `origin/<base>`. The pull request uses that same name. When none of the three refs exist, stop and say so. A branch that exists only locally is not `<base>`.

Name the branch the way `code-feature` names it. Read that section before `worktree add`. A feature slice in a repo with no convention of its own uses `feat/<slug>`.

```text
git -C <parent>/<name> fetch origin
git -C <parent>/<name> worktree add <parent>/<name>--<slug> -b <branch> origin/<base>
```

If `<branch>` is already checked out somewhere, stop and say where. Leave the original branch as it is.

Write `plan.md` into that worktree at `.feature-evidence/<slug>/plan.md`. When an explorer returned a note, write that note beside the plan. Contracts in the same repo share that worktree. Contracts in different repos get different worktrees.

Done when each worktree exists on `<branch>` and contains the plan.

## 5. Code

One contract: implement it yourself, in the worktree, following `code-feature`.

Two or more contracts whose owned paths do not overlap, or contracts in different repos: launch those `code-feature` coders together. Each working directory is its worktree. The prompt is the path `.feature-evidence/<slug>/plan.md` and that coder's contract.

Done when every contract is committed inside its owned paths, in the worktree.

## 6. Review

Launch `review-feature` after the code is committed. One reviewer per repo, in parallel when the feature spans repos. The prompt contains the contract and `git diff <base>...HEAD`. Reviewers return findings. They leave the tree as they found it.

When the report has findings, the same author fixes them. Resume that coder by its id. When you wrote the code, fix it yourself, still following `code-feature`. After that commit, start testing. The fix is not reviewed again.

Done when the review was clean, or the same author has committed the fix.

## 7. Test

Run the project's test suite in the worktree. When the feature spans repos, run each suite.

Launch `validate-feature` only for a Scenario in `plan.md` that the suite does not cover. The prompt points at those scenarios in `.feature-evidence/<slug>/plan.md`. Skip the launch when the suite already covers every scenario.

When the report has bugs, the same author fixes them, then run the failing check again. A bug that is still open after two fix attempts stops the flow. Show the user the bug and the evidence.

Done when the suite passes and every uncovered scenario is proven, or the flow has stopped on an open bug. A clean result opens the PR in the same turn.

## 8. Open the PR

Open one PR per repo that changed, in this turn. The base is `<base>` from step 4: develop, then main, then master. Follow the `pr` skill in this package. Pass the evidence directory `.feature-evidence/<slug>/`.

The reply ends with the PR URL.

Done when every changed repo has an open PR and the URL is in the reply.
