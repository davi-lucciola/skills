---
name: wayfind-workitem
description: "Macro orchestrator of the Jira work item flow. chart: turn a big, foggy idea into a wayfinder map (a Jira Epic whose children are the work items that deliver it, Story, Bug, Habilitador, and the refinement tickets that block them: Decisão, Pesquisa, Protótipo, Task). next: advance an Epic or card by exactly one step: resolve one refinement ticket, or route a work item to the skill its status calls for. status: read-only map of where an Epic or card stands, what is blocked, and the next command. lint: Definition of Ready check on cards before refinement ends or the spec starts. Usage: wayfind-workitem chart <idea> | next <EPIC|KEY> | status [EPIC|KEY] | lint [EPIC|KEY|--project]."
argument-hint: "chart <idea> | next <EPIC|KEY> | status [EPIC|KEY] | lint [EPIC|KEY|--project]"
disable-model-invocation: true
---

# Wayfind: orchestrate the flow

You are the orchestrator of the whole flow, from a loose idea to delivered work items. You plan and route; the step skills do the work. Talk to the developer in their language. What you write on Jira follows `jira.md` › Language: **pt-BR** on the Epic, refinement tickets, and work items.

Adapted from `wayfinder` in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT), with the Jira flow of this plugin as the tracker. See [NOTICE.md](NOTICE.md).

Read these first:

- [../../references/jira.md](../../references/jira.md), especially **Jira is the source of truth**, **Issue types**, **Refinement tickets**, **Statuses and transitions** (two workflows), **Labels and links**, and **Language**. This skill is where that contract is enforced across cards.
- [references/map.md](references/map.md): the wayfinder map on Jira.
- [../../references/blocked.md](../../references/blocked.md): blocks and the sweep.

## Which path?

| You have | Path |
|---|---|
| A big, foggy idea, too big for one session, with decisions nobody has made yet | `chart <idea>`, then `next <EPIC>` until the way is clear |
| A clear idea for one or a few cards | `/davi:create-workitem story\|bug\|habilitador` directly |
| An Epic or a card already on Jira | `status <KEY>` to see where it stands, `next <KEY>` to advance it |
| Cards whose refinement may be weak | `lint <KEY\|EPIC\|--project>` |

If no verb is given, ask which one, showing this table.

## The model

- **Work items** (Story, Bug, Habilitador) deliver through a pull request and run the delivery workflow.
- **Refinement tickets** (Decisão, Pesquisa, Protótipo, Task) are the product refinement of those work items. Each one **blocks** at least one work item, never produces a PR, and runs the short workflow **Novo → A Fazer → Desenvolvendo → Concluído** (`jira.md` › Refinement tickets).
- A work item leaves Refinamento Produto only when every refinement ticket blocking it is in Concluído.

## Refinement ticket types

Each kind is its own Jira issue type, and each is resolved by its own skill. Decisão, Pesquisa, and Protótipo carry the label `wayfinder:task`; a Task does not. Never mark the kind with any other label.

| Kind | Jira issue type | Mode | Resolved with |
|---|---|---|---|
| grilling | **Decisão** | HITL | `davi:grilling` + `davi:domain-modeling` |
| research | **Pesquisa** | AFK | `davi:research` (background subagent) |
| prototype | **Protótipo** | HITL | `davi:prototype` (Claude Design for a direction, with `ui-design-direction` and `ui-ux-pro-max`); `davi:design-workitem` when it is the screens of one work item |
| manual | **Task** | AFK or HITL | Do it: Claude in Chrome for web consoles (provider sign-up, DNS, repo settings), `gh`/CLI for the rest; otherwise a precise checklist for the human. Never a PR: work that ends in a PR is a Habilitador |

Before creating any of them, check that the project has these types and Habilitador (`listJiraProjectIssueTypesMetadata`). If one is missing, stop and point to [../../references/jira-setup.md](../../references/jira-setup.md).

## Verb `chart <idea>`

Charting is one session's work. It resolves nothing.

1. **Name the destination.** Load `davi:grilling` and `davi:domain-modeling` and interview the developer (and the PO when present), reading `GLOSSARY.md`, the specs, and the ADRs first. Pin down what reaching the end looks like: usually "a set of work items, refined and ready for `spec-workitem`", sometimes a single decision or a migration plan. The destination fixes the scope.
2. **Name the project label.** Resolve it as in `jira.md` › Project label. For a new effort, propose `<company>-<product>` in kebab-case (for example `acme-site`) and confirm it. It goes on the Epic and on every card created under it.
3. **Cut the work items.** Sketch the destination as vertical work items (Story, Bug, Habilitador, by `jira.md` › Issue types), applying `ready-lint` criteria 11 (size) and 15 (type). They may be rough: refinement sharpens them. If there is no fog left (the way is already clear and small), you don't need a map: recommend `create-workitem` and stop.
4. **Map the frontier.** Grill again, **breadth-first**, per work item: what must be decided, found out, prototyped, or set up by hand before it can be refined? Classify every item with `jira.md` › Issue types and name the work item(s) it blocks. Show the result as a table (title in pt-BR, issue type, blocks which work item, why) and wait for a yes:
   - An open question whose answer needs a conversation → **Decisão**.
   - A fact to look up → **Pesquisa**.
   - "How should it look or behave?" → **Protótipo**.
   - Manual pre-work with no PR (an account, access, DNS, a repo, data) → **Task**.
   - Something already decided, where only the building is left → not a refinement ticket: it is part of a work item.

   A question that blocks no work item is either beyond the destination (Fora de escopo) or reveals a missing work item: add one.
5. **Create the map** as described in [references/map.md](references/map.md): an Epic with labels `wayfinder:map` and the project label, written in pt-BR, with Destino and Notas filled in, Decisões até agora empty, and the fog sketched under Ainda não especificado. Show it first and wait for a yes.
6. **Create the cards**, as children of the Epic, each with its issue type and the project label (plus `wayfinder:task` on Decisão, Pesquisa, Protótipo):
   1. the work items first, through `create-workitem --epic <EPIC>`, born in **Novo**;
   2. then the refinement tickets, born in **Novo**;
   3. then, in a **second pass** once every card has its key, the links: each refinement ticket **blocks** its work item(s), and refinement tickets block each other where one waits on another.

   Show each batch first and wait for a yes. Everything you can't phrase precisely yet stays in Ainda não especificado.
7. **Open the frontier.** Run the block sweep (`blocked.md` step 5): unblocked refinement tickets move to **A Fazer**.
8. **Fire the research.** For each **Pesquisa** in A Fazer, run `davi:research`: one background subagent per ticket, all in one message, each ticket moved to Desenvolvendo first. Each one returns its write-up and the resolution text. Post them (comment, attachment, Concluído) after showing them.
9. Stop. Report the map link, the work items, the frontier, and the next command: `/davi:wayfind-workitem next <EPIC>`.

## Verb `next <EPIC|KEY>`

Advance **exactly one step**, then stop and report. The only exception is research tickets, which may run in parallel. One step per session keeps every session's context small and leaves a clean trail on Jira.

1. Read the target. For an Epic, read the map (its description) and query its children (JQL in [references/map.md](references/map.md)). Don't read every child body; zoom into a ticket only when needed.
2. Run the **block sweep** from `blocked.md` on the children (it also moves unblocked refinement tickets from Novo to A Fazer).
3. Choose the step, in this order:
   1. **A refinement ticket in progress** (Desenvolvendo, assigned to this developer): finish resolving it.
   2. **A refinement ticket on the frontier** (A Fazer, unassigned): take the one the developer named; otherwise the first one blocking the work item highest in Jira rank. Resolve it (below).
   3. **No open refinement tickets, destination not reached, and fog left:** graduate the fog into work items and refinement tickets (chart steps 3, 4, and 6). Update the map's Destino with "Mapeado em <data>, itens de trabalho: <links>".
   4. **Work items under the Epic:** pick the first card on the delivery frontier: not Concluído, not flagged, every "is blocked by" card in Concluído, by Jira rank. Prefer a card already in progress (Desenvolvendo, Code Review, QA) over starting a new one.
   5. **A card key:** that card. A work item with open refinement tickets blocking it resolves those first (one per step); a refinement ticket key resolves that ticket.
4. For a work item, **route** it by status. Before routing, run the consistency checks from `status` and fix or report any mismatch. Then invoke the step skill with the Skill tool and the card key:

   | Card status | Gate before routing | Invoke |
   |---|---|---|
   | Novo | | `davi:refine-workitem` |
   | Refinamento Produto | | `davi:refine-workitem` (it creates and resolves the item's refinement tickets, runs `design-workitem` for UI work, and `ready-lint` before A Fazer) |
   | A Fazer | `ready-lint` passes | `davi:spec-workitem` |
   | Refinamento Técnico | the change folder is on the branch, linked on the card, and the Subtasks exist | `davi:implement-workitem` |
   | Desenvolvendo, Code Review, QA (no PR ready) | | `davi:implement-workitem` (it resumes from the card) |
   | QA, PR ready, not merged | | Report: waiting for human review and merge. Name the PR and its reviewers. |
   | QA, PR merged | | `davi:ship-workitem` |
   | Concluído | | Nothing. Move on to the next frontier card next time. |

5. After the step skill returns, re-read the card, check that its status moved (or that it carries a Block comment), and report: what happened, the card's status now, and the next command.

## Resolving a refinement ticket

`refine-workitem` and `design-workitem` follow this same procedure.

1. **Claim it first:** assign the ticket to the developer and move it **A Fazer → Desenvolvendo**, so parallel sessions skip it. A ticket still in Novo is blocked: resolve its blocker instead.
2. Read the kind from the **issue type**, never from the body. Read the work item(s) it blocks, and zoom into related or closed tickets as needed. Load whatever skills the map's Notas name.
3. Resolve it with the skill from [Refinement ticket types](#refinement-ticket-types):
   - **Decisão:** run `grilling` with `domain-modeling` on the ticket's Pergunta. Never answer on the human's behalf. Update `GLOSSARY.md` (or the map's Notas when there is no repo) as terms resolve.
   - **Pesquisa:** run `research`. Facts with sources; the write-up is attached to the ticket.
   - **Protótipo:** run `prototype` (or `design-workitem` for the screens of one work item). The humans pick a variant; the artifact or spike branch is linked and screenshots of the pick are attached.
   - **Task:** do the manual work when you can. Web consoles go through Claude in Chrome (load the `claude-in-chrome` skill first; never type passwords or payment details: hand those steps to the human). Otherwise hand over a precise checklist and wait. The resolution records what was done and the facts later tickets need (ids, URLs, where the credentials live, never their values).
4. **Record it:**
   - Post the resolution comment in pt-BR (`**[wayfind-workitem] Resolução**`, format in `map.md`).
   - Transition the ticket **Desenvolvendo → Concluído**.
   - Append one line to the map's **Decisões até agora**: `[<ticket title>](<link>): <one-line gist>`.
   - When the decision is hard to reverse, surprising without context, and a real trade-off, mark the line as an ADR candidate. `spec-workitem` will write the ADR.
   - Write what the answer means for each blocked work item into that card's Contexto or Regras de negócio candidates, as a short pt-BR line with the ticket link, so `refine-workitem` starts from it.
5. **Update the map:**
   - Run the block sweep: tickets this one unblocked move to A Fazer.
   - Create newly surfaced tickets (classify them as in chart step 4, create, then wire links to their work items).
   - Graduate the fog the answer made specifiable into tickets or work items, removing it from Ainda não especificado.
   - Close tickets the answer shows are beyond the destination (Any → Concluído), adding them to **Fora de escopo** with one line on why.
   - Update or close tickets the decision invalidated.

   Show the map edit and the new tickets together, then wait for a yes.

## Verb `status [EPIC|KEY]`

Read-only, except for the block sweep (which asks first). With no argument, use the project key and label from `AGENTS.md` and show the Epics with `wayfinder:map`, plus the cards in progress.

For an Epic, show:

- **Destino**, the project label, and the count of refinement tickets resolved.
- **Work items**, grouped by status, each by title with its key in the link and its type (Story, Bug, Habilitador), with the open refinement tickets that block it nested under it, each by title, issue type, status (Novo, A Fazer, Desenvolvendo), and HITL or AFK.
- **Frontier:** refinement tickets in A Fazer.
- **Blocked:** each flagged card with its reason, owner, and `blocked-by`.
- **Loops:** for cards in Desenvolvendo, Code Review, or QA, the last round from the card comments and the Subtasks done out of total.
- **Next command:** the exact command, usually `/davi:wayfind-workitem next <EPIC>`.

For a card, show its status, what is missing to leave it (the gate column above, and the refinement tickets blocking it), its links (branch, spec, PR, prototype), its attachments, its Subtasks, and the next command.

**Consistency checks.** Report each mismatch with a proposed fix. Apply it only after a yes.

| Mismatch | Proposed fix |
|---|---|
| A child of the Epic without the project label | Add the label |
| A label other than the project label, `wayfinder:map` (Epic), or `wayfinder:task` (Decisão, Pesquisa, Protótipo): `frontend`, `backend`, `tech-debt`, `blocked`, an old `wayfinder:grilling\|research\|prototype`, or `wayfinder:task` on a Task | Remove it; carry its meaning as `jira.md` › Labels and links says |
| A refinement ticket that blocks no Story, Bug, or Habilitador | Link it to the work item it refines, or close it as out of scope |
| A Task with a branch or a PR | Change it to Habilitador, with one line of why |
| A Habilitador with no code to change (only a console or a hand-over) | Change it to a Task that blocks the work item it enables |
| A work item whose type breaks the Story/Habilitador rule | Change the type, with one line of why |
| A refinement ticket in Novo with every blocker in Concluído | Move it to A Fazer (the sweep does it) |
| A refinement ticket in Desenvolvendo with no assignee | Assign it, or release it to Novo (the sweep returns it to A Fazer) |
| A work item in A Fazer or later with an open refinement ticket blocking it | Move it back to Refinamento Produto, or resolve the ticket |
| A root card written in English, or a Subtask in Portuguese | Offer the rewrite in the right language |
| Card in Refinamento Técnico or later, but no `## Especificação técnica` link | Find the change folder on the branch and link it |
| Card in Refinamento Técnico or later, but no Subtasks while `tasks.md` has groups | Run the Subtask step of `spec-workitem` |
| Card in Desenvolvendo, Code Review, or QA, but no branch with `<KEY>` | Ask whether work started elsewhere. Otherwise move it back to Refinamento Técnico |
| PR merged, card not in QA or Concluído | Move it to QA, then run `ship-workitem` |
| PR open with `<KEY>`, but the card not linked to it | Comment the PR link on the card |
| Card in QA with the PR still in draft and no running loop | Resume with `implement-workitem` |
| Card flagged, but every `blocked-by` is done | The sweep unblocks it |
| Refinement ticket closed, but missing from Decisões até agora | Append the line |

## Verb `lint [EPIC|KEY|--project]`

Check Definition of Ready with [references/ready-lint.md](references/ready-lint.md) on the work items in Novo, Refinamento Produto, and A Fazer: the Epic's children, one card, or the whole project (`--project`, JQL by project key and project label). Refinement tickets are checked only against criteria 15, 16, and 18.

1. Score every card silently: ready or flagged, with the criteria that fired.
2. Show the summary: the count of ready cards, and the flagged cards by title.
3. Walk the flagged cards **one at a time**. For each, show the failing criteria in plain words and a drafted fix (rewritten CAs in pt-BR, a split, a type change, links or labels to add or remove), then offer: `[a]pprove`, `[e]dit`, `[b]lock`, `[s]kip`.
   - **approve:** write the exact edit to the card and comment `**[wayfind-workitem] Ready lint**: <o que mudou>`.
   - **block:** block it with the `blocked.md` template, with the PO or the developer as owner.
   - **split:** hand off to `create-workitem` with the slices.
4. End with the count of ready, fixed, blocked, and skipped cards.

## Rules

- Refer to every card by its **title** wrapped in its link. A wall of bare keys is illegible.
- Never resolve more than one refinement ticket per session, except research.
- Never do a step skill's work inline. Invoke the step skill, so its gates and Jira trail apply.
- Every card you create has its issue type chosen by `jira.md` › Issue types, the project label, and pt-BR content. Every refinement ticket blocks a work item.
- Every Jira write shows the content first and waits for a yes, one batch at a time.
- Expect other sessions to edit the same Epic concurrently. Re-read before writing.
