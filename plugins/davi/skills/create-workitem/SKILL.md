---
name: create-workitem
description: "Create Jira work items in the Novo (backlog) status from a short request, a conversation, or a document: a Story, Bug, or Habilitador (type chosen by the Story-or-Habilitador rule) with a brief pt-BR description and the project label, split into vertical slices with blocking links when the request is large. Usage: create-workitem <story|bug|habilitador> [text or link]. Run when the developer asks for it or when wayfind-workitem routes here."
---

# Create a work item

Arguments: `<type>`, which is `story`, `bug`, or `habilitador`, followed by free text, a link (Drive doc, Confluence page, Sentry issue), or nothing, in which case you use the conversation. If the type is missing, infer it and confirm. Even when given, check it against the **Story or Habilitador?** and **Habilitador or Task?** rules in `jira.md` › Issue types: a request typed `habilitador` that changes what a user sees or can do is a Story, and one that ends in no PR (a console, an account, DNS) is not a work item at all: it is a refinement **Task** that blocks the work item it enables, created as in `jira.md` › Refinement tickets. Say so and confirm before creating. Optional: `--epic <KEY>` to create the cards as children of an Epic. `wayfind-workitem` passes it when a wayfinder map hands off to delivery, together with the map's decisions as input.

The card is **brief**. It states the need, not the solution. `refine-workitem` does the deep product work later. The card is written in **pt-BR** (`jira.md` › Language); talk to the developer in their language.

Read [../../references/jira.md](../../references/jira.md) first, especially **Issue types**, **Project label**, and **Language**. Resolve the project key and the project label as described there. With `--epic`, the label comes from the Epic.

## 1. Gather

- Use what the conversation already holds. When a link is given, read it in full: Drive and Confluence through their MCPs, Sentry when connected.
- Skim the repo only as far as it improves the wording: `GLOSSARY.md` for terms, `docs/specs/` and `docs/architecture/decisions/` for the touched area. Do not design the solution.
- Search Jira for duplicates: `searchJiraIssuesUsingJql` with `project = <KEY> AND labels = "<project label>" AND statusCategory != Done AND text ~ "<2–3 key terms>"` (search the terms in Portuguese and in English). Show any likely duplicate and ask before continuing.

## 2. Draft

Use the template for the type:

- story: [templates/story.md](templates/story.md)
- bug: [templates/bug.md](templates/bug.md)
- habilitador: [templates/habilitador.md](templates/habilitador.md)

- **Type:** Story when someone outside the dev team will notice the change; Habilitador when not (and it ends in a PR); Bug when the product breaks its spec. Write the reason in one line when you show the draft.
- **Title:** in pt-BR, at most ~70 characters, in the domain language, describing the outcome rather than the implementation. Write "Cliente baixa a fatura em PDF", not "Criar endpoint de PDF".
- Fill only what is known. Use `_A refinar_` for anything that needs product work. Do not invent acceptance criteria. A story gets at most 1–3 candidate criteria, marked as candidates.
- No file paths or code. They go stale, and they belong in the spec.
- Labels: only the **project label** (`jira.md` › Labels and links). Cards that come from a review follow-up or a `shortcut` marker are a Habilitador titled "Dívida técnica: …" with a "relates to" link to the card they came from.
- When the item clearly changes UI, say so in Contexto. `refine-workitem` turns it into a Protótipo that `design-workitem` resolves.
- When created from a wayfinder map, the refinement tickets (Decisão, Pesquisa, Protótipo, Task) the card rests on get a "blocks" link to it (step 3); name them in Contexto by title.

### Splitting a large request

Adapted from the tracer-bullet approach. Split only when the request clearly holds more than one deliverable:

- Each card is a **vertical slice**: a narrow but complete path through every layer the behavior needs, which can be demoed or verified on its own. Do not split into horizontal layer cards like "the API part" and "the UI part".
- **Prefactoring first:** if something must change first so the rest becomes easy ("make the change easy, then make the easy change"), it is its own card (usually a Habilitador) and goes first. For a wide mechanical refactor, slice it as expand → migrate in batches → contract.
- Each card lists what blocks it. A card with no blockers can start right away.
- Each card should land as one PR of about 400 changed lines or less, touching fewer than three separable areas. That is criterion 11 of [../wayfind-workitem/references/ready-lint.md](../wayfind-workitem/references/ready-lint.md). Split further when a slice is bigger.
- If the request is a big epic, propose an Epic with child cards.

Present the split as a numbered list: title (pt-BR), type (Story/Bug/Habilitador) with the one-line reason, blocked by, what it delivers. Ask whether the granularity is right, whether the blockers are real, and whether anything should be merged or split. Iterate until approved.

## 3. Create

1. Show the final title, type, labels (with the project label), and description for each card, and wait for a yes.
2. `createJiraIssue` in dependency order, blockers first, with the issue type, the project label, and `contentFormat: "markdown"` when supported.
3. Create the "is blocked by" links between cards, the "blocks" links from the refinement tickets the card rests on, and the parent/epic relation if any. Dependencies are always links, never only prose.
4. Cards are born in **Novo**. Do not transition them.
5. Comment on each card, in pt-BR: `**[create-workitem]** Card criado` with its source (conversa, link do documento, follow-up de review, ou mapa wayfinder) and its blockers.

## 4. Finish

Reply with the list of created cards (title and link). Next step for each card: `/davi:refine-workitem <KEY>`, or `/davi:wayfind-workitem next <EPIC>` when they belong to an Epic.
