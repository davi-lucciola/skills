# <Project name>

<What the system does and for whom, in at most 3 lines.>

## Run

```bash
<setup command>
<start command>   # local URL: http://localhost:<port>
```

## Test

```bash
<full suite>
<single test file>
<typecheck / lint>
```

## Jira

- Project: `<KEY>`
- Label: `<project label>` (every card of this product carries it; see the plugin's `references/jira.md` › Project label)
- Board: <board url>

## Standards (read before changing code)

| Topic | File |
|---|---|
| Code | [docs/architecture/standards/code.md](docs/architecture/standards/code.md) |
| Testing | [docs/architecture/standards/testing.md](docs/architecture/standards/testing.md) |
| Git, branches, commits | [docs/architecture/standards/git.md](docs/architecture/standards/git.md) |
| Security | [docs/architecture/standards/security.md](docs/architecture/standards/security.md) |
| <API / Frontend / Data / Observability> | [docs/architecture/standards/<topic>.md](docs/architecture/standards/) |

## Product context

- Domain terms: [GLOSSARY.md](GLOSSARY.md). Use these terms in code, tests, and cards.
- Design and UI: [DESIGN.md](DESIGN.md). Tokens, components, and UI rules. Do not introduce values outside it.
- Architecture (C4): [docs/architecture/c4/](docs/architecture/c4/)
- Decisions (ADRs): [docs/architecture/decisions/](docs/architecture/decisions/). Respect the ADRs of the area you touch.
- Behavior (specs): [docs/specs/](docs/specs/). Changes in flight live in `docs/specs/changes/`.

## Modules with their own rules

- [`<folder>/AGENTS.md`](<folder>/AGENTS.md): <what is different there>

## Workflow

From card to merge with the `davi` plugin: `create-workitem` → `refine-workitem` → `design-workitem` (UI) → `spec-workitem` → `implement-workitem` (review + QA) → `ship-workitem`. Big or foggy idea? `/davi:wayfind-workitem chart <idea>`. Unsure where a card stands? `/davi:wayfind-workitem status <KEY>`.
