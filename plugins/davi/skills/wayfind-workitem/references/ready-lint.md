# Ready lint: Definition of Ready

A card is ready for technical refinement when an agent can build and test it without guessing. The lint catches vague cards while a human can still answer. It runs:

- in `refine-workitem`, before moving a card to **A Fazer** (a failing card does not move);
- in `spec-workitem`, at the start (a failing card goes back to `refine-workitem`);
- in `wayfind-workitem lint`, over many cards;
- in `create-workitem`, where criterion 11 (size) shapes the slicing.

Adapted from the lint of [EricTechPro/super-board](https://github.com/EricTechPro/super-board) (MIT) to the card layout in `references/jira.md`. Cards are in pt-BR, so the sections are `## Critérios de aceite`, `## Regras de negócio`, and so on, and the criteria use **Dado / Quando / Então**.

## Criteria

A card fails when any criterion fires. Report every criterion that fires.

| # | Criterion | Fails when | Suggested fix |
|---|---|---|---|
| 1 | Acceptance criteria exist | No `## Critérios de aceite` section, or it is empty or `_A refinar_` | Draft 2–5 CAs from the title, Contexto, and Regras de negócio |
| 2 | Dado / Quando / Então | A CA lacks a trigger or an observable outcome ("o chat funciona") | Rewrite as Dado / Quando / Então |
| 3 | Measurable | Unmeasurable adjectives ("rápido", "moderno", "intuitivo") or quantities without a unit ("carrega rápido", "muitos resultados") | Replace with a threshold and a unit |
| 4 | No open placeholders | `etc.`, `TBD`, `TODO`, `a definir`, `?`, or an open question in rules or CAs | Enumerate, decide, or move to Fora de escopo |
| 5 | One feature | More than about 5 CAs, or CAs about unrelated features bundled together | Split into vertical slices |
| 6 | Title matches body | The title says one thing, the body another | Ask which is right |
| 7 | In scope | A CA contradicts the current specs, an ADR, or the Epic's destination | Drop it, or flag it for the PO |
| 8 | One reading | A CA can reasonably mean two different things | Show both readings and ask |
| 9 | Dependencies as links | A dependency written in prose ("depois do ABC-12") with no "is blocked by" link, or a link with no explanation in Dependências e riscos | Add the link and one line of why |
| 10 | Real thing has an owner | A CA is proven against a fake, stub, or mock ("no database yet"), and no card owns the real implementation | Name the card that builds it, or create one |
| 11 | Small enough | Likely more than about 400 changed lines (not counting lockfiles, generated files, snapshots), or three or more areas (UI, API, database, job, email) that could each ship alone | Split into vertical slices with `create-workitem` |
| 12 | Design approved | An item that changes UI without a UI **Protótipo** that blocks it in Concluído and a `## Design` section linking the approved prototype | Run `design-workitem` (it creates the Protótipo when missing) |
| 13 | Bug is reproducible | A bug without reproduction steps, expected vs actual, and the environment | Ask the reporter, or reproduce it |
| 14 | Testable surface | No page, route, endpoint, command, or job named, so QA wouldn't know where to look | Add the surface |
| 15 | Right issue type | A Story with no change a user would notice; a Habilitador that changes what a user sees or can do, or that ends in no PR; a Task that needs a PR; a refinement type (Decisão, Pesquisa, Protótipo) whose question is already answered and only building is left (rules in `jira.md` › Issue types) | Change the type, with one line of why |
| 16 | Labels and language | The card lacks the project label, carries any other label except `wayfinder:map` on an Epic and `wayfinder:task` on Decisão/Pesquisa/Protótipo, or a root card is not in pt-BR (a Subtask not in English) | Fix the labels; rewrite in the right language |
| 17 | Refinement done | A work item is blocked by a refinement ticket (Decisão, Pesquisa, Protótipo, Task) that is not in Concluído | Resolve the ticket (`wayfind-workitem` › Resolving a refinement ticket), or close it as out of scope |
| 18 | Refinement ticket linked | A refinement ticket blocks no Story, Bug, or Habilitador | Link it to the work item it refines, or close it as out of scope |

## Output

For each flagged card:

```markdown
### <card title> (<KEY>): <status>
- [3] "carrega rápido" has no threshold.
- [9] Mentions "depois do card de preços" with no link.
- [15] Typed Habilitador, but visitors see the new page: should be a Story.
- [17] Blocked by "Provedor de captcha" (Pesquisa), still in A Fazer.

Suggested fix:
<the exact rewritten sections or the links to add>
```

Talk to the PO in plain Portuguese: "o que vamos conferir" for acceptance criteria, "o passo 2 não diz como é o resultado certo" for a missing outcome. The suggested fix is written in pt-BR, ready to paste into the card.

Refinement tickets (Decisão, Pesquisa, Protótipo, Task) are checked only against criteria 15, 16, and 18.

A card passes when no criterion fires, or when the developer explicitly accepts a fired criterion with a reason. Record that reason in the card comment.
