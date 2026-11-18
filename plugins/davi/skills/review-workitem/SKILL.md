---
name: review-workitem
description: "Review a work item diff against its card, its spec, and the repo standards: an independent pass of hypotheses before reading the author's account, then separate axes (Spec, Standards, Security, Lean, and Design for UI), each finding backed by a concrete case and classified blocker/major/minor, with deepening opportunities as non-blocking follow-ups. Never edits code. Used by the workitem-reviewer agent inside implement-workitem's loop; also runs standalone on a PR (review-workitem <PR#|branch> [--comment])."
---

# Review a work item

You are the reviewer: the second, independent solver. You read; you do not fix. The author fixes the findings. The report and PR comments are in English; a comment on the card is in pt-BR (`jira.md` › Language).

## Inputs

**Inside the loop** (from `implement-workitem`):

- the worktree path
- the change path `docs/specs/changes/<KEY>-<slug>/`
- `<base>`
- the scope: round 1 is `git diff <base>...HEAD`; later rounds are `git diff <sha>..HEAD` plus the previous report
- the report path

**Standalone:** a PR number or a branch.

- Resolve the diff with `gh pr diff <n>` or `git diff <base>...<branch>`.
- Find the Jira key in the branch name, the PR title, or the commits, and read the card (`getJiraIssue`, see [../../references/jira.md](../../references/jira.md)).
- The change lives in `docs/specs/changes/<KEY>-*`. If there is none, the Spec axis uses the card's acceptance criteria. If there is no card either, report "no spec available" on that axis.

Before reviewing, confirm the ref resolves and the diff is non-empty. If it does not, say so and stop. Record `git log <scope> --oneline`.

## Sources

- **Card:** the acceptance criteria and business rules (`getJiraIssue`).
- **Spec:** `proposal.md`, the delta specs (Requirements and Scenarios), `design.md` (decisions, interfaces, **Reuse and non-goals**, **Test Seams**), `tasks.md` (owned paths).
- **Standards:** `AGENTS.md`, every file in `docs/architecture/standards/`, nested `AGENTS.md` files for the touched folders, ADRs in the touched area, `CONTRIBUTING.md` if present. Documented repo rules win over the smell baseline.
- **Tests:** the anti-patterns and seam rules of the `davi:tdd` skill.
- **Lean:** [../ponytail/references/lean-review.md](../ponytail/references/lean-review.md).
- **Design:** for diffs that touch UI, the root `DESIGN.md`, using §3 Tokens, §4 Components, §5 Layout and patterns, §6 Content and voice, §7 Accessibility, and §8 Do / Don't.

## 1. Your own pass first

**Before reading the author's account** (implementer reports, the PR body, commit message bodies, `loop.md`, card comments from `implement-workitem`), read the card's acceptance criteria and the raw diff. Write down 2–4 **hypotheses**: what must be true for this change to be right, and where it would most likely break.

Then read the author's claims and check each one against the code and the test output, the same way you check your own hypotheses. A claim is a lead, not evidence.

## 2. Understand the change

- Read the diff, then the code it touches: the callers of every changed function, the functions it calls, the tests.
- Trace the real flow: where data comes in, what is stored, what goes out.
- When a signature, return value, or behavior changes, **grep every caller**, including callers outside the diff. A change can break code it does not touch.
- Find the expected load (README, `AGENTS.md`, deploy config) and judge scale against it.
- The scope is the diff and what it breaks, never the whole codebase. A hot spot three modules away is not this change's problem.

## 3. Axes

Report each axis under its own heading. A change can pass one axis and fail another, so never merge them.

### Spec

- Each Requirement, Scenario, or AC that is missing, partial, or implemented wrongly: quote that line and the hunk.
- Each Scenario that has no test tracing it (by name or by obvious assertion).
- Behavior in the diff that the spec does not ask for (scope creep).
- Edits outside the owned paths of `tasks.md`, and departures from `design.md` decisions or interfaces.
- Changed behavior that the delta spec does not record.

### Standards

- Each place the diff breaks a documented rule: cite the file and the rule, and quote the hunk.
- Skip anything a formatter or linter already enforces.
- Tests: implementation-coupled tests (mocking internal collaborators, testing private methods, verifying through a side channel), tautological tests, tests away from the seams agreed in `design.md`, and risky logic (a branch, a parser, money, security, a data write, a bug fix) with no test that fails when it breaks.
- Correctness and scale from `lean-review.md` items 1–3: wrong results, missed edge cases (empty, zero, last item, rounding, time zones), broken callers, races, a query per item, unbounded growth.
- Smell baseline. These are judgement calls, `minor` unless clearly costly. Quote the hunk and say how to fix it:
  - Mysterious Name
  - Duplicated Code
  - Feature Envy
  - Data Clumps
  - Primitive Obsession
  - Repeated Switches
  - Shotgun Surgery
  - Divergent Change
  - Speculative Generality
  - Message Chains
  - Middle Man
  - Refused Bequest

### Security

Always present, even when it only says `No findings.` Report only **high-confidence, exploitable** issues in the diff, each with the input or request that exploits it:

- injection: SQL, NoSQL, command, template, LDAP, XPath
- missing or wrong authentication or authorization check, IDOR, tenant isolation broken
- secrets or credentials in code, config, logs, or test fixtures
- unsafe deserialization, eval of user input
- path traversal, SSRF, open redirect
- XSS and unsafe HTML rendering
- weak randomness or crypto for a security purpose
- PII or tokens written to logs or error responses

No theoretical issues, no hardening wish lists, no denial-of-service by volume. An exploitable finding is a `blocker`. A real but hard-to-reach one is `major`.

### Lean

Apply [../ponytail/references/lean-review.md](../ponytail/references/lean-review.md) item 6: delete, reuse, stdlib/native, yagni, merge, split. Check the diff against `design.md` **Reuse and non-goals**: building something listed as not built, or skipping a listed reuse, is a finding.

- `major` only when the diff adds a dependency, abstraction, or config that `design.md` did not agree.
- `minor` otherwise. Lean never reaches `blocker`.
- A `shortcut(<KEY>):` comment that names its limit is a decision, not a finding.
- A simplification that would cut validation, security, data-loss protection, or accessibility is not a finding.

End the section with `Lean: -<N> lines possible.` when it has findings.

### Design (only when UI changed)

- Raw values (colors, sizes, fonts, shadows, durations) instead of `DESIGN.md` §3 tokens.
- New ad-hoc components where a §4 component exists, and missing states (focus-visible, disabled, loading, error, empty).
- Copy that breaks §6 or doesn't use glossary terms.
- Accessibility gaps against §7: labels, focus, contrast, target size, color as the only signal.

## 4. Check before you report

- **No case, no finding.** Every finding names a concrete input or situation and the wrong result it produces. Re-read the lines and confirm that the caller exists, the value can really be empty, and the code really is unused.
- Propose the smallest fix that works. Prefer fixes that delete code.
- No style taste, no "consider", no vague worries.
- **Deepening opportunities** are not findings. The code is correct, but it leaves a shallow module (see `tdd/seams.md`, deletion test), a seam in the wrong place, or behavior spread across call sites. They **never block**. List them under **Follow-ups**, each with a one-line problem and fix, so they can become `tech-debt` cards at ship.

## Severity

| Severity | Use for |
|---|---|
| `blocker` | Breaks a Requirement, Scenario, or AC. An exploitable security hole. Data loss. Build or tests broken. Violates an ADR. |
| `major` | A documented standard is broken. A Scenario has no test, or risky logic has none. A real defect or costly smell that can be fixed inside the slice. A Design token or accessibility violation. A security issue that is real but hard to reach. A dependency, abstraction, or config `design.md` did not agree. |
| `minor` | Judgement call, naming, a nice-to-have, other Lean findings. This does not reopen the loop. |
| follow-up | Deepening opportunity. Never reopens the loop. |

On a re-check round, first verify each previous finding. Mark it `fixed`, `not fixed`, or `regressed`. Then review only the new diff. Don't reopen anything listed under `✅ Verified` in an earlier round unless the new diff touches it.

## Report

```markdown
# Review <KEY>, round <N>

Scope: <git range>, <n> commits. Load assumed: <one line>

## Hypotheses
1. <what must be true> → <held / broke: see P1>

## Spec
- [P1][blocker] `path/file.ts:10`: Scenario "AC2 — …" not implemented
  > <spec line>
  > <hunk>
  Case: <input or situation> → <wrong result>
  Fix: <one line>

## Standards
- [S1][major] `path/file.ts:42`: <rule> (`docs/architecture/standards/code.md#R3`)
  > <hunk>
  Case: <…>
  Fix: <one line>

## Security
No findings.

## Lean
- [L1][minor] `path/util.ts:5-30`: reimplements `formatMoney` from `src/lib/money.ts`
  Fix: call the existing helper. Lean: -25 lines possible.

## Design
- (none, no UI changed)

## Follow-ups
- [F1] `src/orders/`: pricing rules spread across three call sites. Fix: move them behind `PriceQuote`.

## Previous findings
- S1 (round 1): fixed

✅ Verified: <hypotheses and author claims that held, each with file:line or the command that showed it>

Summary: Spec <b/M/m>, Standards <b/M/m>, Security <b/M/m>, Lean <M/m>, Design <b/M/m>, Follow-ups <n>. Worst: <id>, <one line>.
```

A clean axis says `No findings.` explicitly. Write the report to the given path, or return it.

## Standalone `--comment`

Show the findings first. On a yes, post them as a PR review:

- Use `gh pr review <n> --comment --body-file <report>` for the summary.
- Add line comments through `gh api repos/{owner}/{repo}/pulls/<n>/comments` for findings that have a line.
- Never use `--approve` or `--request-changes`. That call belongs to a human.
- When the card is known, comment on it too: `**[review-workitem]** Review avulso: <resumo em uma linha>`, with the PR link.
