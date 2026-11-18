# Agent loops

`implement-workitem` runs two loops: **implement ⇄ review** and **implement ⇄ QA**. Both follow these rules.

## Budget

- At most `loops.maxRounds` rounds per loop (default **5**, from `~/.claude/davi.json`). A round is one fix plus one re-check.
- The counters are separate: 5 review rounds, then up to 5 QA rounds. A QA fix that goes through review again does not consume a review round.

## Stop conditions

Stop the loop and hand control back to the developer when any of these is true:

1. The round budget is spent and blocking findings or bugs remain.
2. **The same finding or bug comes back twice.** Same means same file and rule, or same Requirement/Scenario, or same reproduction command, even if worded differently.
3. A fix would need to edit outside the slice's owned paths, change the spec, or contradict an ADR. That is a decision, not a fix.
4. The reviewer or QA agent cannot run (missing tool, app does not start, MCP not connected).

On stop: leave the card in its current status, block it with the template in [blocked.md](blocked.md) (open items, evidence, owner, what would unblock it), keep the PR in draft, and tell the developer exactly what you need.

## Severity

Only **blocking** items reopen the loop. The reviewer and QA classify every item:

| Severity | Meaning | Loop? |
|---|---|---|
| `blocker` | Violates a Requirement, Scenario, or acceptance criterion, an ADR, or a documented standard. An exploitable security hole. Data loss. Breaks the build or the tests | Yes |
| `major` | Clear defect or smell with real cost, fixable inside the slice. A Scenario without a test. A design token or accessibility violation. A dependency, abstraction, or config the `design.md` did not agree (Lean) | Yes |
| `minor` | Judgement call, naming, style beyond the linter, other Lean findings | No: listed in the PR |
| follow-up | Deepening opportunity: correct code, but a shallow module or a seam in the wrong place | Never: listed in the PR, and offered as a "Dívida técnica" Habilitador card at ship |

## Who fixes

The same author fixes. When the parent session wrote the code, the parent fixes it. When a `workitem-implementer` subagent wrote a slice, resume that subagent by its id (SendMessage) with the findings; launch a fresh one only when it cannot be resumed.

## What is re-checked

- Review rounds after the first review only the fix diff: `git diff <last-reviewed-sha>..HEAD`, plus the list of findings it claims to fix.
- QA rounds re-run the failed cases, plus a smoke pass over the main happy path. A QA fix also gets one review round on its diff before QA re-runs.
- Every fix for a QA bug adds a regression test that is red before the fix and green after.

## Recording

After each round, append to `.workitem-evidence/<KEY>/loop.md`:

```markdown
## Review round N — <date>
- Findings: <n blocker> / <n major> / <n minor>
- Fixed: <ids>
- Commit: <sha>
```

and comment on the Jira card with the same summary in pt-BR (header `**[implement-workitem] Review rodada N**` or `**[implement-workitem] QA rodada N**`).

The card comment is the record of truth (see "Jira is the source of truth" in [jira.md](jira.md)). When `implement-workitem` resumes, it counts the rounds from the card's comments. If `loop.md` is missing or disagrees, it rebuilds `loop.md` from the card.
