# davi-lucciola/skills

This repo is the source of the `davi` Claude Code plugin. The marketplace manifest is `.claude-plugin/marketplace.json`. The plugin lives in `plugins/davi/`.

## Rules

- Skills, references, the README, and the repo artifacts the skills generate (specs, ADRs, `tasks.md`, PRs, commits) are written in English. **Jira text is the exception**: root cards (Epic, Story, Bug, Habilitador, Decisão, Pesquisa, Protótipo, Task), their descriptions, section headings, comments, and the card templates in `create-workitem/templates/` are in pt-BR; Subtasks are in English. The rule lives in `plugins/davi/references/jira.md` › Language. Jira status and issue type names are the workflow's real names: Novo, Refinamento Produto, A Fazer, Refinamento Técnico, Desenvolvendo, Code Review, QA, Concluído; Habilitador, Decisão, Pesquisa, Protótipo.
- One skill is one folder: `plugins/davi/skills/<name>/SKILL.md`, plus `templates/` or `references/` next to it.
- Rules used by more than one skill live in `plugins/davi/references/`. Skills link to them with `../../references/<file>.md` and never copy them.
- Flow skills end in `-workitem`. Only entry points the model must never start on its own carry `disable-model-invocation: true`: `onboarding`, `project-harness`, and `wayfind-workitem`. The step skills stay model-invocable so `wayfind-workitem` can route to them through the Skill tool. Their descriptions end with "Run when the developer asks for it or when wayfind-workitem routes here."
- Jira is the source of truth. Every flow skill follows the contract in `plugins/davi/references/jira.md`: a status gate on entry, a transition (or a block) on exit, a `**[skill]**` comment trail with links on the card, the right issue type, the project label on every card (and no other label but `wayfinder:map` / `wayfinder:task`), refinement tickets that block the work items they refine, and evidence attached to the card (not Drive).
- Guard hooks live in `plugins/davi/hooks/` with their tests in `hooks/tests/`. Run the tests after any change there.
- Skills ported from other repos (`ponytail`, `tdd`, `wayfind-workitem`, `grilling`, `domain-modeling`, `research`, `prototype`, `ui-design-direction`, `ui-ux-pro-max`, the guards) keep a `NOTICE.md`. Record every substantive change to the ported text there.
- Subagents live in `plugins/davi/agents/`. The reviewer always runs on `sonnet`.
- Do not edit `skills/ui-ux-pro-max/data/` or `skills/ui-ux-pro-max/scripts/` except to sync with upstream. Its `SKILL.md` is ours.

## Check before committing

```bash
claude plugin validate plugins/davi
claude plugin validate .
bash plugins/davi/hooks/tests/test_guards.sh
python3 plugins/davi/skills/ui-ux-pro-max/scripts/search.py "saas dashboard" --design-system -f markdown | head
```

## Git

Use Conventional Commits. The remote is `git@github.com:davi-lucciola/skills.git` (personal `davi-lucciola` account).
