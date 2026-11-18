---
name: ship-workitem
description: "Close a Jira work item after its PR is merged: apply the change's delta specs to docs/specs, archive the change, update C4/GLOSSARY/ADRs/DESIGN.md when needed (docs PR), remove the work item's sibling worktrees and branches, and move the card QA → Concluído. Usage: ship-workitem <KEY>. Run when the developer asks for it or when wayfind-workitem routes here."
---

# Ship a work item

Input: a Jira card key. Run it from the original checkout, not from the work item's worktree. Repo files are in English; the card comment and any tech-debt Habilitador cards are in pt-BR with the project label (`jira.md` › Language).

Read these first:

- [../../references/jira.md](../../references/jira.md)
- [../../references/git.md](../../references/git.md)
- [../../references/openspec-format.md](../../references/openspec-format.md)
- [../ponytail/references/debt.md](../ponytail/references/debt.md)

## 1. Confirm the merge

1. `git fetch origin`. Find the PR: `gh pr list --search "<KEY> in:title" --state all --json number,state,baseRefName,headRefName,headRefOid,mergedAt,url`.
2. Continue only when a PR is `MERGED` into `<base>`, meaning `develop`, `main`, or `master` on `origin`, or the default branch from `origin/HEAD`. If the PR is open, closed without merge, or merged elsewhere, stop and report it.
3. Also continue only when the card is in **QA**. If it is anywhere else, report where it is and ask.

## 2. Archive the spec

On a fresh branch `docs/<KEY>-archive` from `origin/<base>`:

1. For each delta in `docs/specs/changes/<KEY>-<slug>/specs/`, apply it to `docs/specs/<capability>/spec.md`. Follow the archive rules in `openspec-format.md`, in the order RENAMED, REMOVED, MODIFIED, ADDED. A header that does not match stops the process. Report the mismatch.
2. `git mv docs/specs/changes/<KEY>-<slug> docs/specs/changes/archive/<YYYY-MM-DD>-<KEY>-<slug>`, using the merge date.
3. Check whether the merged change made any of these docs stale. Update them only where it did:
   - **C4** (`docs/architecture/c4/`): a new container, external system, or relationship.
   - **ADRs**: a decision taken during implementation that was not recorded. Write a new ADR, or supersede the old one.
   - **GLOSSARY.md** and **DESIGN.md**: terms, tokens, or components introduced by the code but not recorded.
   - **AGENTS.md** and the standards: a new command, convention, or module with its own `AGENTS.md`.
4. Commit `docs(specs): archive <KEY> and update living docs`, push, and open a PR into `<base>` titled `<KEY>: archive spec`. Show the diff first. A small docs PR like this one may be merged by the developer right away.

If the team prefers archiving inside the feature PR, the archive was already done there. Detect that (the change folder is already under `archive/`) and skip to step 2.3.

## 3. Debt and follow-ups

Nothing the change deferred should get lost when its worktree goes away.

1. **Shortcut ledger.** Run the "only what a merged PR introduced" scan from `debt.md` on the merged diff. List each new `shortcut` marker, and tag the ones with no upgrade trigger as `no-trigger`.
2. **Review follow-ups.** Collect the **Follow-ups** (deepening opportunities) and the minor findings left from the final review report (`.workitem-evidence/<KEY>/review-*.md`, or the PR body when the evidence folder is gone).
3. Show both lists. For the items the developer picks, create **Habilitador** cards with `create-workitem habilitador` (title "Dívida técnica: …", only the project label, the same parent Epic, a "relates to" link to this card). Skip the step when both lists are empty.

## 4. Clean the worktrees

For the original repo at `<parent>/<name>`, the candidates are the sibling directories `<parent>/<name>--<KEY>-*`, including slice worktrees ending in `--s<N>`.

Remove a candidate only when all of these hold:

- It is a worktree of this repo (`git worktree list --porcelain`).
- Its branch's PR is `MERGED` into a qualifying base, and no PR for that head is open. Slice branches qualify when their commits are contained in the merged branch: `git merge-base --is-ancestor <slice-tip> origin/<base>`, or a squash merge of the parent PR.
- `git -C <wt> status --porcelain` is empty. Untracked `.workitem-evidence/` is ignored through `info/exclude`.
- The tip equals the PR's `headRefOid` (for a slice, it is contained in it).
- This session's cwd is not inside it.

Then run, in order:

1. `git worktree remove <path>` (no `--force`).
2. `git branch -d <branch>`. Use `-D` only for a squash merge where the tip equals `headRefOid`.
3. `git push origin --delete <branch>`. If the remote branch is already gone, that counts as done.

When a candidate is kept, report why.

Before removing, check that every file listed under `## Uploads` in the QA reports is attached to the card. Upload what is missing (after a yes); the local `.workitem-evidence/<KEY>/` folder goes away with the worktree.

## 5. Close the card

After showing the comment and getting a yes:

1. Check that every Subtask of the card is in **Concluído**. Close the ones whose slice is merged; for any other, stop and ask. Then transition **QA → Concluído**.
2. Comment on the card:

   ```markdown
   **[ship-workitem]** Entregue

   - PR: <url> (merge em <data>)
   - Spec arquivada: `docs/specs/changes/archive/<…>`
   - PR de docs: <url ou nenhum>
   - Atualizados: <C4 / ADR / GLOSSARY / DESIGN ou nada>
   - Atalhos: <n marcadores, n sem gatilho>
   - Habilitadores de dívida técnica: <links ou nenhum>
   ```

3. If the card has a parent Epic and every child is now Concluído, say so and suggest closing the Epic (and, for a wayfinder map, recording "Entregue em <data>" under its Destino).

## 6. Report

List the merged PR, the docs PR, the spec files changed, and each worktree with its branch and whether it was removed or kept (and why). End with the card status.
