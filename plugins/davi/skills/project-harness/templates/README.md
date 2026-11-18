# <Project name>

<Purpose in 2–3 sentences: problem, users, value.>

## Stack

| Layer | Technology |
|---|---|
| | |

## Prerequisites

- <runtime and version>
- <local services: database, queues, …>
- Environment variables: copy `.env.example` to `.env` and fill it in (<where to get the secrets>).

## Running locally

```bash
<step by step>
```

## Tests

```bash
<full suite>
<coverage / e2e>
```

## Environments and deploy

| Environment | URL | How to deploy |
|---|---|---|
| | | |

## Architecture

Overview in [docs/architecture/c4/](docs/architecture/c4/). Decisions in [docs/architecture/decisions/](docs/architecture/decisions/). Behavior in [docs/specs/](docs/specs/).

## Contributing

1. All work starts from a Jira card (`<KEY>`).
2. The flow follows the `davi` Claude Code plugin: product refinement → design (when there is UI) → technical spec → implementation with review and QA → PR.
3. Code, testing, and git standards: [AGENTS.md](AGENTS.md).

## Documentation

- [AGENTS.md](AGENTS.md): index for people and agents
- [GLOSSARY.md](GLOSSARY.md): domain terms
- [DESIGN.md](DESIGN.md): design system and UI rules
