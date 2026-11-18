---
name: implement-workitem
description: "Implement a technically refined Jira work item end to end: run its tasks.md slice graph with TDD (parallel implementer subagents in worktrees when slices are independent), loop with a Sonnet code-review subagent until clean, open a draft PR, loop with a QA subagent that validates the spec end to end with recorded evidence, and leave the PR ready for human review. Moves Refinamento Técnico → Desenvolvendo ⇄ Code Review ⇄ QA. Usage: implement-workitem <KEY>. Run when the developer asks for it or when wayfind-workitem routes here."
---

# Implement a work item

Input: a Jira card key, such as `ABC-123`. The card must have a technical spec: `docs/specs/changes/<KEY>-<slug>/` on its branch, written by `spec-workitem`.

You are the **orchestrator**. Run this session at high effort or above. You own the plan, the Jira card, the branch, the loops, and the PR. Subagents get fresh contexts and talk to you through files, not through this chat.

Read these before step 1:

- [../../references/jira.md](../../references/jira.md)
- [../../references/git.md](../../references/git.md)
- [../../references/loop.md](../../references/loop.md)
- [../../references/openspec-format.md](../../references/openspec-format.md)
- [../../references/preflight.md](../../references/preflight.md)
- [../../references/blocked.md](../../references/blocked.md)

The card is the source of truth (see `jira.md`). This skill can be resumed by anyone, on any machine, from the card's status and its `[implement-workitem]` comments.

## Roles

| Role | Who | Model |
|---|---|---|
| Orchestrator | this session | inherited |
| Implementer | this session for a single ready slice, otherwise the `davi:workitem-implementer` agent, one per parallel slice | inherited |
| Reviewer | the `davi:workitem-reviewer` agent, following `review-workitem` | **always `sonnet`**, a different model from the implementer, on purpose |
| QA | the `davi:workitem-qa` agent, following `qa-workitem` | inherited |

Launch them with the Agent tool and `subagent_type` set to the agent name. Do not pass `model`: the agent files set it. If the plugin agents are unavailable, launch `general-purpose` instead. Tell it to invoke the matching skill first, and pass `model: "sonnet"` for the reviewer.

A subagent prompt carries only pointers and the task:

- the worktree path
- `.workitem-evidence/<KEY>/plan.md`
- the change path
- its slice or its findings
- the output path

Never paste this conversation into a subagent prompt.

## 1. Prepare

1. `getJiraIssue <KEY>`. **Status gate:**
   - **Refinamento Técnico:** a fresh start. The card's `## Especificação técnica` must link the change folder, and its Subtasks must exist (one per `tasks.md` group, keys in the group comments). If either is missing, stop and recommend `spec-workitem`.
   - **Desenvolvendo, Code Review, or QA:** a resume. Read the card's `[implement-workitem]` and `[qa-workitem]` comments to find the last completed round and the PR. Rebuild `plan.md` and `loop.md` from them if they are missing locally, then continue at the step the card shows.
   - **Anything else:** stop and name the skill for that status.

   Then find the worktree and branch created by `spec-workitem` (`git worktree list`). If there is none (another machine, for example), create the worktree from the remote branch, following `git.md`.
2. Read `proposal.md`, `design.md`, `tasks.md`, the delta specs, `AGENTS.md`, the standards, `GLOSSARY.md`, and `DESIGN.md` for UI work.
3. Write `.workitem-evidence/<KEY>/plan.md` in the worktree. Add `.workitem-evidence/` to `.git/info/exclude`. The plan holds:
   - The card summary and the CA ids.
   - The **slice graph** from `tasks.md`: groups, `depends`, `owns`, the Subtask key of each group, and the **frontier**, meaning the groups whose dependencies are all merged.
   - The agreed seams from `design.md`.
   - The commands to typecheck, lint, test one file, run the full suite, and start the app, taken from `AGENTS.md` and the README. Ask for any that are missing.
   - The **Preflight** result, following `preflight.md`. Every `[ ]` stops the gate. Fix what you can in the worktree. Block the card with `blocked.md` when an item needs someone else.
4. **Gate.** Show the plan and ask the developer to accept. Accepting also authorizes the whole run through the open PR:
   - Commits, pushes, and the draft PR.
   - Jira transitions among Desenvolvendo, Code Review, and QA, and the Subtask transitions.
   - Round comments on the card and on the Subtasks.
   - Evidence uploads to the card (`jira.md` › Evidence on the card).

   Nothing else in this skill asks again, except a stop condition from `loop.md`.
5. Assign the card to the developer, transition it to **Desenvolvendo**, and comment `**[implement-workitem]** Desenvolvimento iniciado` with the branch, the slice count, and the preflight summary, in pt-BR (`jira.md` › Language).

## 2. Implement the frontier

The slice graph drives the work. Repeat until every group is done.

- **One slice ready, or slices that share paths.** Implement it yourself in the worktree, following the same rules a subagent would. They are in [agents/workitem-implementer.md](../../agents/workitem-implementer.md), so read that file once.
- **Two or more ready slices with disjoint `owns`.** For each slice:
  1. Create the slice worktree `<...>--s<N>` on `<branch>--s<N>`, from the current tip of `<branch>`.
  2. Launch one `workitem-implementer` per slice, in the background and all in one message.
  3. When each one finishes, merge its branch into `<branch>` (`git merge --no-ff`). On a conflict, resolve it only if the resolution is mechanical. Otherwise resume that implementer by its id with the conflict.
  4. Run the typecheck and the slice's tests on `<branch>` after each merge.
  5. Recompute the frontier and launch the newly unblocked slices.

  Record each slice's agent id in `plan.md`, because review and QA fixes resume them.
- **Subtasks follow their slice.** When a slice starts, move its Subtask to **Desenvolvendo** and assign it to the developer. When the slice is merged into `<branch>` with its tests green, move it to **Concluído** and comment on it, in English: `**[implement-workitem]** Slice merged: <short sha>, <tests run>`. A Subtask reopened by a review or QA fix goes back to Desenvolvendo, then Concluído again.
- Each slice ends with its `tasks.md` boxes ticked and committed with `Refs: <KEY>`.
- If an implementer returns a **gap**, meaning the spec is missing something it needs, decide whether it is a spec fix. If it is, edit the change and tell the developer. If it is a product decision, stop and ask.

After the last slice, run the full suite, the typecheck, and the lint in the worktree. Fix any red before review. Remove the slice worktrees and branches once they are merged.

## 3. Review loop (Desenvolvendo ⇄ Code Review)

1. Transition to **Code Review**.
2. Launch the `workitem-reviewer`. Prompt it with:
   - the worktree path, the change path, and `<base>`
   - the scope: `git diff <base>...HEAD` on round 1, then `git diff <last-reviewed-sha>..HEAD` plus the previous findings on later rounds
   - the report path: `.workitem-evidence/<KEY>/review-<N>.md`

   Do not pass implementer reports, the PR body, or your own summary. The reviewer forms its own hypotheses from the card's ACs and the raw diff first.
3. Read the report. Findings are classified `blocker`, `major`, or `minor`.
   - **No blocker or major findings:** the review is clean. Continue to step 4.
   - **Blocker or major findings:** transition back to **Desenvolvendo**. The **same author** fixes them: you, or the implementer resumed by its id. Each fix is committed. Then go back to 3.1.
4. Follow `loop.md`: at most 5 rounds, stop if the same finding comes back twice, and record each round in `loop.md` and on the card. `minor` findings and **Follow-ups** (deepening opportunities) never reopen the loop. Collect them for the PR body.

## 4. Draft PR

Follow `pr-workitem` to open a **draft** PR from `<branch>` into `<base>`. It is titled `<KEY>: <title>` and is linked on the card.

## 5. QA loop (Code Review ⇄ QA ⇄ Desenvolvendo)

1. Transition to **QA**.
2. Launch the `workitem-qa`. Prompt it with:
   - the worktree path, the change path, and the card key
   - the app start command
   - the run type: `full` on round 1, then `recheck` with the failed cases on later rounds
   - the output folder: `.workitem-evidence/<KEY>/qa-<N>/`
3. Read `qa-<N>/report.md`. Upload the files under its `## Uploads` to the card (`jira.md` › Evidence on the card) and comment the round on the card, in pt-BR: `**[implement-workitem]** QA rodada <N>: <n ok> / <n bugs> / <n bloqueados>`, with the screenshots inline next to their cases and the names of the attached videos and logs.
   - **All cases pass:** continue to step 6.
   - **Blocked:** a case could not run (environment, data, tool). Re-run the preflight. Fix it if you can, otherwise block the card with `blocked.md`.
   - **Bugs:** transition back to **Desenvolvendo**. For each bug, the same author follows the bug rule of `davi:tdd`:
     1. writes a regression test that is red on the bug's reproduction
     2. fixes the bug
     3. confirms the test is green
     4. commits
   - Then run **one review round** on the fix diff, following step 3 (this does not consume a review round), and repeat 5.1 with a `recheck`.
4. Follow `loop.md`: at most 5 QA rounds, and stop if the same bug comes back twice.

## 6. Ready for human review

1. Run the full suite one last time.
2. Push, and update the PR body with the final evidence (`pr-workitem`). Mark the PR **ready for review** (`gh pr ready`).
3. Comment on the card:

   ```markdown
   **[implement-workitem]** Pronto para revisão humana

   - PR: <url>
   - Review: <n> rodadas
   - QA: <n> rodadas, <n> casos
   - Subtasks: <n>/<n> concluídas
   - Evidências: anexos `<KEY>-qa<N>-*` neste card
   ```

   The card stays in **QA**, awaiting human approval and merge.
4. End the reply with the PR URL. After the merge: `/davi:ship-workitem <KEY>`.

## When the flow stops

When a stop condition from `loop.md` hits:

- Leave the card where it is.
- Block it with the template in `blocked.md`: what is open, the evidence (attachment names), the owner, and what would unblock it.
- Keep the PR in draft.
- Tell the developer exactly what decision or action you need.

Never force a green by weakening a test, skipping a scenario, or editing the spec without saying so.
