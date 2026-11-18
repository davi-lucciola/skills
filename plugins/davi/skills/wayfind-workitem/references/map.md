# The wayfinder map on Jira

A big, foggy effort is charted as one **map**: a Jira Epic whose children are the **work items** that deliver it (Story, Bug, Habilitador) and the **refinement tickets** that block them until the way is clear (Decisão, Pesquisa, Protótipo, Task). The map is an index, not a store. Each decision lives in exactly one place, its ticket. The map gists it and links to it.

Everything on the map and its tickets is written in **pt-BR** (`jira.md` › Language). The section headings below are fixed: skills find sections by them.

## The map: an Epic

- Issue type **Epic** in the project, labels `wayfinder:map` and the **project label** (for example `acme-site`).
- Summary: the effort's name, in pt-BR, in domain terms from `GLOSSARY.md`.
- Description, in this layout. Open tickets are **not** listed in it; they are found by query.

```markdown
## Destino

<Como é chegar ao fim deste mapa: o conjunto de itens de trabalho, a decisão ou a mudança que este esforço busca. Uma ou duas linhas. Toda sessão se orienta por aqui antes de escolher um ticket.>

## Notas

<O domínio, os repositórios envolvidos, a label do projeto, as skills que toda sessão deve consultar e as preferências fixas deste esforço. Termos do domínio ainda sem GLOSSARY.md.>

## Decisões até agora

<!-- Uma linha por ticket de decisão concluído: o bastante para julgar a relevância; o ticket guarda o detalhe. -->
- [<título do ticket>](<link>): <resumo da resposta em uma linha>

## Ainda não especificado

<!-- Névoa dentro do escopo que ainda não dá para formular como pergunta precisa. Vira tickets conforme a fronteira avança. -->

## Fora de escopo

<!-- Trabalho além do destino. Fechado, nunca vira ticket. -->
- [<título do ticket>](<link>): <por que está fora do escopo>
```

## Refinement tickets

- Children of the Epic (parent field), with the **project label**. Decisão, Pesquisa, and Protótipo also carry `wayfinder:task`; a Task does not.
- The kind is the **issue type**: **Decisão** (grilling), **Pesquisa** (research), **Protótipo** (prototype), or **Task** (manual work, no PR). See `SKILL.md` › Refinement ticket types. They never run `refine-workitem` or the later steps, and never produce a PR.
- Each one **blocks** at least one work item (Story, Bug, Habilitador) of the same Epic: it is part of that item's product refinement.
- Title in pt-BR, phrased as the decision or the manual step: "Posicionamento da agência na home", "Provedor de captcha dos formulários", "Configurar o Resend para o domínio".
- Sized to one agent session.
- Description:

  ```markdown
  ## Pergunta

  <a decisão ou investigação que este ticket resolve; numa Task, o estado final esperado>

  ## Passos

  <só numa Task: o checklist do trabalho manual>

  ## Contexto

  <o item de trabalho que ele bloqueia e as decisões anteriores em que se apoia, por título com link>
  ```

- The answer is never in the description. It goes in the resolution comment, with assets attached or linked.

## Workflow, blocking, claim, frontier

Refinement tickets run the short workflow (`jira.md` › Statuses and transitions):

| Status | Meaning on the map |
|---|---|
| Novo | Created; blocked by another refinement ticket |
| A Fazer | Unblocked and unclaimed: on the **frontier** |
| Desenvolvendo | Claimed: the assignee is resolving it |
| Concluído | Resolved (or closed as out of scope) |

- **Blocking** uses native "blocks" / "is blocked by" links, so the Jira UI itself shows what is takeable. Create all cards first, then wire the links in a second pass with real keys: refinement ticket → work item, and refinement ticket → refinement ticket where one waits on another.
- The **block sweep** moves a ticket from Novo to A Fazer once every ticket blocking it is in Concluído.
- **Claim:** the session assigns the ticket to its developer and moves it to Desenvolvendo before any work.

Refinement tickets on the frontier. Take the type names from `issueTypes` in the config when they differ:

```
parent = <EPIC> AND labels = "<project label>"
  AND issuetype in ("Decisão","Pesquisa","Protótipo","Task")
  AND status = "A Fazer" ORDER BY Rank ASC
```

Open refinement tickets (for the sweep and `status`):

```
parent = <EPIC> AND labels = "<project label>"
  AND issuetype in ("Decisão","Pesquisa","Protótipo","Task")
  AND statusCategory != Done ORDER BY Rank ASC
```

Work items of the same Epic:

```
parent = <EPIC> AND labels = "<project label>"
  AND issuetype in ("Story","Bug","Habilitador") ORDER BY Rank ASC
```

Children missing the project label (a consistency check):

```
parent = <EPIC> AND (labels IS EMPTY OR labels not in ("<project label>"))
```

## Resolution comment

In pt-BR:

```markdown
**[wayfind-workitem] Resolução** (<Decisão | Pesquisa | Protótipo | Task>)

**Desbloqueia:** <itens de trabalho, por título com link>

**Resposta:** <a decisão, em uma ou duas frases>

<Raciocínio, os fatos em que se apoia com as fontes, e os ativos: link do protótipo, branch do spike, nomes dos anexos.>

**Consequências:** <tickets criados, névoa que virou ticket, tickets fora de escopo, candidato a ADR ou nenhum>
```

## Fog or ticket?

The test is whether you can state the question precisely **now**, not whether you can answer it now.

- **Refinement ticket** when the question (or the manual step) is already sharp, even if it is blocked, and you can name the work item it blocks.
- **Ainda não especificado** when you can't phrase it that sharply yet. Don't pre-slice the fog into ticket-sized pieces. One patch may become several tickets, or none.
- **Work item** when there is no question left: only building. It is a Story, Bug, or Habilitador created by `create-workitem`, not a refinement ticket.

Ainda não especificado excludes what is already decided, what is already a ticket, and what is out of scope.

## Out of scope

Fog only gathers toward the destination. Work beyond it is out of scope, not fog. When an existing ticket turns out to sit beyond the destination, close it and add one line to Fora de escopo with the reason. It stays out of Decisões até agora, which records the route actually walked. Out-of-scope work comes back only as a fresh effort with a new destination.

## Handing off to delivery

The work items exist from the start: `chart` creates them before their refinement tickets. Each one enters the delivery flow as soon as the refinement tickets blocking it are in Concluído: `next <EPIC>` routes it to `refine-workitem`, which may still create more refinement tickets for it. When fog graduates into new work, `next` creates the new work items through `create-workitem --epic <EPIC>` (Story, Bug, or Habilitador by the rule in `jira.md` › Issue types, with the project label, in pt-BR, with "is blocked by" links between slices) and records them in the Destino line.
