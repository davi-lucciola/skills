# Jira

Every `*-workitem` skill reads this file before its first Jira call.

## Jira is the source of truth

The work item lives on its Jira card. Branches, specs, and PRs are linked from the card, and the evidence is attached to it. The local `.workitem-evidence/` folder is a working cache. Any developer on any machine must be able to pick up a work item from the card alone. Every skill follows this contract:

1. **Status gate on entry.** Read the card (`getJiraIssue`) before anything else and check that it is in the status the skill starts from (see [Statuses and transitions](#statuses-and-transitions)). If it is not, stop, say which status it is in and which skill handles that status. Skip a step only when the developer explicitly confirms, and record why in a comment.
2. **Transition on exit.** End by moving the card to the next status, or, when the skill cannot finish, by leaving a Block comment ([blocked.md](blocked.md)). No step ends with its result only on a local disk.
3. **Trail on the card.** Comment at the start of a long step, at its end, on every review or QA round, every block and unblock, and every wayfinder decision, with the `**[<skill>]**` header below. Someone reading only the card's comments must be able to tell the whole story.
4. **Links and evidence on the card.** As soon as they exist, the card links the branch, the change folder on the branch, the PR (remote link when the server supports it, always a comment), the design prototype, and the ADRs. Evidence (screenshots, videos, logs, responses) is **attached to the card itself**: see [Evidence on the card](#evidence-on-the-card).
5. **The key everywhere.** `<KEY>` goes in the branch name, the PR title, and every commit (`Refs: <KEY>`), so the GitHub for Jira integration links all three. See [git.md](git.md).
6. **Fields and relations.** The right [issue type](#issue-types), the parent Epic, the [project label](#project-label), "is blocked by" links for dependencies (refinement tickets block the work items they refine), the wayfinder labels where they apply, the impediment flag, and the assignee as the claim: `implement-workitem` assigns the card to the developer who runs it, and `wayfind-workitem` / `refine-workitem` assign refinement tickets the same way (and move them to Desenvolvendo).
7. **Resume from the card.** When a skill resumes, it rebuilds its state from the card's status and its latest `**[<skill>]**` comments (for example, the last review round recorded), then reconciles with the local files. If they disagree, the card wins and the skill says so.

## Tools

Jira is reached through the Atlassian MCP. The tool prefix depends on how the developer connected it:

- claude.ai connector: `mcp__claude_ai_Atlassian__<operation>`
- local MCP added by `onboarding`: `mcp__atlassian__<operation>`

Use whichever prefix is present in this session. When neither is present, stop and tell the user to run `/davi:onboarding`.

Operations the skills use:

| Need | Operation |
|---|---|
| Site id | `getAccessibleAtlassianResources` (only when `~/.claude/davi.json` has no `cloudId`) |
| Read a card | `getJiraIssue` |
| Search | `searchJiraIssuesUsingJql` |
| Issue types of the project | `listJiraProjectIssueTypesMetadata` (via `discover` + `executeRead`) |
| Create | `createJiraIssue` |
| Edit fields / description | `editJiraIssue` |
| Change issue type | `editJiraIssue` on `issuetype`; when the API refuses, the Jira UI "Change work type" through claude-in-chrome (see [jira-setup.md](jira-setup.md)) |
| List transitions | `getTransitionsForJiraIssue` or `listJiraIssueTransitions` (via `discover` + `executeRead` when it is not a primary tool) |
| Move status | `transitionJiraIssue` |
| Comment | `addCommentToJiraIssue` or `addOrEditJiraIssueComment`, whichever the server exposes |
| Attach a file | `uploadAttachmentToJiraIssue` (via `discover` + `executeWrite`; two phases, see [Evidence on the card](#evidence-on-the-card)) |
| Download an attachment | `downloadJiraIssueAttachment` (via `executeRead`) |
| Link cards | `discover` "create issue link" + `executeWrite` |
| Remote link (PR, artifact) | `discover` "add remote link" + `executeWrite`; fall back to a comment |
| Flag / unflag | `editJiraIssue` on the flag field found through `discover` "flag issue as impediment"; when the site has none, the Block comment and the "is blocked by" link are the record (no label) |
| Users | `lookupJiraAccountId` or `atlassianUserInfo` |

When an operation is not a primary tool, call `discover` with the goal, then the matching `executeRead` / `executeWrite`. Never invent an operation name. Pass `cloudId` as a top-level argument.

## Config

Global, per developer: `~/.claude/davi.json`, written by `onboarding`.

```json
{
  "cloudId": "<atlassian cloud id>",
  "site": "<company>.atlassian.net",
  "statuses": {
    "new": "Novo",
    "productRefinement": "Refinamento Produto",
    "todo": "A Fazer",
    "techRefinement": "Refinamento Técnico",
    "inProgress": "Desenvolvendo",
    "codeReview": "Code Review",
    "qa": "QA",
    "done": "Concluído"
  },
  "issueTypes": {
    "enabler": "Habilitador",
    "grilling": "Decisão",
    "research": "Pesquisa",
    "prototype": "Protótipo",
    "manual": "Task"
  },
  "loops": { "maxRounds": 5 },
  "guards": { "guard-protected-push": true }
}
```

Per project: the Jira project key and the project label live in the repo, in the `## Jira` section of the root `AGENTS.md`:

```markdown
## Jira

- Project: `ABC`
- Label: `abc-site`
- Board: https://<company>.atlassian.net/jira/software/projects/ABC/boards/1
```

Resolve the project key in this order:

1. The prefix of the card key the user passed (`ABC-123` → `ABC`).
2. The `## Jira` section of the root `AGENTS.md`.
3. Ask the user, then offer to write the `## Jira` section.

When `~/.claude/davi.json` is missing, use the default status and issue type names above and suggest `onboarding`.

## Project label

A Jira project can hold several products or efforts. The **project label** filters one of them: every card of the effort carries it, from the Epic down to each Subtask (for example `acme-site`). It is lowercase kebab-case, with no spaces.

Resolve it in this order:

1. The project label of the card's parent Epic (its one label that is not a `wayfinder:` marker).
2. `- Label:` in the `## Jira` section of the root `AGENTS.md`.
3. Ask the developer, then offer to write it to `AGENTS.md` and to the Epic.

Rules:

- Every `createJiraIssue` sets it. Children inherit it from their Epic or parent card.
- Every JQL a skill runs adds `AND labels = "<label>"` when the label is known, so boards, filters, and the skills see the same set of cards.
- A card without the project label is a consistency error. `wayfind-workitem status` and `lint` report it.

## Issue types

The issue type says what kind of work a card is. Pick it by these rules, never by habit. A wrong type fails criterion 15 of [ready-lint.md](../skills/wayfind-workitem/references/ready-lint.md).

Cards come in two families:

- **Work items** deliver a change through a **pull request** and run the full delivery workflow: Story, Bug, Habilitador.
- **Refinement tickets** belong to the product refinement of one or more work items and never produce a PR: Decisão, Pesquisa, Protótipo, Task. They run the [short workflow](#statuses-and-transitions) and **block** the work items they refine (see [Refinement tickets](#refinement-tickets)).

| Issue type | Family | Use for | Created by |
|---|---|---|---|
| **Epic** | | An effort with several work items; a wayfinder map (label `wayfinder:map`) | `create-workitem`, `wayfind-workitem chart` |
| **Story** | work item | Anything that changes what a user, visitor, customer, or operator **sees or can do** in the product: a page, a form, a flow, an email they receive, a report | `create-workitem` |
| **Bug** | work item | The product does something different from its spec or its acceptance criteria | `create-workitem` |
| **Habilitador** | work item | Technical work that enables delivery, goes through a PR, and has **no observable product change**: infra as code, CI, a repo scaffold, a migration with no new behavior, an upgrade, a refactor | `create-workitem` |
| **Decisão** | refinement | wayfinder `grilling`: a decision the humans make in a conversation | `wayfind-workitem`, `refine-workitem` |
| **Pesquisa** | refinement | wayfinder `research`: a fact a decision waits on, found in docs, code, or third-party APIs | `wayfind-workitem`, `refine-workitem` |
| **Protótipo** | refinement | wayfinder `prototype`: a cheap artifact to react to, when the question is "how should it look or behave". UI prototypes of a work item are resolved by `design-workitem` | `wayfind-workitem`, `refine-workitem` |
| **Task** | refinement | **Manual work only**, with no PR: an account at a provider, DNS, access, creating a repo, a secret in a vault, data someone must hand over | `wayfind-workitem`, `refine-workitem` |
| **Subtask** | | One slice of a work item's `tasks.md` | `spec-workitem` |

**Story or Habilitador?** Ask: "once this is done, can someone outside the dev team notice a difference in the product?" Yes → Story. No → Habilitador.

- "Contact form sends the lead by email" → Story. "Scaffold the Astro site with deploy to Cloudflare Workers" → Habilitador.
- "Home page shows the agency positioning" → Story. "CI runs lint and tests on every PR" → Habilitador.
- "Visitor reads the privacy policy" → Story, even when the work is mostly copy.

**Habilitador or Task?** Ask: "does this end in a pull request?" Yes → Habilitador. No, someone clicks through a console or hands something over → Task. "Set up Resend for the domain" (sign-up and DNS records) → Task. "Create repo acme/site" → Task.

**Refinement ticket or work item?** A refinement ticket answers a question or clears a manual prerequisite; a work item delivers. When the question is already answered and only the building is left, it is a Story, Bug, or Habilitador.

`Habilitador`, `Decisão`, `Pesquisa`, and `Protótipo` are created in the Jira project once, by the procedure in [jira-setup.md](jira-setup.md), which also gives the refinement types the short workflow. When a skill needs them and they are missing, it stops and points there (`onboarding` runs it). Their names come from `issueTypes` in the config.

## Refinement tickets

- A child of the work item's Epic, with the project label. Decisão, Pesquisa, and Protótipo also carry `wayfinder:task`; a Task does not.
- It **blocks** at least one Story, Bug, or Habilitador: a native "blocks" link from the ticket to the work item (the work item "is blocked by" it). Refinement tickets may also block each other.
- A work item cannot move from Refinamento Produto to A Fazer while a refinement ticket that blocks it is not in Concluído (ready-lint criterion 17).
- They are created by `wayfind-workitem chart` (for an effort) and by `refine-workitem` (for the card it refines), and resolved by `wayfind-workitem next` or inside `refine-workitem`, with the procedure in `wayfind-workitem` › Resolving a refinement ticket.
- Title in pt-BR, phrased as the question or the manual step. Description with `## Pergunta` (or `## Passos` for a Task) and `## Contexto`. The answer never goes in the description: it goes in the resolution comment.

## Language

Cards are read by the PO and the business, so they are written in **Portuguese (pt-BR)**. The repo is read by engineers and agents, so it stays in **English**.

| Where | Language |
|---|---|
| Root cards (Epic, Story, Bug, Habilitador, Decisão, Pesquisa, Protótipo, Task): title, description with its section headings, and every comment | pt-BR |
| Subtasks (technical slices from `spec-workitem`) and their comments | English |
| Specs, ADRs, `tasks.md`, code, commits, branch names, PR title and body, the structure of `GLOSSARY.md` and `DESIGN.md` | English |
| The skill comment header `**[<skill-name>]**` | the skill name as is, followed by pt-BR text on root cards |

Use the domain terms of `GLOSSARY.md`. When a glossary term is in English, keep it inside the Portuguese sentence, in *italics* the first time it appears.

## Statuses and transitions

Refinement tickets and work items walk **two different paths**, over the same statuses. When the project can give the refinement types their own workflow, it does ([jira-setup.md](jira-setup.md)). When it has one workflow for every type (a team-managed space where workflows can't be split, such as a team-managed project), the refinement tickets walk only the short path inside it and the skills never move them to any other status.

**Delivery workflow** (Story, Bug, Habilitador):

```
Novo → Refinamento Produto → A Fazer → Refinamento Técnico → Desenvolvendo ⇄ Code Review ⇄ QA → Concluído
```

| From → To | Skill |
|---|---|
| (start) → Novo | `create-workitem` |
| Novo → Refinamento Produto | `refine-workitem` (on start) |
| Refinamento Produto → A Fazer | `refine-workitem` (on finish), once every refinement ticket blocking the card is in Concluído (UI items: after the Protótipo resolved by `design-workitem`) |
| A Fazer → Refinamento Técnico | `spec-workitem` (it also creates the Subtasks, in Novo) |
| Refinamento Técnico → Desenvolvendo | `implement-workitem` |
| Desenvolvendo → Code Review | `implement-workitem` (review round) |
| Code Review → Desenvolvendo | `implement-workitem` (blocking findings) |
| Code Review → QA | `implement-workitem` → `qa-workitem` |
| QA → Desenvolvendo | `qa-workitem` (bugs found) |
| QA → Concluído | `ship-workitem`, after merge |

`wayfind-workitem` reads this table to route a card to its next skill.

Transition by the **name** of the destination status, never by a hard-coded id:

1. List the card's transitions.
2. Pick the one whose `to.name` equals the configured status name, case-insensitive.
3. If none matches, the workflow does not allow that move from the current status. Report the current status and the available transitions, and stop. Do not chain through other statuses on your own.

**Short workflow** (refinement tickets: Decisão, Pesquisa, Protótipo, Task):

```
Novo → A Fazer → Desenvolvendo → Concluído
```

| From → To | Meaning | Skill |
|---|---|---|
| (start) → Novo | Created; may still be blocked by another ticket | `wayfind-workitem chart`, `refine-workitem` |
| Novo → A Fazer | Unblocked: every ticket that blocks it is in Concluído. It is on the frontier | the block sweep ([blocked.md](blocked.md)), `wayfind-workitem next` |
| A Fazer → Desenvolvendo | Claimed: assigned to the developer and being resolved | `wayfind-workitem next`, `refine-workitem` |
| Desenvolvendo → Novo | Claim released without a resolution: unassign it; the next block sweep puts it back in A Fazer | whoever claimed it |
| Desenvolvendo → Concluído | Resolved, with the resolution comment posted | `wayfind-workitem next`, `refine-workitem` |
| Any → Concluído | Closed as out of scope (comment says why) | `wayfind-workitem` |

Subtasks run the delivery workflow: **Novo → Desenvolvendo** when `implement-workitem` starts their slice (walked through the chain when there is no direct move), **→ Concluído** when the slice is merged into the work item's branch.

Before transitioning, read the current status. A card already in the destination status is not an error: skip the transition.

## Writing to Jira

- Content follows [Language](#language): pt-BR on root cards, English on Subtasks. Descriptions and comments use Markdown (`contentFormat: "markdown"` when the operation accepts it).
- Show the exact text and target card before any create, edit, transition, or upload, and wait for confirmation. Exception: inside an `implement-workitem` / `qa-workitem` loop, the developer authorizes the round comments, Subtask transitions, uploads, and card transitions once, at the start.
- Never delete a card, a comment, an attachment, or a field value the user wrote. Edit the description by rewriting sections the skill owns and keeping the rest.
- Every skill ends by commenting on the card what it did, with links (spec path, PR URL, artifact URL) and the names of the attachments it added.

Comment header, so the history is scannable:

```markdown
**[<skill-name>]** <one-line result, in pt-BR on root cards>

<details>
```

For example, on a Story: `**[refine-workitem]** Refinamento de produto concluído`.

## Labels and links

Labels name the project, nothing else, with the two wayfinder markers as the only exception. Never add other flow labels (`frontend`, `backend`, `tech-debt`, `blocked`): the issue type, the links, and the flag carry that meaning.

| Label | Meaning | Set by |
|---|---|---|
| `<project label>` | Filters the product or effort (see [Project label](#project-label)). On every card | every skill that creates a card |
| `wayfinder:map` | The Epic is a wayfinder map. Only on Epics | `wayfind-workitem chart` |
| `wayfinder:task` | A wayfinder refinement ticket. Only on Decisão, Pesquisa, and Protótipo | `wayfind-workitem`, `refine-workitem` |

What the old labels meant now lives elsewhere:

- UI work: a **Protótipo** that blocks the item, resolved by `design-workitem`, and the `## Design` section.
- Tech debt: a **Habilitador** titled "Dívida técnica: …" with a "relates to" link to the card it came from.
- Blocked: the impediment flag plus the Block comment ([blocked.md](blocked.md)).

Dependencies are always native **"is blocked by"** links, never prose in the description. Work items of the same effort share a parent **Epic**.

## Description layout

The card description is the product contract, in pt-BR. Sections, in this order. A skill fills only its own sections and leaves the others intact. Skills find a section by its heading, so use these headings exactly.

```markdown
## Contexto
## Problema / Objetivo
## Regras de negócio
- **RN1** …
## Critérios de aceite
### CA1 — <nome>
- **Dado** …
- **Quando** …
- **Então** …
## Fora de escopo
## Dependências e riscos
## Design
## Especificação técnica
```

| Section | Owner |
|---|---|
| Contexto, Problema / Objetivo | `create-workitem`, refined by `refine-workitem` |
| Regras de negócio, Critérios de aceite, Fora de escopo, Dependências e riscos | `refine-workitem` |
| Design | `design-workitem` (artifact link + DESIGN.md decisions) |
| Especificação técnica | `spec-workitem` (link to `docs/specs/changes/<change>/` and the Subtasks) |

Acceptance criteria ids on the card are `CA1`, `CA2`, …, and business rules are `RN1`, `RN2`, …. The spec, written in English, keeps the same ids in scenario names (`#### Scenario: CA2 — …`), so review and QA can trace them.

A Subtask's description is in English, from [../skills/spec-workitem/templates/subtask.md](../skills/spec-workitem/templates/subtask.md).

## Evidence on the card

Evidence lives on the card as **Jira attachments**, so anyone who opens the card sees it without access to another tool. The local `.workitem-evidence/<KEY>/` folder is only a working cache.

Upload one file in two phases with `uploadAttachmentToJiraIssue` (`executeWrite`, `cloudId` at the top level):

1. Call it with `issueIdOrKey` and an absolute `filePath`. It returns an `uploadCommand`. Run that command with Bash; it prints a `fileId`.
2. Then do **one** of:
   - **Attach:** call it again with the `fileId`, so the file shows in the card's attachments.
   - **Inline:** pass the `fileId` as `inlineFileId` to `addOrEditJiraIssueComment`, so the image shows inside the comment.

Conventions:

- Attachments are flat, so the file name carries the context: `<KEY>-<step><N>-<case>.<ext>`. Examples: `PROJ-21-qa2-ca3-form-error.png`, `PROJ-21-qa2-run.mp4`, `PROJ-21-qa2-console.log`, `PROJ-21-qa2-api-ca1.json`, `PROJ-8-research.md`.
- **Screenshots** go inline in the round's comment, next to the case they prove. **Videos, console and network logs, HTTP responses, DB query output, and long write-ups** are attached, and the comment lists their names.
- Keep videos small before uploading: `ffmpeg -i in.mp4 -vf "scale='min(1280,iw)':-2" -crf 30 -an out.mp4`. If a file is still over the site's attachment limit, keep it local, say so in the comment, and name its path.
- Never upload secrets, tokens, dotenv content, or personal data. Mask them in screenshots and logs first.
- A new round never deletes the attachments of an earlier round. The `<step><N>` prefix tells them apart.
- Uploads inside an `implement-workitem` / `qa-workitem` loop are covered by the gate authorization. Elsewhere, list the files and wait for a yes.
