---
name: ask-davi
description: "Ask which feature skill or step fits. A map of the feature-implementation flow."
disable-model-invocation: true
---

# Ask Davi

You don't remember every skill, so ask.

Before stating what a skill does or recommending a step be skipped, read that skill's `SKILL.md`. The lines below are orientation.

The parent session runs at high or xhigh effort. Implementation runs in a sibling worktree, one per repo. Parallel work is the explorers, and the coders whose contracts do not share paths. The plan gate is the one stop. After the tests are clean, the root agent opens one PR per repo into `develop` in that same turn, with the installed `pr` skill. The reply ends with the URL. This package does not ship `pr`. When it is missing, install Matt Pocock's skills.

## The flow

1. **Explore.** One `explore-feature` subagent per repo, in parallel. They read. They return a cited note.
2. **Plan and approve.** The parent writes a contract per slice and stops. An explicit acceptance is what opens the worktrees.
3. **Code.** One `code-feature` subagent per contract, in parallel, inside `<parent>/<name>--<slug>`.
4. **Code review.** `review-feature` reports Standards and Spec. Findings launch a coder. That fix is not reviewed again.
5. **Test.** One `validate-feature` tester for the whole feature, on a running instance. Bugs launch a coder, then the tester runs again. The same bug twice stops the flow.
6. **PR.** The parent opens one PR per changed repo into `develop`, following `pr`, in the same turn as a clean validation. The reply ends with the URL.

## The skills

### `implement-feature`

The orchestrator. You type it. It launches the others, holds the plan gate, creates the sibling worktrees, and opens the PR. It implements a contract only by launching `code-feature`.

### `explore-feature`

The read-only explorer. It cites files, docs, business rules, and open gaps. The parent writes the contracts.

### `code-feature`

One contract, one worktree, owned paths only. The same skill fixes review findings and test bugs when the parent launches it again with that list. The parent opens the PR.

### `review-feature`

Standards and Spec, in separate headings. It returns findings and leaves the tree alone.

### `validate-feature`

Business cases on a running instance, plus one case the automated tests miss. API evidence is curl. Database evidence is the query and the rows. UI evidence is a screenshot from a browser MCP, preferring Chrome DevTools. Bugs return to the parent.

### `pr`

Matt Pocock's skill, installed separately. The parent follows it in the same turn as a clean validation. The base is `develop`. The evidence is `.feature-evidence/<slug>/`. The reply ends with the PR URL.
