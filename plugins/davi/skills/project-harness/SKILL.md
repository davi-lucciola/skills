---
name: project-harness
description: "Create or audit the standard documentation and agent harness of a repository: modular AGENTS.md, standards, ADRs, C4 diagrams in Mermaid, OpenSpec-style specs under docs/specs, GLOSSARY.md, DESIGN.md, and README.md. Idempotent. Use on a new repo, on a repo that lacks the standard, or to check what is missing."
disable-model-invocation: true
---

# Project harness

You make this repository follow the harness standard, so humans and agents find the same context in the same place. Run in the repo root. Every file you write is in **English**.

Templates live in [templates/](templates/). The spec format is [../../references/openspec-format.md](../../references/openspec-format.md).

## The standard

```
<repo>/
├── AGENTS.md                         # index only; points to everything below
├── CLAUDE.md                         # one line: @AGENTS.md
├── DESIGN.md                         # design system / UI contract (always present)
├── GLOSSARY.md                       # domain terms only
├── README.md
├── <pasta-importante>/AGENTS.md      # local rules for a big module/app (monorepo apps, packages)
└── docs/
    ├── architecture/
    │   ├── standards/*.md            # the modular body of AGENTS.md
    │   ├── decisions/NNN-ADR-<slug>.md
    │   └── c4/01-context.md, 02-container.md, 03-component*.md
    └── specs/
        ├── <capability>/spec.md
        └── changes/ (+ archive/)
```

| File | Rule |
|---|---|
| `AGENTS.md` | Short (≈ 60–120 lines). What the project is in 3 lines, how to run/test, the `## Jira` section, and links to each standard, `DESIGN.md`, `GLOSSARY.md`, C4, decisions, specs, and every nested `AGENTS.md`. Rules themselves live in the standards. Template: [templates/AGENTS.md](templates/AGENTS.md). |
| `docs/architecture/standards/*.md` | One topic per file. Baseline set: `code.md`, `testing.md`, `git.md`, `security.md`, `api.md` (if there is an API), `frontend.md` (if there is UI), `data.md` (if there is a database), `observability.md`. Each rule is concrete and checkable, with a short example. Template: [templates/standard.md](templates/standard.md). |
| Nested `AGENTS.md` | Only for folders with their own stack or rules (e.g. `apps/web`, `apps/api`, `packages/ui`, `infra/`). Same shape as the root, scoped. |
| `docs/architecture/decisions/NNN-ADR-<slug>.md` | Three-digit, gap-free numbering starting at `001`. Template: [templates/ADR.md](templates/ADR.md). Write an ADR only when the decision is hard to reverse, surprising without context, **and** the result of a real trade-off. |
| `docs/architecture/c4/*.md` | Mermaid `C4Context`, `C4Container`, and one `C4Component` per relevant container, each with prose that explains the diagram. Template: [templates/c4.md](templates/c4.md). |
| `docs/specs/` | Current behavior per capability, in the format of `openspec-format.md`. `changes/` and `changes/archive/` exist (with a `.gitkeep`) even when empty. |
| `GLOSSARY.md` | Domain terms only, no implementation details. Template: [templates/GLOSSARY.md](templates/GLOSSARY.md). |
| `DESIGN.md` | Always present. The design contract consumed by `design-workitem`, `implement-workitem`, `review-workitem`, and `qa-workitem`. Template and section definitions: [templates/DESIGN.md](templates/DESIGN.md). Created and maintained through `ui-design-system`. A repo without UI keeps the file with `Interface: none` and its user-facing message conventions. |
| `README.md` | For humans: purpose, stack, prerequisites, how to run, how to test, environments/deploy, architecture (link to C4), contribution flow (the workitem flow), links to docs. Template: [templates/README.md](templates/README.md). |
| `CLAUDE.md` | Exactly `@AGENTS.md`. If it has other content, move that content into AGENTS.md or a standard, with the developer's OK. |

## 1. Audit

Read the repo before writing anything: manifests (`package.json`, `pyproject.toml`, `go.mod`, `*.csproj`, …), folder layout, CI config, Docker/compose, env examples, existing docs, `git log --oneline -30`.

Produce an audit table: each item of the standard → `ok` / `missing` / `non-compliant` (and why). Also list existing docs that should move into the standard (an old `docs/adr/`, a `CONTRIBUTING.md` full of rules, a design-system folder, a `MASTER.md` from ui-ux-pro-max).

Show the audit and the plan of files to create, move, or edit. Wait for a yes. When the developer passed `--audit`, stop after the table.

## 2. Ask what the code cannot tell

Ask, one question at a time, only what you could not infer:

- Jira project key and project label for this repo (both go into `AGENTS.md` → `## Jira`).
- One-sentence product purpose and the main users, if the README does not say.
- Whether the repo has a UI. If yes, run `ui-design-system` in step 3 for `DESIGN.md`.

## 3. Write

Order: standards → C4 → GLOSSARY → DESIGN → ADRs → specs → README → AGENTS.md (last, because it indexes everything).

- **Existing repo: fill from the code, not placeholders.** Standards describe the conventions the code already follows (formatter, lint, test runner, folder pattern, error handling) plus the harness baseline. C4 reflects the real containers (apps, databases, queues, external systems found in config and env). The glossary takes terms from entity/model names and UI copy. `DESIGN.md` extracts tokens from the Tailwind theme, CSS variables, or the component library config. Retroactive ADRs only for decisions clearly visible and still relevant (framework, database, auth provider) — mark them `Status: Accepted (retroactive)`.
- **New repo:** templates with the developer's answers; leave `<!-- TODO: ... -->` only where a real answer is missing, and list every TODO at the end.
- **Specs in an existing repo:** do not reverse-engineer the whole system. Create `docs/specs/changes/` and `archive/`; write a current spec only for capabilities the developer names as critical. Future changes add the rest through `spec-workitem`.
- Move, don't duplicate: when an existing doc moves into the standard, `git mv` it and leave links working.
- Mermaid must render on GitHub: no HTML in labels, quotes around labels with special characters.

## 4. Idempotency

Running the skill again on a compliant repo changes nothing. When a file exists, edit only the sections that are missing or out of standard; never rewrite content a human wrote. ADR numbers never change once written.

## 5. Finish

- Show `git status` and a summary per file.
- Do not commit unless asked. When asked, use branch `docs/harness` and `docs: adopt documentation harness standard` (see [../../references/git.md](../../references/git.md)).
- List the TODOs left and who should answer them.
