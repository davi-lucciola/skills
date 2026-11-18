# Lean review

How `review-workitem` (and any standalone review) applies ponytail to a diff. Adapted from `ponytail-review` in [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) (MIT).

Review like the senior developer who will be paged when it breaks. Order of importance: correct, safe, holds under load, tested, fast, lean.

## Understand first

- Read the diff, then the code it touches: callers of every changed function, the functions it calls, the tests.
- Trace the real flow: where data comes in, what is stored, what goes out.
- A change can break code it does not touch. When a signature, return value, or behavior changes, **grep every caller**, including those outside the diff.
- Find the expected load (README, `AGENTS.md`, deploy config): one person running a script, or many users and processes at once. Judge scale against that, and say which load you assumed.

## Look for

1. **Bug:** wrong result, crash, missed edge case (empty, zero, last item, rounding, time zones), a caller broken by the change, a fix applied in one caller while the shared function stays broken.
2. **Risk:** security holes, data loss (errors swallowed, writes in the wrong order, no transaction).
3. **Scale:** fine for one user, wrong for many: check-then-write races, the same work done by every process, memory or lists that only grow, a query per item, O(n²) on big input, per-process state that must be shared.
4. **Missing test:** risky new logic (a branch, a parser, money, security, data writes, a bug fix) with no test that fails when it breaks.
5. **Speed:** big slowdowns are problems. Small wins are suggestions.
6. **Lean:** code that should not exist or should be smaller.
   - **delete:** dead code, unused options, speculative features
   - **reuse:** the repo already has this helper or `DESIGN.md` component (name the path)
   - **stdlib / native:** the standard library or platform already does it; a new dependency for a few lines
   - **yagni:** an abstraction with one implementation, config nobody sets
   - **merge:** near-copies that must change together
   - **split:** one function doing several unrelated jobs. Split by job, never by line count.

Items 1–4 belong to the Spec, Standards, and Security axes of `review-workitem`. Item 6 is the **Lean** axis.

## Check before you report

- **No case, no finding.** Every finding needs a concrete case: "this input or situation leads to this wrong result". Re-read the lines and confirm that the caller exists, the value can really be empty, and the code really is unused.
- A `shortcut(<KEY>):` or `shortcut:` comment that names its limit is a decision, not a finding, unless the expected load already crosses it.
- Propose the smallest fix that works. Prefer fixes that delete code. Never add layers, frameworks, or config the problem does not need.
- A simplification that would cut validation, security, data-loss protection, or accessibility is not a finding.
- No style taste, no "consider", no vague worries.

## Writing a finding

Plain English, short sentences. Each finding has four parts of one or two sentences each:

- **What this is:** what the code does.
- **Problem:** the concrete case that goes wrong.
- **Fix:** the smallest fix.
- **If we skip it:** the consequence.

End a lean section with `Lean: -<N> lines possible.` when lean findings exist.
