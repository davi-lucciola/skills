---
name: ui-design-direction
description: "Decide and apply a distinctive, intentional visual direction for a product UI, and record it in DESIGN.md so every later screen follows it instead of drifting to templated defaults. Use when DESIGN.md has no aesthetic direction yet, when a screen needs layout and typography decisions, or when a UI reads as generic."
license: Apache-2.0. Adapted from Anthropic's frontend-design skill, see LICENSE.txt and NOTICE.md
---

# UI design direction

You are the design lead for this product. The direction is decided **once**, written into `DESIGN.md` §2 Aesthetic direction and §8 Do / Don't, and then followed. Every screen after that is an application of the direction. A screen is not the place to invent a new direction.

`DESIGN.md` sections and what each one holds are defined in [../project-harness/templates/DESIGN.md](../project-harness/templates/DESIGN.md):

| § | Section | What it owns |
|---|---|---|
| 1 | Product and audience | who uses it, where, for which job |
| 2 | Aesthetic direction | tone, signature element, references, what to avoid |
| 3 | Tokens | color (light and dark, contrast verified), typography, spacing, radius, elevation, motion, breakpoints |
| 4 | Components | variants, states, tokens used, accessibility per component |
| 5 | Layout and patterns | grid, navigation, page patterns, loading, empty, and error states |
| 6 | Content and voice | microcopy rules |
| 7 | Accessibility | WCAG 2.2 AA rules |
| 8 | Do / Don't | concrete rules that come from the direction |
| 9 | Decision log | dated decisions with the reason and the Jira key |

## Mode A: no direction yet (`DESIGN.md` §2 empty)

### 1. Ground the design in the subject

Read `DESIGN.md` §1, `GLOSSARY.md`, the Jira card, and the product's real content. If the brief does not say what the product is, who it is for, and what job the UI does, propose one concrete answer and confirm it. Distinctive choices come from the subject's industry, materials, and vernacular. A tool for field technicians and a dashboard for analysts should look different.

### 2. Draft a compact plan

- **Color:** 4–6 named base values, each with its role.
- **Type:** one or two families, with roles. If you use two, make them clearly distinct. Choose them deliberately, not out of habit, and set a clear scale with intentional weights.
- **Layout:** a one-sentence concept plus an ASCII wireframe of the main screen. State the alignment rule.
- **Principles:** 3–5 sentences on what makes this product's UI specific.
- **Signature element:** the one place where the UI is bold. Everything around it stays quiet.

### 3. Check the plan against the generic defaults

AI-generated UI currently clusters around a few looks. Each one is legitimate when the brief asks for it. They are defaults, though, and should not be chosen by inertia:

1. A warm cream background (≈ `#F4F1EA`) with a high-contrast serif and a terracotta accent (≈ `#D97757`).
2. Near-black with a single acid-green or vermilion accent.
3. A broadsheet layout with hairline rules, zero radius, and dense columns.
4. The SaaS card kit: identical rounded cards, one radius everywhere, the same soft grey shadow, and decorative gradient washes.
5. Template chrome: an ALL-CAPS eyebrow over every heading, `A · B · C` meta strings, `WORD — fragment` labels, `#0B0B0B` standing in for black, monospace for small labels, and `→` appended to every link.

Common typographic tells: one accented word in a headline, all-caps labels, and labels above content that add nothing. Numbered markers (01 / 02 / 03) are fine only when the content really is a sequence.

When the brief fixes a direction, follow it exactly. Where it leaves a choice free, do not spend that freedom on a default. Revise each part of the plan that would come out the same for any similar product, and say what you changed and why.

### 4. Record

Present the revised plan. On approval, hand the tokens to `ui-design-system` so they land in `DESIGN.md` §3. Write §2 and §8 yourself, and add a line to §9 Decision log.

## Mode B: direction exists (designing or building a screen)

1. Read `DESIGN.md` in full. The screen uses only its tokens and components.
2. Open with the most characteristic thing in the product's world for this screen: real data, a primary action, or a live state. Avoid the stock "big number, small label, gradient accent" unless it is truly the best fit.
3. Visual structure is information. Borders, numbering, dividers, and labels must encode something about the content.
4. Motion: use one orchestrated moment at most for things the user did not trigger. Motion that answers a user action (open, expand, confirm) is welcome when it shows what changed. Respect `motion-*` tokens and reduced motion.
5. Copy follows `DESIGN.md` §6. Use real content from the card and the glossary, never lorem ipsum. A button names the action, the confirmation reuses the verb, an error says what happened and how to fix it, and an empty state offers the next action.
6. If the screen needs something `DESIGN.md` lacks, such as a new component, token, or pattern, stop and add it through `ui-design-system` first.

## Quality floor and self-critique

Apply this without announcing it. The UI works down to 360 px, keyboard focus is visible, reduced motion is respected, contrast meets `DESIGN.md` §3.1, and target sizes meet `DESIGN.md` §7.

Critique as you build. Take a screenshot when the environment supports it, compare it with the plan, and remove one accessory before you call it done. Watch for CSS specificity fights between type selectors and class selectors, especially around section padding and margins.

## Writing in the UI

Words exist to make the interface easier to understand and use. Name things by what users understand, not by how the system is built: "notifications", not "webhook config". Use active voice and sentence case, with no filler. Keep the same name for an action through the whole flow. Use the vocabulary of `GLOSSARY.md`.
