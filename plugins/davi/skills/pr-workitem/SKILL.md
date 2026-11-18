---
name: pr-workitem
description: "Open or update the pull request of a Jira work item: title '<KEY>: <title>', a body with the smallest visual of the change, before/after evidence from review and QA, traceability to acceptance criteria, and the merge danger (one-way or two-way door, blast radius); link it on the card. Used by implement-workitem; also runs standalone (pr-workitem <KEY>)."
---

# Pull request for a work item

The PR title and body are in English (`jira.md` › Language). Use the domain terms from `GLOSSARY.md`. Comments you leave on the card are in pt-BR.

## Inputs

You need the worktree on `<branch>`, `<base>`, the card key, and the evidence folder `.workitem-evidence/<KEY>/`. That folder holds `review-*.md`, `qa-*/report.md`, screenshots, videos, and `loop.md`.

Read [../../references/jira.md](../../references/jira.md) and [../../references/git.md](../../references/git.md).

## Create or update

- **Create:**
  1. `git push -u origin <branch>`.
  2. `gh pr create --base <base> --head <branch> --title "<KEY>: <card title>" --body-file <file>`.
  3. Add `--draft` when `implement-workitem` asks for a draft.
  4. If the repo has `.github/pull_request_template.md`, put its required sections in this body.
- **Update:** `gh pr edit <n> --body-file <file>` as the evidence grows. `gh pr ready <n>` happens only after QA is clean.
- **Card:** the PR must be reachable from the card (see "Jira is the source of truth" in `jira.md`). Add a comment with the PR link (`**[pr-workitem]** PR: <url>`, plus draft or ready), and a remote link when the Atlassian server supports it through `discover`. If the GitHub for Jira app is installed, the `<KEY>` in the title, branch, and commits also links them. Comment again when the PR leaves draft.

## Body template

```markdown
Jira: [<KEY>](https://<site>/browse/<KEY>) · Spec: [`docs/specs/changes/<KEY>-<slug>/`](<link on branch>)

## Summary

<smallest visual that makes the change clear>

## Acceptance criteria

| CA | Scenario / test | QA |
|---|---|---|
| AC1 — … | `path/to/test` "AC1 — …" | ✅ [video](<link>) |

## Evidence

- **Before:** <screenshot / output / failing test>
  **After:** <screenshot / output / passing test>

## Review and QA

- Code review: <n> rounds (Sonnet reviewer), final report clean on Spec, Standards, Security, Lean, and Design.
- Minor findings left: <list or none>
- Follow-ups (deepening opportunities, offered as "Dívida técnica" Habilitador cards at ship): <list or none>
- Shortcuts taken: <`shortcut(<KEY>)` markers in the diff, or none>
- QA: <n> rounds, <pass>/<total> cases, checklists: <web, api, …>

## Merge danger

**Door:** <one-way | two-way>

<optional: why>

**Size:** <changed lines, excluding lockfiles and generated files>

**Blast radius:** <one word>

<optional: what could break: consumers, data, layout, mobile, permissions>
```

## Summary: the smallest visual

Pick the one view that makes the key point and keep only what the reader needs:

- Pseudocode for logic.
- A call tree for runtime flow.
- A component tree (with state and module boundaries) for UI structure.
- A shallow file tree for a refactor.
- Mermaid `sequenceDiagram` or `flowchart` for interactions and data flow.
- A `diff` block of the tree, the call stack, or the state when the surrounding shape already exists.
- A whole code block only when most of it is new or the reader needs the target shape.

One visual is usually enough, two at most.

## Evidence

- UI changes: before and after screenshots. They are attached to the Jira card (`<KEY>-qa<N>-*.png`); in the PR, drag the same PNGs into the PR web UI when the developer prefers images inline, and otherwise link the card and name the attachments. Never commit evidence binaries to the repo. Name the screencast attachments.
- Behavior changes: the test that was red and is now green, named after its Scenario. Show the command and the output tail.
- API changes: the `curl` and the response before and after, from `qa-*/api/`.

## Merge danger

- **Two-way door:** cheap to roll back. A revert restores the previous state.
- **One-way door:** hard or impossible to reverse. Examples: destructive migrations, data backfills, public API contract changes, sent emails or notifications, deleted data. Say what makes it one-way and what the rollback plan is.
- **Blast radius:** one word, such as `local`, `module`, `service`, `consumers`, or `platform`. Follow it with the concrete risks.

## Size

Count the changed lines without lockfiles, generated files, and snapshots (`git diff --shortstat <base>...HEAD -- . ':!*lock*' …`). Above about 400, say in the Merge danger section why the change could not be split. `ready-lint` criterion 11 should have caught it.

Return the PR URL.
