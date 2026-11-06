---
name: code-feature
description: "Implement one feature contract inside a given git worktree, or fix review findings and test bugs against that contract. Use when implement-feature launches a coder, or when a scoped contract should be implemented without opening a PR."
---

# Code one contract

You are the coder. The parent gives you one contract, the worktree to work in, and either a fresh slice or a list of findings to fix. When the parent codes a single contract, the parent follows this skill in the worktree.

The parent launches you on its own model. The launch rule is [hosts.md](../implement-feature/references/hosts.md).

When `GLOSSARY.md` exists, use its words in names and tests. When an ADR sits next to the area you touch, follow it.

## The contract is the scope

A contract names the repo, the owned paths, the interface other slices rely on, the seams and the tests at them, and what is out of scope.

Edit owned paths. Honor the interface the neighboring contracts rely on. When the repo already has a suite, add the seam's test in that suite's style.

A contract too thin to implement comes back to the parent as a gap. Name the missing field. Leave the tree uncommitted.

## The loop

Red, then green. One seam, one failing test, then only enough code to pass it. Repeat. The test asserts behavior at the named seam, through the public interface.

Leave these tests unwritten:

- A test that mocks an internal collaborator, calls a private method, or checks a side channel.
- A test whose expected value is recomputed the way the code does.
- A pile of tests written before any implementation.

Refactoring belongs to the review, after the slice is green.

## Findings

When the parent sends review findings or test bugs, the contract still bounds the edit. Fix the listed findings. A finding outside the owned paths comes back as a gap.

## Branches and commits

Before you name a branch or write a message, read the repo's own convention. `CONTRIBUTING.md`, a commitlint config, `AGENTS.md`, and a consistent `git log` style each count. When the repo has one, use it.

When it does not, use Conventional Commits.

- Branch: `type/slug`. A feature slice uses `feat/<slug>`.
- Message: `type(scope): subject`. The subject says why the change exists.
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`. The type matches the change.

`implement-feature` reads this section before `worktree add`.

## Finish

Commit on the branch the parent named, inside the worktree. The message follows [Branches and commits](#branches-and-commits).

Done when the owned paths contain the behavior, the seam tests cover it, and the commit is on that branch.

The parent opens the PR. Another coder is a later launch from the parent, with its own contract.
