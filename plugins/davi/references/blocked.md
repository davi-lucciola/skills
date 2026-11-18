# Blocked

`Blocked` is not a status in the workflow. It is an exit ramp: the card stays in its current status, gets the impediment flag, and carries one structured comment that says exactly what would unblock it. Adapted from the block template of [EricTechPro/super-board](https://github.com/EricTechPro/super-board) (MIT).

## When

- A loop in `implement-workitem` hits a stop condition from [loop.md](loop.md).
- A preflight item ([preflight.md](preflight.md)) depends on someone else: a credential, access, an environment.
- `ready-lint` fails and the developer chooses to block the card instead of fixing it now.
- Any skill needs a product, design, or ops decision it must not guess.
- The card waits on another card that is not done.

## How

1. Set the impediment flag on the card (`discover` "flag issue as impediment" → `editJiraIssue`). If the site has no flag field, the comment and the "is blocked by" link are the record: never add a `blocked` label (`jira.md` › Labels and links).
2. When the reason is another card, make sure a native **"is blocked by"** link to it exists.
3. Post the comment below on the card, and on the PR when one exists (`gh pr comment`).
4. Leave the status as it is.

Inside an `implement-workitem` run, these writes are covered by the gate. Elsewhere, show the comment first and wait for a yes.

## Comment template

One line per field, in pt-BR on root cards (English on a Subtask). Lead with the fact, show the evidence, name the owner. Don't narrate what was tried in what order. Keep the `blocked-by:` key as is: the sweep parses it.

```markdown
**[<skill>] Bloqueado**: <motivo em uma linha>

- **Por que está bloqueado:** <o que exatamente falta ou está errado>
- **Evidência:** <comando e fim da saída, arquivo:linha, erro, ou anexo; não uma paráfrase>
- **Já verificado:** <o que foi conferido antes de bloquear, para ninguém refazer, ou "-">
- **O que bloqueia:** <a ação externa que muda isso: credencial, acesso, decisão, outro card>
- **Por que não posso decidir:** <a decisão que o agente se recusa a tomar sozinho, e por quê>
- **Para desbloquear:**
  - [ ] <passo 1>
  - [ ] <passo 2>
- **Responsável:** <quem age agora: o dev, o PO, design, ops; nunca "alguém">
- **blocked-by:** <chaves dos cards separadas por vírgula, ou "-" quando nada no Jira resolve>
```

## Sweep

`wayfind-workitem status` and `next` run this sweep on the cards they look at:

1. Find flagged cards in scope, plus refinement tickets (Decisão, Pesquisa, Protótipo, Task) still in **Novo**.
2. Read the latest `**[...] Bloqueado**` comment (or `Blocked` on Subtasks and older cards) and its `blocked-by:` line, plus the card's "is blocked by" links.
3. If `blocked-by` lists cards and all of them are in **Concluído**, remove the flag and comment:

   ```markdown
   **[wayfind-workitem] Desbloqueado**: <KEY-1>, <KEY-2> estão concluídos.
   ```

4. Cards whose `blocked-by` is `-` wait for their owner. The sweep never clears them.
5. A refinement ticket in **Novo** whose "is blocked by" tickets are all in **Concluído** (or that has none) moves to **A Fazer**: it is on the frontier now (`jira.md` › Statuses and transitions, short workflow). No comment needed; the transition is the record.

The sweep writes after showing the list of cards it will unblock and getting one yes for the batch.

## Unblocking by hand

Whoever resolves the blocker removes the flag and comments `**[<skill or name>] Desbloqueado**: <o que mudou>`. The next skill run picks the card up from its status.
