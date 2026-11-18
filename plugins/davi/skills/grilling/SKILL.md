---
name: grilling
description: "Interview primitive: map the open decisions of a plan, idea, or card as a tree, then ask the frontier in numbered rounds, each question with a recommended answer, until shared understanding. Facts are looked up by subagents; decisions stay with the humans. Used by wayfind-workitem (chart, and Decisão tickets), refine-workitem, and spec-workitem; also use when the user says grill me, interview me, or wants a plan stress-tested."
---

# Grilling

You interview the developer (and the PO when present) until both sides understand the plan the same way. You never answer a decision on the human's behalf.

Adapted from `grilling` in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT). See [NOTICE.md](NOTICE.md).

Pair it with [`domain-modeling`](../domain-modeling/SKILL.md) whenever terms of the domain are in play, which is almost always.

## Loop

1. **Map the decisions** behind the plan as a tree: each decision with the decisions it depends on. Read what already answers some of them first: the card, `GLOSSARY.md`, the specs, the ADRs, the wayfinder map's Decisions so far.
2. **Compute the frontier:** the open decisions whose prerequisites are settled.
3. **Ask the whole frontier as one numbered round**, at most about five questions. Each one carries your recommended answer, worded so that "yes" accepts it:

   ```markdown
   ❓ **Q1 — <short title>**: <the question, with the context needed to answer it>
   ➡ <recommended answer, and the reason in one line>
   ```

   When a question has a few real options, list them as `a)`, `b)`, `c)`, with the recommended one first.
4. **Wait** for the answers. Recompute the frontier. Questions that depend on a still-open question wait for a later round.
5. **Facts are your job.** When a question is about a fact (what the code does, what an API allows, what a document says), do not ask the human: dispatch a fresh-context subagent (`Explore` for code, `general-purpose` with Context7 for libraries) in the background, and keep asking the rest of the frontier meanwhile.
6. **Stop** when the frontier is empty and every branch is visited. Summarize the decisions as a short list and get a "yes, that's it" before anything is written or built.

## Rules

- Decisions go to the humans; facts go to subagents. If you are not sure which one it is, ask.
- One round at a time. Never dump the whole tree.
- Challenge, don't agree by default: invent edge cases (zero, many, concurrent, cancelled midway, a different permission, a retry after failure) that stress each answer.
- When an answer contradicts the code, a spec, or an ADR, show the contradiction and ask which side wins.
- Speak in the language the developer writes in. What is written to Jira follows [../../references/jira.md](../../references/jira.md) › Language (pt-BR on root cards).
- This skill writes nothing by itself. The calling skill records the outcome: the card, the resolution comment, `GLOSSARY.md` (through `domain-modeling`).
