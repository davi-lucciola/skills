---
name: ask-davi
description: "Ask which feature skill or step fits. A map of the feature-implementation flow."
disable-model-invocation: true
---

# Ask Davi

You don't remember every skill, so ask.

Before stating what a skill does or recommending a step be skipped, read that skill's `SKILL.md`. The lines below are orientation.

The parent session runs at high or xhigh effort. Implementation runs in a sibling worktree, one per repo. The parent reads a single repo, writes the plan, codes a single contract, runs the suite, and opens the PR. Parallel work is the explorers of several repos, and the coders whose contracts do not share paths. The review is the look that did not write the code. The plan gate is the one stop. After the suite is clean, the root agent opens one PR per repo into `<base>` in that same turn, with the `pr` skill in this package. `<base>` is the first of `develop`, `main`, and `master` that exists on `origin`. The reply ends with the URL.

Branches and commits follow the repo's own convention, or Conventional Commits when it has none. That rule lives in `code-feature`.

## The flow

1. **Explore.** One repo: the parent reads it. Several repos: one `explore-feature` subagent per repo, in parallel. They return a cited note.
2. **Plan and approve.** The parent writes `plan.md`: behavior as Requirement and Scenario, then one contract per slice. An explicit acceptance is what opens the worktrees.
3. **Code.** One contract: the parent follows `code-feature` inside `<parent>/<name>--<slug>`. Disjoint paths, or different repos: one `code-feature` subagent per contract. The prompt is the path to `plan.md` and that contract.
4. **Code review.** One `review-feature` per repo. The prompt is the contract and `git diff <base>...HEAD`. Findings return to the same author. That fix is not reviewed again.
5. **Test.** The parent runs the suite. `validate-feature` proves a Scenario the suite does not cover. Bugs return to the same author. The same bug twice stops the flow.
6. **PR.** The parent opens one PR per changed repo into `<base>` (develop, then main, then master), following `pr`, in the same turn as a clean run. The reply ends with the URL.

## The skills

### `implement-feature`

The orchestrator. You type it. It holds the plan gate, creates the sibling worktrees, codes a single contract itself, and opens the PR. It launches `code-feature` when the contracts can run together.

### `explore-feature`

The read-only explorer. It cites files, docs, business rules, seams, and open gaps. The parent writes the plan. The orchestrator launches it when the feature spans repos.

### `code-feature`

One contract, one worktree, owned paths only. Tests go red, then green, at the named seams. The same skill fixes review findings and test bugs. The parent opens the PR.

### `review-feature`

Standards and Spec, in separate headings. Spec quotes a Requirement, a Scenario, or a contract line. It returns findings and leaves the tree alone.

### `validate-feature`

The scenarios the suite missed, on a running instance. A standalone run also maps the business cases and names one gap in the automated tests. API evidence is curl. Database evidence is the query and the rows. UI evidence is a screenshot from a browser MCP, preferring Chrome DevTools. An open bug names a command that goes red on that bug.

### `pr`

The pull request body in this package. The parent follows it in the same turn as a clean run. The base is `<base>`: develop, then main, then master, the first ref on `origin`. The evidence is `.feature-evidence/<slug>/`. The reply ends with the PR URL.

### `clean-worktrees`

The user invokes it after the pull request. It removes `<parent>/<name>--<slug>` only once the PR is merged into a qualifying base on `origin`: each of `develop`, `main`, and `master` that exists there, plus the default branch from `origin/HEAD` when that name is different. A missing local branch of one of those names is created from that remote ref. The slug is the suffix of that directory. A branch prefix such as `feat/` stays on the branch name.
