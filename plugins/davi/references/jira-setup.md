# Jira setup for the work item flow

What a Jira project needs before the `*-workitem` skills can run on it, and how to set it up. `onboarding` runs this once per project, and any skill that finds a missing piece stops and points here.

The Atlassian MCP can read the project configuration but cannot create issue types or edit workflows. Those steps go through the Jira UI, driven with **Claude in Chrome** (`mcp__claude-in-chrome__*`). Load the `claude-in-chrome` skill first and follow its rules: one ToolSearch for the tools, a new tab, no dialogs. The developer must be a project admin. Show every form before saving it and wait for a yes.

## What the project must have

| Piece | Required value | Check with |
|---|---|---|
| Statuses | Novo, Refinamento Produto, A Fazer, Refinamento Técnico, Desenvolvendo, Code Review, QA, Concluído | `listJiraStatuses` (`mode: "project"`) |
| Issue types | Epic, Story, Bug, **Habilitador**, Task, Subtask, **Decisão**, **Pesquisa**, **Protótipo** | `listJiraProjectIssueTypesMetadata` |
| Types' level | Habilitador, Decisão, Pesquisa, Protótipo at the same level as Story and Task, so an Epic can be their parent | the `hierarchyLevel` of a created ticket is `0` |
| Delivery workflow | Story, Bug, Habilitador (and Subtask): Novo → Refinamento Produto → A Fazer → Refinamento Técnico → Desenvolvendo ⇄ Code Review ⇄ QA → Concluído, as in `jira.md` | `listJiraIssueTransitions` on a Story |
| Short workflow | Decisão, Pesquisa, Protótipo, Task: Novo → A Fazer → Desenvolvendo → Concluído, plus Any → Novo and Any → Concluído. Either a separate workflow, or this path inside the shared one | `listJiraIssueTransitions` on a Task |
| Link type | "Blocks" (`blocks` / `is blocked by`) | `listJiraIssueLinkTypes` |
| Attachments | Enabled on the site | `uploadAttachmentToJiraIssue` on a test ticket |

Issue type names, descriptions (they become the tooltips on the board), and icons. Pick each icon from Jira's built-in set so the four new types are told apart at a glance:

| Name | Description (pt-BR, shown in Jira) | Icon |
|---|---|---|
| Habilitador | Trabalho técnico que habilita a entrega e gera PR, sem mudança visível no produto (infra, CI, upgrade, migração). | a wrench or a gear |
| Task | Trabalho manual que não gera PR (conta, acesso, DNS, repositório). Faz parte do refinamento de um item; fluxo curto. | keep the default |
| Decisão | Decisão que as pessoas tomam numa conversa, parte do refinamento de um item (wayfinder grilling). Não gera PR. | a question mark or a speech bubble |
| Pesquisa | Fato que uma decisão espera, buscado em docs, código ou APIs de terceiros, parte do refinamento de um item (wayfinder research). Não gera PR. | a magnifying glass or a book |
| Protótipo | Artefato barato para reagir: telas no Claude Design ou spike de lógica, parte do refinamento de um item (wayfinder prototype). Não gera PR. | a pencil or a lightbulb |

When a site already uses other names for these, write them to `issueTypes` in `~/.claude/davi.json` instead of creating duplicates.

## Team-managed project (statuses scoped to the project)

1. Open `https://<site>/jira/software/projects/<KEY>/settings/issuetypes` in a new tab.
2. For each missing type, choose **Add work type** (or "Add issue type"), and fill in the name, description, and icon from the table. Save. For an existing type, open it and update the description and icon the same way.
3. **Workflows.** Open each type's workflow ("Edit workflow" on the type's page) and read its header: it lists the icons of every work type that shares that workflow.
   - Story, Bug, and Habilitador share the **delivery workflow**. Check it matches `jira.md`; leave it as is.
   - Decisão, Pesquisa, Protótipo, and Task need the **short workflow**. When their workflow is shared with Story, create a separate one for them (the editor's option to use a new or copied workflow for that type), never by editing the shared one. Keep only Novo, A Fazer, Desenvolvendo, and Concluído (reuse the project's statuses, never a look-alike), with the transitions Novo → A Fazer, A Fazer → Desenvolvendo, Desenvolvendo → Concluído, and "Allow all statuses to transition to this one" on Novo and Concluído. Show the diagram before saving, then assign the same workflow to the other three refinement types.
   - When the editor can't split a type off the shared workflow (every type, Bug and new types included, opens the same workflow), keep the shared one and check it already has the short path: Novo → A Fazer, A Fazer → Desenvolvendo, Desenvolvendo → Concluído, Any → Novo, and Any → Concluído. Add only what is missing, after a yes, since the change also applies to Story, Bug, and Habilitador. The skills keep refinement tickets on that path (`jira.md` › Statuses and transitions).
4. Leave the default fields (Summary, Description, Labels, Parent, Assignee). Add **Labels** if the layout lacks it.

## Company-managed project (shared schemes)

1. In **Settings → Issues → Issue types**, create each missing type as a standard type (not a sub-task type), with the table above.
2. In the project's **Issue type scheme**, add the new types.
3. Create the workflow `Refinement` with Novo, A Fazer, Desenvolvendo, Concluído and the transitions above, then map it to Decisão, Pesquisa, Protótipo, and Task in the project's **Workflow scheme**. Keep Story, Bug, and Habilitador on the delivery workflow. Publish.
4. Make sure the new types share the project's screen scheme, which needs Labels and Parent.

## Change the type of an existing card

Try `editJiraIssue` with `fields: { "issuetype": { "id": "<new type id>" } }` first. When the API refuses (different workflow or level), use the UI:

1. Open the card in a new tab.
2. Click the issue type icon at the top left of the card, or **⋯ → Change work type** ("Move" in company-managed projects).
3. Pick the new type. When asked to map statuses, map each status to the status with the same name. Moving a work item to a refinement type maps Refinamento Produto to A Fazer and Refinamento Técnico, Code Review, and QA to Desenvolvendo.
4. Confirm, then re-read the card with `getJiraIssue` and check the type, status, parent, and labels.

## Verify

1. `listJiraProjectIssueTypesMetadata` lists the nine types.
2. Create one test ticket of each refinement type under a test Epic, with the project label. Walk Novo → A Fazer → Desenvolvendo → Concluído and attach a small text file. List the transitions of a Story and check they are the delivery workflow. Then ask the developer to delete the test tickets (skills never delete cards).
3. Record the result on the project's onboarding card, or tell the developer when there is none.
