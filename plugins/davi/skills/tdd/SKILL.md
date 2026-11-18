---
name: tdd
description: "Test-driven development reference for Jira work items: what a good test is, testing only at the seams agreed in design.md, the anti-patterns (implementation-coupled, tautological, horizontal slicing), mocking only at system boundaries, and the red → green loop. Used by spec-workitem to agree seams, by the implementer on every cycle, and by review-workitem to judge tests; also use when the user wants test-first work or mentions red-green-refactor."
---

# Test-driven development

TDD is the red → green loop. This skill is the reference that makes that loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns, and the rules of the loop. Every section applies on every cycle: consult them before and during the loop, not after.

Adapted from `tdd` in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT). See [NOTICE.md](NOTICE.md).

Before writing a test, read `GLOSSARY.md` so test names and interface vocabulary match the project's domain language, and respect the ADRs in the area you're touching.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification: "user can checkout with valid cart" tells you exactly what capability exists, and it survives refactors because it doesn't care about internal structure.

In a work item, the test is named after the Scenario or acceptance criterion it proves (`AC2 — …`), so review and QA can trace it.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals. The vocabulary (module, interface, depth, seam, adapter) is in [seams.md](seams.md).

**Test only at agreed seams.** In the work item flow, the seams are agreed with the developer in `spec-workitem` and recorded in the **Test Seams** section of `design.md`. That record is the confirmation.

- When proposing seams (in `spec-workitem`), ask: "What's the public interface, and which seams should we test?" Give each seam a one-line note on what it catches and what it misses. Prefer existing seams, as high as possible, and as few as possible.
- When implementing, write tests only at the seams in `design.md`. Needing a seam that is not there is a **gap**: report it to the orchestrator instead of adding it silently.
- Without a change folder (standalone use), write down the seams and confirm them with the user before the first test.

## Anti-patterns

- **Implementation-coupled:** mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological:** the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values come from an independent source of truth: a known-good literal, a worked example, the spec's Scenario.
- **Horizontal slicing:** writing all tests first, then all implementation. Bulk tests verify imagined behavior. Work in **vertical slices** instead: one test → one implementation → repeat, each test a tracer bullet that responds to what the last cycle taught you.

## Rules of the loop

- **Red before green.** Write the failing test first, watch it fail for the right reason, then write only enough code to pass it. Don't anticipate future tests or add speculative features (see `davi:ponytail`).
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Bug fixes start red.** A bug (from QA or anywhere else) first gets a regression test that fails on the bug's reproduction. Then the fix, then the test is green.
- **Run often.** The typecheck and the single test file on every cycle, the slice's tests before finishing, the full suite before review.
- **Refactoring is not part of the loop.** Small tidying while green and inside your owned paths is fine. Larger refactors belong to the review stage, as findings or follow-ups.
