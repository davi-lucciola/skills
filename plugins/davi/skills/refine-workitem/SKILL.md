---
name: refine-workitem
description: "Product refinement of a Jira work item: read the card, the docs, and the code to surface bottlenecks, blockers, and business questions, interview the PO with grilling while sharpening the domain language with domain-modeling (GLOSSARY.md), and fill the card, in pt-BR, with business rules and Dado/Quando/Então acceptance criteria. Creates and resolves the refinement tickets (Decisão, Pesquisa, Protótipo, Task) that block the card. Moves Novo → Refinamento Produto → A Fazer. Usage: refine-workitem <KEY>. Run when the developer asks for it or when wayfind-workitem routes here."
---

# Refine a work item (product)

Input: a Jira card key, such as `ABC-123`. **It is required.** If none is given, ask for it and do nothing else.

You are a product analyst with access to the code. Your job is the **what** and the **why**, not the how. The result is a card any developer can pick up without asking the PO anything, and a sharper domain language in `GLOSSARY.md`. The card and its comments are written in **pt-BR** (`jira.md` › Language); `GLOSSARY.md` stays in English.

Read [../../references/jira.md](../../references/jira.md) first, especially **Jira is the source of truth**. Work in the original checkout, on the current branch. Nothing here needs a worktree.

## 1. Start

1. `getJiraIssue <KEY>`: the description, comments, links, labels, and parent/epic. Read linked cards and documents (Drive, Confluence) too, and every **refinement ticket** that blocks the card (Decisão, Pesquisa, Protótipo, Task): the resolved ones (their resolution comments are inputs) and the open ones (they must be resolved here or before A Fazer).
2. **Status gate.** If the card is in **Novo**, transition it to **Refinamento Produto** after a yes and comment `**[refine-workitem]** Refinamento de produto iniciado`. If it is in Refinamento Produto, resume from the card's latest `[refine-workitem]` comment. If it is already further along, say where it is and ask whether to re-refine. Re-refining a card after A Fazer moves it back to Refinamento Produto, with a comment saying why.

## 2. Investigate

Read, in this order, only what touches the card:

- `GLOSSARY.md`: the current vocabulary.
- `docs/specs/<capability>/spec.md`: the behavior the product has today. Note which requirements this card adds, changes, or removes.
- `docs/specs/changes/`: work in flight on the same capability, which may conflict.
- `docs/architecture/decisions/`: ADRs that constrain the area.
- `DESIGN.md`, when the item has UI.
- The code paths that implement today's behavior. Look for rules hidden in code (validations, permissions, limits, states) that the card does not mention.

Write down, for yourself:

- **Bottlenecks:** where the request is expensive or risky: data volume, legacy coupling, a missing integration.
- **Blockers:** dependencies on other teams, cards, access, data, or decisions.
- **Contradictions:** card vs. spec, card vs. code, card vs. glossary.
- **Questions:** business decisions only the PO can make.

## 3. Interview, sharpening the domain

Load `davi:grilling` and `davi:domain-modeling` and run them with the PO on the questions from step 2. In this skill:

- Ask the PO in plain Portuguese. Each question carries your recommended answer and the reason, so the PO can just confirm. Prefer questions the code cannot answer; check the code first each time.
- Questions about facts (what the code does today, what a provider allows) go to subagents, not to the PO.
- Test every rule with concrete scenarios: zero, many, concurrent, cancelled midway, a different permission, a different tenant, a timezone boundary, a retry after failure.
- When the code contradicts what the PO says, show the contradiction. Never silently pick a side.
- `GLOSSARY.md` is updated inline as each term resolves, with the diff shown (`domain-modeling`).
- ADR candidates are only noted; `spec-workitem` usually writes the ADR.

Stop when every question from step 2 is answered or explicitly parked as a dependency.

## 3b. Refinement tickets

A question that can't be closed in this conversation becomes a **refinement ticket that blocks the card** (`jira.md` › Refinement tickets): a child of the card's Epic, the project label, pt-BR, "blocks" link to `<KEY>`.

| The open question | Ticket |
|---|---|
| A business decision that needs other people or more time | **Decisão** (+ `wayfinder:task`) |
| A fact from docs, code, or a provider that takes real digging | **Pesquisa** (+ `wayfinder:task`) |
| How it should look or behave; for UI items, the screens | **Protótipo** (+ `wayfinder:task`) |
| Manual pre-work with no PR: an account, access, DNS, data | **Task** |

- Show the tickets and the links first and wait for a yes. They are born in Novo; run the block sweep so the unblocked ones go to A Fazer.
- Resolve the ones you can now, one at a time, with the procedure in [../wayfind-workitem/SKILL.md](../wayfind-workitem/SKILL.md) › Resolving a refinement ticket (claim → Desenvolvendo, resolve, comment, → Concluído). Pesquisa tickets run in background subagents meanwhile.
- The ones you can't (a person is away, a provider must answer) stay open; the card stays in Refinamento Produto.
- Fold each answer into the rules and criteria in step 4.

## 4. Fill the card

Rewrite the description sections this skill owns (see the description layout in `jira.md`) and keep the others intact:

```markdown
## Contexto
<refinado>

## Problema / Objetivo
<história ou objetivo refinado>

## Regras de negócio
- **RN1** <regra, com os termos do glossário>
- **RN2** …

## Critérios de aceite
### CA1 — <nome>
- **Dado** <estado>
- **Quando** <ação>
- **Então** <resultado observável>

### CA2 — …

## Fora de escopo
- <o que explicitamente não entra>

## Dependências e riscos
- <bloqueio / dependência / risco> → <responsável ou mitigação>
```

- Each criterion is observable and testable. QA turns each one into an end-to-end case, so "works well" or "is fast" without a number is not allowed.
- Cover the unhappy paths found in step 3, such as validation errors, permissions, empty states, and concurrency.
- Rules and criteria use glossary terms exactly.
- Check the issue type against `jira.md` › Issue types (Story or Habilitador? Habilitador or Task?) and the project label. Propose the fix when either is wrong.
- Show the final description and wait for a yes before `editJiraIssue`.
- Use only the project label (`jira.md` › Labels and links). Remove any other flow label you find (`frontend`, `backend`, `tech-debt`, `blocked`), saying so.

## 5. Design (UI items)

If the card changes UI (from the code, the criteria, or the PO), run `design-workitem <KEY>` now. It creates the UI **Protótipo** that blocks the card when there is none, and resolves it. Continue here after the PO approves the prototype.

## 6. Finish

1. **Ready check.** Every refinement ticket that blocks the card must be in Concluído (criterion 17). Then run the Definition of Ready lint in [../wayfind-workitem/references/ready-lint.md](../wayfind-workitem/references/ready-lint.md) on the card as it now stands. Fix what you can with the PO in this session. A criterion may be accepted only explicitly, with a reason.
2. **Ready:** transition to **A Fazer** after a yes.
3. **Not ready:** leave the card in **Refinamento Produto**. Open refinement tickets already record what it waits on; name them in the comment. When the answer depends on someone else and no ticket captures it, block it with [../../references/blocked.md](../../references/blocked.md), naming the owner. Otherwise list what is missing in the comment.
4. **Comment on the card** with this text:

   ```markdown
   **[refine-workitem]** Refinamento de produto concluído

   - Termos do glossário adicionados/alterados: <lista>
   - Ready lint: ok, ou os critérios aceitos com o motivo
   - Tickets de refinamento: <título com link e status, ou nenhum>
   - Design: <link do protótipo ou n/a>
   - Dependências abertas: <lista ou nenhuma>
   - Candidatos a ADR: <lista ou nenhum>
   ```

5. **`GLOSSARY.md`.** Leave the changes uncommitted unless the developer asks. They ship with the spec branch.
6. **Next step:** `/davi:spec-workitem <KEY>`.
