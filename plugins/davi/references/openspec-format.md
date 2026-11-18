# Spec format (OpenSpec, adapted)

Specs in this flow follow the [OpenSpec](https://github.com/Fission-AI/OpenSpec) spec-driven format. They are adapted to live under `docs/specs/` and are used **without the OpenSpec CLI**. All spec content is written in English.

## Layout

```
docs/specs/
├── <capability>/spec.md                    # current truth, one per capability
└── changes/
    ├── <KEY>-<slug>/                       # one change in flight (KEY = Jira card)
    │   ├── proposal.md
    │   ├── design.md                       # always: at least Reuse and non-goals + Test Seams
    │   ├── tasks.md
    │   └── specs/<capability>/spec.md      # delta spec, one per touched capability
    └── archive/YYYY-MM-DD-<KEY>-<slug>/    # finished changes, moved by ship-workitem
```

A **capability** is a cohesive area of behavior named in kebab-case, such as `authentication`, `checkout`, or `sales-report`. Capabilities can be nested, as in `payments/pix`. Prefer extending an existing capability over creating a new one.

## Current spec: `docs/specs/<capability>/spec.md`

```markdown
# <Capability>

## Purpose
<Why this capability exists and for whom, in 2–4 sentences. At least 50 characters.>

## Requirements

### Requirement: <Requirement name>
The system SHALL <observable behavior>.

#### Scenario: <Scenario name>
- **GIVEN** <initial state> (optional)
- **WHEN** <action or condition>
- **THEN** <observable result>
- **AND** <additional result> (optional)
```

Rules:

- `SHALL` and `MUST` are absolute. `SHOULD` allows a stated exception. `MAY` is optional.
- Every requirement has at least one scenario. Every scenario has a WHEN and a THEN.
- Scenarios use exactly four hashes: `#### Scenario:`. Three hashes or a bullet breaks parsing.
- Keep a requirement body to about 500 characters. Split anything larger.
- Describe behavior only. File paths, class names, and library choices belong in `design.md`.
- Use the vocabulary of `GLOSSARY.md`.

## Change: `docs/specs/changes/<KEY>-<slug>/`

### `proposal.md`

```markdown
# Proposal: <title>

Jira: [<KEY>](https://<site>/browse/<KEY>)

## Why
<1–2 sentences: the problem or opportunity.>

## What Changes
- <change 1>
- <change 2> **BREAKING** when it breaks a contract

## Capabilities
### New Capabilities
- `<capability>`: <short description>
### Modified Capabilities
- `<capability>`: <what changes>

## Impact
<Code, APIs, data, integrations, and teams affected.>
```

### `design.md`

Always write it. When there is no real technical decision, it holds only **Reuse and non-goals** and **Test Seams**, the two sections `implement-workitem` and `review-workitem` rely on.

```markdown
# Design: <title>

## Context
## Goals / Non-Goals
## Decisions
### D1 — <decision>
<Choice, alternatives considered, why.>
## Reuse and non-goals
<The ponytail ladder applied to the change (see the `ponytail` skill):>
- Reused: <helper, component, or pattern> (`path/to/it`)
- Platform / stdlib: <what the language, framework, or browser already gives>
- Not built: <option, abstraction, or feature deliberately left out, and why>
- New dependencies: <none, or each one with why the lower rungs did not hold>
## Test Seams
<Where the behavior will be tested (see the `tdd` skill, seams.md). Highest seam possible, as few as possible. One line each on what it catches and what it misses. System boundaries that tests may fake.>
## Risks / Trade-offs
- [Risk] → Mitigation
## Migration Plan
## Open Questions
```

Some decisions also become an ADR in `docs/architecture/decisions/`. That applies when a decision is hard to reverse, surprising without context, and the result of a real trade-off. Link the ADR from `design.md`.

### `tasks.md`: the implementation graph

`implement-workitem` reads this file as a dependency graph. Each `##` group is a **slice**: a vertical piece that can be verified on its own and fits in one fresh context window.

```markdown
# Tasks: <KEY> <title>

## 1. <Slice>
<!-- depends: none | owns: src/module-a/**, tests/module-a/** | jira: ABC-124 -->
- [ ] 1.1 <task> — verify: <command or test>
- [ ] 1.2 <task> — verify: <command or test>

## 2. <Slice>
<!-- depends: 1 | owns: src/module-b/** | jira: ABC-125 -->
- [ ] 2.1 <task> — verify: <...>
```

- `depends:` lists the group numbers that must be merged first, or `none`.
- `jira:` is the key of the group's Subtask, written by `spec-workitem` once the Subtask exists.
- `owns:` lists the path globs the slice may edit. Two slices that run in parallel never share an owned path.
- Each task states how it is verified.
- Prefactoring goes in the first group: make the change easy, then make the easy change.
- Implementers tick `- [x]` as they finish each task.

### Delta spec: `specs/<capability>/spec.md`

```markdown
# Delta: <capability>

## Purpose
<New capability only.>

## ADDED Requirements
### Requirement: <name>
The system SHALL …
#### Scenario: <name>
- **WHEN** …
- **THEN** …

## MODIFIED Requirements
### Requirement: <name exactly as in the current spec>
<The full block with ALL scenarios, already edited.>

## REMOVED Requirements
### Requirement: <name>
**Reason**: <why>
**Migration**: <what to use instead>

## RENAMED Requirements
- FROM: `### Requirement: <old name>`
- TO: `### Requirement: <new name>`
```

- Include only the operations you use. Leave out empty headings.
- MODIFIED copies the whole requirement block. A partial block loses scenarios at archive time.

## Applying deltas (archive)

`ship-workitem` does this step. Apply each delta `changes/<change>/specs/<capability>/spec.md` in this order: RENAMED, REMOVED, MODIFIED, ADDED.

1. RENAMED: rename the header in the current spec.
2. REMOVED: delete the requirement block.
3. MODIFIED: replace the whole block whose header matches.
4. ADDED: append the block under `## Requirements`. For a new capability, create `docs/specs/<capability>/spec.md` with the delta's `## Purpose`.

If a header does not match exactly, stop the archive and report the mismatch. When every delta is applied, move the change folder to `changes/archive/YYYY-MM-DD-<KEY>-<slug>/`.
