---
name: prototype
description: "Build a cheap, throwaway prototype that answers a design question so the humans can react to something concrete: for UI, structurally different variants in Claude Design (a Claude artifact made from the Design type) guided by ui-design-direction and ui-ux-pro-max; for logic or state, one self-contained interactive HTML artifact or a spike branch. Links it on the Jira card. Used by wayfind-workitem for Protótipo tickets; also use when the user asks for a prototype, mockup, or spike to decide how something should look or behave."
---

# Prototype

A prototype answers **one** question ("how should the home page lead with the offer?", "does this lead state model feel right?"). It is cheap, rough where roughness doesn't matter, and thrown away once the answer is recorded. It is not the delivery design: `design-workitem` does that for a refined card, on top of `DESIGN.md`.

Adapted from `prototype` in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT), with the UI branch moved to Claude Design. See [NOTICE.md](NOTICE.md).

Input: the `## Pergunta` of a **Protótipo** ticket, the work item(s) it blocks (their Contexto and candidate criteria), the map's Notas, and the decisions it builds on. A Protótipo that asks "how do the screens of this work item look" is the delivery design: hand it to `design-workitem` instead.

## Pick the branch

- "What should this look like / how should the page or screen be organized?" → **UI**.
- "Does this logic, flow, or state model feel right?" → **Logic**.
- When ambiguous, choose by location (a page or component → UI; a rule, a backend flow → Logic) and state the assumption at the top of the prototype.

## UI: Claude Design

1. **State the question** and pick the variants: 3 by default, at most 5. Variants differ in **structure** (layout, hierarchy, what leads, the flow), never only in color.
2. **Direction.** Load `davi:ui-design-direction` and use its Mode B: the most characteristic element first, structure that carries information, restrained motion. When the repo has a `DESIGN.md`, use its tokens and components; never write to `DESIGN.md` from a prototype.
3. **Knowledge.** Use `davi:ui-ux-pro-max` for focused searches only: `--domain style` and `--domain color` for the direction of each variant, `--domain ux` for the interaction in question, `--domain landing` for marketing pages. Without a `DESIGN.md`, its `--design-system` mode gives a starting palette and type pair.
4. **Build in Claude Design.** Run the Artifact tool's `quickstart` with `intent: "design"`, create the artifact from the Design type it names, and follow that type's instructions and design system. Title: `<KEY> — <question in a few words>`. Put each variant on its own frame or page, labelled `A`, `B`, `C`, with real copy in pt-BR from the map and the glossary (no lorem ipsum). Phone width and the primary viewport both work.
5. **Hand it over:** the link, what each variant tries, and the one question to answer. Watch the artifact's comments (`ArtifactComments`) and iterate on the same URL.

## Logic: interactive HTML or spike

1. Write the question at the top.
2. Put the logic in a pure module (a reducer, a state machine, or pure functions), with no DOM, so it can be lifted into real code later.
3. Build **one self-contained HTML artifact** (load `artifact-design` first): labels in the domain language, a panel with the full current state, free-play buttons for every action, and tabs with guided walkthroughs of the interesting cases.
4. When the question needs real infrastructure (a provider's API, a queue, a database), make a spike instead: branch `spike/<KEY>-<slug>` from the default branch, in-memory where possible, no tests, pushed but **never merged**.

## Record

1. Link the artifact (remote link, plus the comment) or the spike branch on the ticket.
2. The resolution comment, in pt-BR (format in [../wayfind-workitem/references/map.md](../wayfind-workitem/references/map.md)), records the variant or behavior chosen and **why**, and what the delivery work must keep from it. Attach screenshots of the chosen variant (see [../../references/jira.md](../../references/jira.md) › Evidence on the card), so the decision survives if the artifact changes.
3. When a delivery card is later created from this decision, `create-workitem` links the prototype in its Contexto, and `design-workitem` starts from it.

## Rules

- Throwaway: no tests, no polish beyond what the question needs, in-memory state.
- One question per prototype. A second question is a second ticket.
- Never answer for the humans: present the variants and wait for their pick.
