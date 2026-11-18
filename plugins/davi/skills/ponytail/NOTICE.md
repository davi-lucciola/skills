# Notice

This skill is adapted from [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail), licensed under MIT. The original license is in [LICENSE](LICENSE).

| Upstream | Here |
|---|---|
| `skills/ponytail/SKILL.md` | `SKILL.md` |
| `skills/ponytail-review/SKILL.md` | `references/lean-review.md` |
| `skills/ponytail-debt/SKILL.md` | `references/debt.md` |

What changed:
- The ladder's "already in this codebase" rung also checks `DESIGN.md` §4, `GLOSSARY.md`, ADRs, and the repo standards.
- The scope is the Jira work item and its OpenSpec-style change.
- The shortcut marker can carry the card key: `shortcut(<KEY>):`.
- Tests point to the agreed seams of `davi:tdd`.
- The always-on session mode, the band, hooks, status line, benchmarks, `ponytail-audit`, `ponytail-gain`, and `ponytail-help` were not ported.
- The review findings plug into the severity scale of `review-workitem`.
