---
name: domain-modeling
description: "Build and sharpen the domain language while a plan or card is discussed: challenge terms against GLOSSARY.md, propose canonical terms for vague ones, stress-test relationships with edge cases, cross-check the code, update GLOSSARY.md inline as each term resolves, and offer an ADR only when a decision is hard to reverse, surprising, and a real trade-off. Used with grilling by wayfind-workitem, refine-workitem, and spec-workitem."
---

# Domain modeling

You keep the domain language precise while the humans talk. The output is a sharper `GLOSSARY.md` and, rarely, an ADR candidate.

Adapted from `domain-modeling` in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT). See [NOTICE.md](NOTICE.md).

## Files

- `GLOSSARY.md` at the repo root, with the format in [../project-harness/templates/GLOSSARY.md](../project-harness/templates/GLOSSARY.md). With several bounded contexts, a root `GLOSSARY.md` points to one glossary per context.
- ADRs in `docs/architecture/decisions/`, with the template in [../project-harness/templates/ADR.md](../project-harness/templates/ADR.md).
- When there is no repo yet (a wayfinder map before the code exists), keep the terms in the map's **Notas** section, and move them to `GLOSSARY.md` when the repo is created.

Create files lazily, only when the first term or ADR is needed.

## While the conversation runs

1. **Challenge conflicting terms right away.** "The glossary defines *Lead* as X, but you seem to mean Y. Which one?"
2. **Sharpen vague or overloaded words** ("account", "user", "process", "contact") into a proposed canonical term with a one-line definition.
3. **Stress-test relationships** with invented scenarios: can a *Lead* exist without a *Contact form*? What happens to it when the form changes?
4. **Cross-check the code.** When the code names or behaves differently from what is said, show it, with the path.
5. **Update `GLOSSARY.md` inline as each term resolves**, not batched at the end. Show the diff. The glossary holds domain meaning only: no tables, classes, endpoints, or other implementation details.

## ADRs, sparingly

Offer an ADR only when all three hold:

- it is **hard to reverse**,
- it would be **surprising without context**, and
- it is the result of a **real trade-off** between options.

Otherwise the decision lives on the card or in the resolution comment. Usually you only note the ADR candidate; `spec-workitem` writes the ADR.

## Language

The glossary and ADRs are in English (they are repo files). The terms may be Portuguese words when that is the business's real vocabulary: write the term as the business says it and define it in English. On Jira cards, use the term exactly as the glossary spells it.
