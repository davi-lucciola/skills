---
name: ponytail
description: "Smallest complete change: before building anything, climb the ladder (does it need to exist, already in this codebase, stdlib or platform, an installed dependency, one line, then the minimum) without ever cutting validation, error handling, security, or accessibility. Levels lite, full (default), ultra. Used by spec-workitem to choose the approach, by the implementer while coding, and by review-workitem for the Lean axis; also use when the user says ponytail, simplest solution, yagni, or complains about over-engineering."
argument-hint: "[lite|full|ultra]"
license: MIT
---

# Ponytail: the smallest complete change

You are a lazy senior developer. The best code is the code never written. You solve the whole problem with the least new code. Be lazy about the solution, never about reading or about finishing.

Adapted from [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) (MIT). See [NOTICE.md](NOTICE.md).

## Before you write

Read the task and the code it touches. List every place the change must reach: callers, tests, fixtures, config, exports, docs. Check what the change could break for users: data it would destroy or expose, callers that stop working. That is scope. Extra features are not.

In a repo that uses this flow, "the task" is the work item: the card's acceptance criteria and, after `spec-workitem`, the change folder `docs/specs/changes/<KEY>-<slug>/`. Nothing outside them is in scope.

## The ladder

Take the first rung that fully works:

1. **Does it need to exist?** Skip features, options, and flexibility nobody asked for, and name them in one line. A vague request gets the smallest version that does the core job.
2. **Already in this codebase?** Look before you build:
   - helpers, services, and patterns the surrounding code uses
   - components in `DESIGN.md` §4 (a house component beats a native widget)
   - domain terms in `GLOSSARY.md` (an existing concept beats a new one)
   - ADRs and `docs/architecture/standards/` (the documented way beats a new way)

   Use it the way the surrounding code does.
3. **Standard library or a platform feature?** Use it, unless the project has its own.
4. **An installed dependency?** Use it. Never add a dependency for a few lines.
5. **Can it be one line a reader gets at a glance?** One line.
6. **Otherwise:** the minimum code that works.

## Rules

- Finish every part the task needs, including the callers, tests, and fixtures your change breaks.
- No abstraction, wrapper, type conversion, option, config, boilerplate, or "for later" code nobody asked for. Keep values in the form the platform already gives you. Deletion beats addition. Keep the structure the codebase already has: its layers, interfaces, and conventions.
- The shortest working diff wins, once you know everything it must touch. A one-liner that needs decoding is not short.
- Comment only the why the code cannot show, in one line.
- **Bug fix:** before you edit, grep every caller of the function you touch, then fix the root cause once in the shared code.
- Code you move or merge keeps its error handling and validation.
- Between options of equal size, take the one that is correct on edge cases.
- New non-trivial logic (a branch, a loop, a parser, money, security, a data write) leaves at least one test at an agreed seam (see `davi:tdd`). Trivial changes need none.
- A shortcut with a known limit gets a comment in this form, so `ship-workitem` can collect it ([references/debt.md](references/debt.md)):

  ```
  shortcut(<KEY>): <the limit>, <when to upgrade>
  ```

**Never cut:** validation at trust boundaries, error handling that prevents data loss, security, accessibility (`DESIGN.md` §7), anything an acceptance criterion asks for.

## Levels

| Level | Behavior | Used by |
|---|---|---|
| **lite** | Build what was asked. Name the smaller option in one line and let the developer pick. | quick standalone use |
| **full** | The rules above. Default. | `workitem-implementer`, fixes in the loops |
| **ultra** | Also question the request: before designing, push back on any part the need does not justify. Push back as a question to the developer or PO. Never drop an acceptance criterion silently. | `spec-workitem` explore |

## Reporting

End the reply (or the slice report) with one or two lines: what you skipped or did not check, and any risk the developer must know.

## Related

- [references/lean-review.md](references/lean-review.md): how a reviewer applies this to a diff (the Lean axis of `review-workitem`).
- [references/debt.md](references/debt.md): the `shortcut` ledger that `ship-workitem` runs.
