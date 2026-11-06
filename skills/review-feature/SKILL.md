---
name: review-feature
description: "Review a feature diff against its contract on two axes, Standards and Spec, and return findings without editing. Use when implement-feature launches a reviewer, or when the user asks to review a feature branch against a contract."
---

# Review a feature

You are the reviewer. Read the contract and the diff. Return a report. The same author fixes the findings. You leave the tree as you found it.

The parent launches you on its own model. The launch rule is [hosts.md](../implement-feature/references/hosts.md).

The diff command is `git diff <base>...HEAD`. Confirm `<base>` resolves and the diff is non-empty before you report. When the ref does not resolve, or the diff is empty, say so and stop.

## Two axes

Report **Standards** and **Spec** under separate headings. A change can pass one and fail the other. Keep them apart so one axis cannot hide the other.

A change can follow every standard and still implement the wrong thing. A change can do what the plan asked and still break a documented rule. Reporting the axes separately keeps one from masking the other.

**Standards.** For each place the diff breaks a rule the repo documents, cite the file and the rule. `CODING_STANDARDS.md` and `CONTRIBUTING.md` count when they exist. A documented repo rule wins over a smell. Skip anything a formatter or a linter already enforces.

Also name a Fowler smell when the diff shows one, and mark it as a judgement. Quote the hunk. Each smell reads what it is, then how to fix it:

- **Mysterious Name**: a function, variable, or type whose name does not reveal what it does or holds. Rename it.
- **Duplicated Code**: the same logic shape appears in more than one hunk or file. Extract the shared shape.
- **Feature Envy**: a method that reaches into another object's data more than its own. Move the method onto the data it envies.
- **Data Clumps**: the same few fields or params keep travelling together. Bundle them into one type.
- **Primitive Obsession**: a primitive or string standing in for a domain concept. Give the concept its own small type.
- **Repeated Switches**: the same `switch` or `if` cascade on the same type recurs. Replace it with one shared path.
- **Shotgun Surgery**: one logical change forces scattered edits across many files. Gather what changes together.
- **Divergent Change**: one file is edited for several unrelated reasons. Split it so each part changes for one reason.
- **Speculative Generality**: abstraction or hooks added for needs the plan does not have. Delete them.
- **Message Chains**: a long `a.b().c().d()` walk the caller should not depend on. Hide the walk behind one method.
- **Middle Man**: a function that mostly delegates onward. Call the real target.
- **Refused Bequest**: an implementer that ignores most of what it inherits. Drop the inheritance.

**Spec.** For each Requirement, Scenario, or contract line that is missing, partial, or implemented wrong, quote that line and the hunk. Name behavior in the diff the plan does not ask for.

## The report

Each finding has the file, the heading (Standards or Spec), and either the documented rule or the Requirement, Scenario, or contract line. Write the report to the path the parent gives, or return it when no path is given.

Done when every finding is under one heading and a clean diff produces an explicit "no findings" under both.

Leave the tree as you found it. The parent decides the fix.
