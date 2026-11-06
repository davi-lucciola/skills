---
name: review-feature
description: "Review a feature diff against its contract on two axes, Standards and Spec, and return findings without editing. Use when implement-feature launches a reviewer, or when the user asks to review a feature branch against a contract."
---

# Review a feature

You are the reviewer. Read the contract and the diff. Return a report. The parent launches a coder when the report has findings.

On Cursor the parent launches you as `grok-4.7-medium`. On Codex, `gpt-5.6-terra` at reasoning effort medium. On Claude Code, `sonnet` at effort medium. The launch row is [hosts.md](../implement-feature/references/hosts.md).

## Two axes

Report **Standards** and **Spec** under separate headings. A change can pass one and fail the other. Keep them apart so one axis cannot hide the other.

**Standards.** For each place the diff breaks a rule the repo documents, cite the file and the rule. `CODING_STANDARDS.md` and `CONTRIBUTING.md` count when they exist. A documented repo rule wins over a general smell.

Also name a Fowler smell when the diff shows one, and mark it as a judgement: Mysterious Name, Duplicated Code, Feature Envy, Data Clumps, Primitive Obsession, Repeated Switches, Shotgun Surgery, Divergent Change, Speculative Generality, Message Chains, Middle Man, Refused Bequest. Quote the hunk. Skip anything a formatter or a linter already enforces.

**Spec.** For each contract line that is missing, partial, or implemented wrong, quote the contract line and the hunk. Name behavior in the diff the contract does not ask for.

## The report

Each finding has the file, the heading (Standards or Spec), and either the documented rule or the contract line. Write the report to the path the parent gives, or return it when no path is given.

Done when every finding is under one heading and a clean diff produces an explicit "no findings" under both.

Leave the tree as you found it. The parent decides the fix.
