---
name: design-workitem
description: "Design the UI of a Jira work item as a clickable prototype published as a Claude artifact, built strictly on the project's DESIGN.md, and link it on the card. Resolves the UI Protótipo ticket that blocks the work item. Use during product refinement when the item has UI work (refine-workitem calls it), or when the user asks for the design of a card."
---

# Design a work item

Input: a Jira card key, such as `ABC-123`: the work item (Story, Bug, Habilitador), or the UI **Protótipo** ticket that blocks it. If there is none, ask for it.

UI work on a work item is tracked as a **Protótipo** refinement ticket that blocks the work item (`jira.md` › Refinement tickets). This skill resolves it. When the work item has no such ticket yet, create one first (title "Telas de <item>", `## Pergunta` "Como ficam as telas de <item>?", project label, `wayfinder:task`, "blocks" link to the work item), after a yes.

You turn the card's acceptance criteria into screens that the PO can click through and approve before any technical refinement starts. The result is a Claude artifact linked on the card. Any new design decision is recorded in `DESIGN.md`.

Read before starting:

- [../../references/jira.md](../../references/jira.md), especially **Jira is the source of truth**
- the project's root `DESIGN.md`, in full

**Status gate:** the work item must be in **Refinamento Produto**, and its UI Protótipo in **A Fazer** or **Desenvolvendo**. Another status means the design is out of order: say so and ask before continuing. On start, assign the Protótipo to the developer, move it to **Desenvolvendo**, and comment `**[design-workitem]** Design iniciado` on both cards (pt-BR, `jira.md` › Language). Link every prototype version on the Protótipo as it is published.

## `DESIGN.md` is the contract

`DESIGN.md` sits at the repo root, next to `AGENTS.md`. Its sections are defined in [../project-harness/templates/DESIGN.md](../project-harness/templates/DESIGN.md). This skill uses each section as follows:

| § | Section | How this skill uses it |
|---|---|---|
| Header | Interface, UI stack, token source, prototypes | Pick the components and icons from the named stack. Add the artifact link under "Prototypes". |
| 1 | Product and audience | Device and context decide the primary viewport. |
| 2 | Aesthetic direction | Follow it. Do not invent a new one. |
| 3 | Tokens (color, typography, spacing, radius, elevation, motion, breakpoints) | Every value in the prototype is a token. The artifact declares them as CSS variables with the same names. |
| 4 | Components | Reuse the existing components with their variants and states. |
| 5 | Layout and patterns | Use the established page pattern. Every data view shows its loading, empty, and error states. |
| 6 | Content and voice | Microcopy rules. Use real terms from `GLOSSARY.md`. |
| 7 | Accessibility | Focus, target size, labels, contrast. |
| 8 | Do / Don't | Check the screens against it before publishing. |
| 9 | Decision log | Add one line for every new token, component, or pattern, with this card's key. |

If `DESIGN.md` is missing or its §2–§3 are empty, run `ui-design-system` first: Mode 1 for a new UI, Mode 2 when the UI already exists in code. Come back here after.

## 1. Understand the screens

1. Read the card (`getJiraIssue`): the acceptance criteria, business rules, and the Design section.
2. Read the existing screens the card touches, in the code or in earlier prototypes linked in `DESIGN.md`.
3. List the screens and states the card needs, one per acceptance criterion at least, including the empty, error, loading, and permission-denied states where they apply.
4. Confirm the list with the PO before drawing.

## 2. Draft

- Apply `ui-design-direction` Mode B: the most characteristic element first, structure that carries information, and restrained motion.
- Use `ui-ux-pro-max` only for focused questions: `--domain ux` for an interaction, `--domain chart` for a data view, and `--stack` for component behavior. The answers are adapted to `DESIGN.md`. They never override it.
- If a screen needs a token or component that `DESIGN.md` lacks, call `ui-design-system` Mode 3. Then use the returned names.

## 3. Build the prototype artifact

- Build it in **Claude Design**, like `davi:prototype`'s UI branch: run the Artifact `quickstart` with `intent: "design"`, create the artifact from the Design type it names, and follow that type's instructions. When the Design type is not available on the account, fall back to the `artifact-design` skill and one HTML artifact.
- When an earlier Protótipo (a wayfinder direction ticket, already in Concluído) chose a visual direction, start from the chosen variant.
- One artifact. It declares `DESIGN.md` §3 tokens as CSS variables with the same names, and it has light and dark themes when §3.1 defines both.
- The screens are navigable: tabs, frames, or a flow for each screen and state, with real pt-BR copy from the card and the glossary.
- It works at phone width and at the primary viewport from §1.
- Title: `<KEY> — <short screen name>`.

Before publishing, check: no raw values outside tokens, every acceptance criterion visible somewhere, §8 Do / Don't respected, and keyboard focus visible.

## 4. Review with the PO

1. Publish the artifact and share the link.
2. Watch its comments (`ArtifactComments`) and iterate. Republish to the same URL so the link stays stable.
3. Stop when the PO approves, or after the PO says what is still open.

## 5. Record

After showing each text and getting a yes:

1. **Work item:** fill the `## Design` section of the description with the artifact link, the screen list, and the decisions that changed `DESIGN.md`. Comment `**[design-workitem]** Design aprovado: <link>`.
2. **Protótipo:** post the resolution comment (`wayfind-workitem` › `references/map.md` › Resolution comment, with `**[design-workitem]**` as the header), attach a screenshot of each approved screen (`<KEY>-design-<screen>.png`, `jira.md` › Evidence on the card), and move it to **Concluído**. That unblocks the work item.
3. **`DESIGN.md`:** add the prototype link to the header, the §4/§5 additions (already made through `ui-design-system`), and the §9 lines with the card key.
4. Return to `refine-workitem`, which finishes refinement and moves the card to **A Fazer**.

Commit `DESIGN.md` changes only when the developer asks. They usually ride along with the spec in `spec-workitem`'s branch.
