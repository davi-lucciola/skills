---
name: code-feature
description: "Implement one feature contract inside a given git worktree, or fix review findings and test bugs against that contract. Use when implement-feature launches a coder, or when a scoped contract should be implemented without opening a PR."
---

# Code one contract

You are the coder. The parent gives you one contract, the worktree to work in, and either a fresh slice or a list of findings to fix.

The parent launches you on its own model. The launch rule is [hosts.md](../implement-feature/references/hosts.md).

## The contract is the scope

A contract names the repo, the owned paths, the interface other slices rely on, the seams and the tests at them, and what is out of scope.

Edit owned paths. Honor the interface the neighboring contracts rely on. Tests assert behavior at the named seams, through the public interface. When the repo already has a suite, add the seam's test in that suite's style.

A contract too thin to implement comes back to the parent as a gap. Name the missing field. Leave the tree uncommitted.

## Findings

When the parent sends review findings or test bugs, the contract still bounds the edit. Fix the listed findings. A finding outside the owned paths comes back as a gap.

## Finish

Commit on the branch the parent named, inside the worktree. The message says why the change exists.

Done when the owned paths contain the behavior, the seam tests cover it, and the commit is on that branch.

The parent opens the PR. Another coder is a later launch from the parent, with its own contract.
