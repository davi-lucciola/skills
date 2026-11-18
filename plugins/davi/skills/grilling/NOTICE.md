# Notice

The skills `grilling`, `domain-modeling`, `research`, and `prototype` are adapted from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, Copyright (c) 2026 Matt Pocock):

| This plugin | Upstream |
|---|---|
| `skills/grilling/SKILL.md` | `skills/productivity/grilling/SKILL.md` |
| `skills/domain-modeling/SKILL.md` | `skills/engineering/domain-modeling/SKILL.md` |
| `skills/research/SKILL.md` | `skills/engineering/research/SKILL.md` |
| `skills/prototype/SKILL.md` | `skills/engineering/prototype/SKILL.md`, `LOGIC.md`, `UI.md` |

What changed:

- `grilling`: rounds are capped at about five questions, the question format adds options, and the outcome is recorded by the calling skill on the Jira card in pt-BR.
- `domain-modeling`: uses the plugin's `GLOSSARY.md` and ADR templates and `docs/architecture/decisions/`; terms live in the wayfinder map's Notas until a repo exists.
- `research`: runs in a background subagent with Context7 for library docs; the cited write-up is attached to the Jira ticket instead of committed to a `research/` branch, and a pt-BR summary is posted as the resolution comment.
- `prototype`: the UI branch builds variants in Claude Design (the Artifact Design type) with `ui-design-direction` and `ui-ux-pro-max`, instead of a `?variant=` switcher inside the app; the logic branch is a Claude artifact or a `spike/<KEY>-<slug>` branch; the verdict is recorded on the Jira ticket.

The full MIT license text is in `../tdd/NOTICE.md`.
