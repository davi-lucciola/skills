---
name: implement-feature
description: "Ship one feature through explore, an accepted plan, parallel coders, review, and a running-instance test, then open a PR to develop."
disable-model-invocation: true
---

# Implement a feature

You are the parent. Run this session at high or xhigh effort. The subagent models live in [references/hosts.md](references/hosts.md). Read that file before the first launch and pass its row for the tool you actually have.

A **contract** is one slice of the feature: one repo, or one seam whose files do not overlap another slice. Two contracts run together only when their owned paths do not overlap. Two repos means two coder subagents.

A **worktree** is where the feature is implemented. For a repo at `<parent>/<name>`, the worktree is the sibling `<parent>/<name>--<slug>`. Explore and plan only read the original checkout. Code, review, test, fixes, and the PR use the worktree.

Keep secrets out of notes, prompts, and the PR. Write `<REDACTED>` in their place.

## 1. Explore

Launch one read-only explorer per repo, in parallel. Each follows `explore-feature`. The prompt names the feature, the repo path, and the sections the note must return.

Done when every explorer has returned a note with the relevant files, the docs it found, the business rules already in the product, and the open gaps. Hold those notes. The original checkout stays unchanged.

## 2. Write the contracts

Fill business and technical gaps from the repos and the docs. Ask the user about a gap the repo and the docs leave open, and wait for the answer before the plan is final.

Write one contract per slice:

```text
repo:
owned paths:
interface other slices rely on:
seams and the tests at them:
out of scope:
```

The plan is `plan.md`. It holds the problem, the behavior, every contract, what is out of scope, and the acceptance cases the tester will prove.

Done when every slice has a contract, no two contracts share an owned path, and each seam names the test that locks it.

## 3. Accept the plan

Show the plan and stop. Creating a worktree, launching a coder, or editing a repo waits for an explicit acceptance.

## 4. Open the worktrees

After acceptance, create one sibling worktree per repo. `<base>` is `develop`. If `develop` does not exist, stop and say so.

```text
git -C <parent>/<name> worktree add <parent>/<name>--<slug> -b feat/<slug> <base>
```

If `feat/<slug>` is already checked out somewhere, stop and say where. Leave the original branch as it is.

Write `plan.md` and each exploration note into that worktree at `.feature-evidence/<slug>/`. Contracts in the same repo share that worktree. Contracts in different repos get different worktrees.

Done when each worktree exists on `feat/<slug>` and contains the plan and the notes.

## 5. Code

Launch the coders together. Each working directory is its worktree. Each follows `code-feature`. The prompt contains that contract in full, the interfaces of the neighboring contracts, and the exploration note for its repo.

Done when every contract is committed inside its owned paths, in the worktree.

## 6. Review

Launch `review-feature` after every coder has committed. One reviewer per repo when the coders were split by repo. The prompt contains the contract and the diff command. Reviewers return findings. They leave the tree as they found it.

When the report has findings, launch one coder per affected repo with those findings and the contract. The working directory is that repo's worktree. After that coder commits, start testing. The fix is not reviewed again.

Done when the review was clean, or the fix coder has committed.

## 7. Test

Launch one `validate-feature` tester for the whole feature. The working directory is the worktree, or the set of worktrees when the feature spans repos. The prompt contains the acceptance cases and `.feature-evidence/<slug>/`.

When the report has bugs, launch a coder with those bugs and the contract, then launch the tester again. A bug that is still open after two fix attempts stops the flow. Show the user the bug and the evidence.

Done when the validation report has no open bug.

## 8. Open the PR

Open one PR per repo that changed. The base is `develop`. Follow the installed `pr` skill. Pass the evidence directory `.feature-evidence/<slug>/`. Leave the PR template to that skill.

When `pr` is not installed, stop and tell the user to install Matt Pocock's skills.
