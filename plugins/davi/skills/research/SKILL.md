---
name: research
description: "Answer a factual question against primary sources (official docs, source code, specs, first-party APIs, the project's own files) in a fresh-context subagent, citing the source of every claim, and record the result on the Jira card: a pt-BR summary comment plus the full cited write-up attached as Markdown. Used by wayfind-workitem for Pesquisa tickets; also use when the user asks to research or investigate a technical question before deciding."
---

# Research

You find facts that a decision waits on. You do not decide: you return facts with sources, and the decision goes to a `Decisão` ticket or to the humans.

Adapted from `research` in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT). See [NOTICE.md](NOTICE.md).

Input: a question, usually the `## Pergunta` of a **Pesquisa** ticket, plus the work item(s) it blocks, the map's Notas, and the decisions it builds on.

## 1. Run it fresh

Launch a `general-purpose` subagent in the background with a fresh context. Give it the question, the constraints from the map (stack, budget, region, language), and the output format below. Several Pesquisa tickets run in parallel, all launched in one message.

## 2. Investigate primary sources only

- Library and framework docs through **Context7** (`resolve-library-id`, then `query-docs`), never from memory.
- Official vendor docs, pricing pages, API references, status pages, changelogs.
- Source code: the project's own repos, and upstream repos when docs are silent.
- The project's own documents (Drive, Confluence, the repo's `docs/`).
- Follow each claim back to the party that owns it. A blog or a forum answer is a lead to a primary source, not a source.
- Note the date for anything that changes: prices, limits, quotas, versions.

## 3. Write the result

The subagent writes one Markdown file, in **English**, to `.workitem-evidence/<KEY>/<KEY>-research.md`:

```markdown
# <question>

## Answer
<one or two sentences>

## Findings
- <claim> — [source](<url>) (<date checked>)

## Options compared
<table when the question compares candidates: criteria as rows, with a source per cell>

## Open points
<what the sources could not settle, and who could>
```

## 4. Record it on the card

1. Attach the file to the ticket as described in [../../references/jira.md](../../references/jira.md) › Evidence on the card.
2. Post the resolution comment in **pt-BR** (format in [../wayfind-workitem/references/map.md](../wayfind-workitem/references/map.md)): the answer, the three to five findings that matter with their links, and the attachment name.

Show the comment before posting it. When called from `wayfind-workitem chart`, the subagents return their texts and the session posts them after one yes for the batch.

## Rules

- Every claim has a source. A claim without one is marked "not verified" or removed.
- Never send private project data (names, emails, internal URLs, secrets) to outside services in queries.
- Facts only. When the answer depends on a preference or a trade-off, list the options and hand the choice to a `Decisão` ticket.
