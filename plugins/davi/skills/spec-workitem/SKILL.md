---
name: spec-workitem
description: "Technical refinement of a refined Jira work item: explore the code and options without writing code, agree on test seams, then write an OpenSpec-style change under docs/specs/changes/<KEY>-<slug>/ (proposal, design, tasks as a slice graph, delta specs), plus ADRs when warranted, and create one English Jira Subtask per slice. Moves A Fazer → Refinamento Técnico. Usage: spec-workitem <KEY>. Run when the developer asks for it or when wayfind-workitem routes here."
---

# Spec a work item (technical refinement)

Input: a Jira card key, such as `ABC-123`. **It is required.** The card should already have product refinement: business rules and Given/When/Then criteria.

You are the developer's technical partner. The output is a change folder good enough for `implement-workitem` to run without asking anything, and one Jira Subtask per slice. The change folder and the Subtasks are in **English**; what you write on the card itself (the `## Especificação técnica` section and the comments) is in **pt-BR** (`jira.md` › Language).

Read these first:

- [../../references/jira.md](../../references/jira.md), especially **Jira is the source of truth**
- [../../references/openspec-format.md](../../references/openspec-format.md)
- [../../references/git.md](../../references/git.md)
- the `davi:ponytail` skill: the ladder you apply at level **ultra** in step 1
- the `davi:tdd` skill and its `seams.md`: how seams are chosen and agreed

## 0. Start

1. `getJiraIssue <KEY>`. **Status gate:** the card must be in **A Fazer**. If it is in Refinamento Técnico, resume: find the branch and any change folder already on it, and read the latest `[spec-workitem]` comments. Any other status: stop and name the skill for that status.
2. **Ready lint.** Run [../wayfind-workitem/references/ready-lint.md](../wayfind-workitem/references/ready-lint.md) on the card. If it fails, stop and recommend `refine-workitem` with the failing criteria. Don't refine the product here.
3. Transition **A Fazer → Refinamento Técnico** after a yes.
4. Resolve `<base>`. Create the worktree and branch now, following `git.md`: `<parent>/<name>--<KEY>-<slug>` on `feat|fix|chore/<KEY>-<slug>` from `origin/<base>`. The spec, any `GLOSSARY.md` / `DESIGN.md` changes from refinement, and the implementation all share this branch and one PR.
5. If the original checkout has uncommitted `GLOSSARY.md` / `DESIGN.md` changes that came from this card's refinement, copy them into the worktree and confirm with the developer.
6. Comment `**[spec-workitem]** Refinamento técnico iniciado` with the branch name, so the card shows where the work lives from now on.

## 1. Explore: think, don't code

This is a conversation. Do not write production code and do not create the change yet.

- Read the code paths that implement the touched behavior, the current specs of the capabilities involved, ADRs in the area, `docs/architecture/standards/`, and `DESIGN.md` for UI items.
- Use Context7 for the current docs of the libraries involved, not memory.
- **Ponytail, level ultra.** For each capability the change needs, climb the ladder: does it need to exist, is it already in the codebase (helpers, `DESIGN.md` §4 components, `GLOSSARY.md` concepts, the documented patterns), does the stdlib or platform do it, does an installed dependency do it, can it be one line. Only then design new code. Push back on any part of the card the need does not justify, as a question to the developer (who may take it to the PO). Never drop an acceptance criterion silently. Record the outcome for the **Reuse and non-goals** section of `design.md`.
- When the card spans several repos, launch one read-only `Explore` subagent per repo in parallel. Each one returns a cited note: files, business rules, seams, open gaps.
- Map the options for the parts that are not obvious. Use 2–3 genuinely different alternatives with trade-offs (owner and interface, blast radius, how to reverse it, how to verify it, and the deletion test from `tdd/seams.md`), give a recommendation, and explain why. Start the recommendation from the lowest ladder rung that holds. Draw it (ASCII or Mermaid) when that helps.
- **Seams.** Following `davi:tdd`, name where the behavior will be tested. Prefer existing seams, as high as possible, and as few as possible. One is ideal. For each seam, say what it catches and what it misses, and which system boundaries tests may fake. Confirm the seams with the developer. No test is written later at an unconfirmed seam.
- Look for prefactoring that would make the change easy.
- Surface technical blockers: migrations, backfills, feature flags, contracts with other teams.

Done when the developer agrees with the approach and the seams.

## 2. Propose: write the change

Create `docs/specs/changes/<KEY>-<slug>/` in the worktree, following `openspec-format.md`:

1. **`proposal.md`.** Why, What Changes (mark **BREAKING**), Capabilities (new and modified), and Impact. Link the card.
2. **Delta specs** in `specs/<capability>/spec.md`. Turn every acceptance criterion of the card into a Requirement with Scenarios. Keep the card's criterion ids in scenario names (`#### Scenario: CA2 — <name in English>`) so review and QA can trace them back to the pt-BR card. Use ADDED / MODIFIED / REMOVED / RENAMED against the current spec. MODIFIED copies the whole block.
3. **`design.md`.** Always. It holds at least **Reuse and non-goals** (the ladder's outcome: what is reused with its path, what the platform gives, what is deliberately not built, and every new dependency with why the lower rungs did not hold) and the **Test Seams** agreed in step 1. When there is a real decision, also record the decisions and their alternatives, the risks with their mitigations, the migration plan, and any open questions. The file paths, modules, interfaces, schema changes, and API contracts that the spec leaves out go here.
4. **`tasks.md`.** The slice graph that `implement-workitem` consumes:
   - Prefactoring comes first.
   - Each `##` group is a vertical slice that can be verified on its own and fits one fresh context window.
   - Each group carries `<!-- depends: … | owns: … -->`. Slices that can run in parallel must have disjoint `owns`.
   - Each task names its verification (the test or the command).
   - For a mechanical refactor with a wide blast radius, use expand → migrate batches → contract.
5. **ADRs.** For each decision that is hard to reverse, surprising without context, **and** a real trade-off, write `docs/architecture/decisions/NNN-ADR-<slug>.md` with the template in `project-harness/templates/ADR.md`, at the next free number. Link it from `design.md`. Include the candidates noted by `refine-workitem` and the ADR candidates in the wayfinder map's Decisions so far, when the card belongs to one.
6. If the change alters architecture, add the C4 update to `tasks.md` as an explicit task, so it is not forgotten.

Coherence check before showing it:

- Every acceptance criterion (CA) of the card has at least one scenario.
- Every scenario is covered by a task.
- Every task's group owns the paths it will touch.
- No two parallel groups share a path.
- `design.md` has Reuse and non-goals and Test Seams, and no task builds something listed there as not built.
- Each group is small enough to review: the whole change stays near one PR of about 400 changed lines. If it does not, the card should have been split. Say so before writing more.
- The headers match the current spec for MODIFIED and REMOVED.

## 3. Approve and record

1. Show the developer the change: the proposal plus a summary of the requirements and the task graph, drawn as a small dependency diagram. Iterate until the developer accepts it.
2. Commit in the worktree: `docs(specs): add <KEY> change proposal` (plus glossary, design, and ADR files), following `git.md`. Push the branch.
3. **Subtasks**, one per `##` group of `tasks.md`, after you show the list and get a yes:
   - `createJiraIssue` with issue type **Subtask**, parent `<KEY>`, the **project label** (no other label), in **English**, from [templates/subtask.md](templates/subtask.md). Title: `S<N>: <group title>`, at most ~70 characters.
   - Create them in `tasks.md` order, then wire "is blocked by" links that mirror each group's `depends`, in a second pass.
   - Write each key back into its group's comment in `tasks.md`: `<!-- depends: … | owns: … | jira: <SUBTASK-KEY> -->`, and amend the spec commit (or add `docs(specs): link <KEY> subtasks`). Push.
   - They are born in **Novo**. `implement-workitem` moves them.
   - On resume, match existing Subtasks by the `S<N>:` prefix and create only the missing ones. When `tasks.md` changes later (a slice split or merged), update the Subtasks the same way and say so on the card.
4. **Card**, after you show it and get a yes:
   - Fill `## Especificação técnica`, in pt-BR, with the branch, the change path on the branch (a GitHub link to `docs/specs/changes/<KEY>-<slug>/`), the seams, the Subtasks (title with link), the new dependencies (or none), and the ADRs.
   - Comment `**[spec-workitem]** Especificação técnica pronta` with the slice count and the Subtask links.
5. The card stays in **Refinamento Técnico** until `implement-workitem` starts.

Next step: `/davi:implement-workitem <KEY>`.
