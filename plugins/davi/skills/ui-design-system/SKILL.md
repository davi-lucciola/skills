---
name: ui-design-system
description: "Create, extract, or update the project's root DESIGN.md (the design contract: product and audience, aesthetic direction, tokens, components, layout patterns, content voice, accessibility, do/don't, decision log) and keep the code's token source in sync. Use when DESIGN.md is missing or incomplete, when a screen needs a token or component DESIGN.md lacks, or when project-harness reaches DESIGN.md."
---

# UI design system: `DESIGN.md`

Every repo in this flow has a `DESIGN.md` at the root, next to `AGENTS.md`. It is the single source of truth for design. This skill is the only one that changes its structure. Other skills read it, and they add to it only through this skill.

All content is written in English.

## What `DESIGN.md` defines

The template is [../project-harness/templates/DESIGN.md](../project-harness/templates/DESIGN.md). Keep its sections and their order.

| § | Section | Definition | Filled by |
|---|---|---|---|
| — | Header | Interface type (web, mobile, desktop, or none), UI stack (framework, component library, icon library), where tokens live in code, links to prototypes | this skill |
| 1 | Product and audience | Who uses the product, in what context (device, environment, frequency), and the main job the UI does | this skill + `refine-workitem` answers |
| 2 | Aesthetic direction | Tone (3–5 adjectives), the one signature element, references and what each contributes, the defaults to avoid | `ui-design-direction` |
| 3.1 | Color | Semantic tokens (`color-bg`, `color-surface`, `color-text`, `color-text-muted`, `color-primary`, `color-on-primary`, `color-border`, status colors) with light and dark values and their role. Contrast is verified per pair: text ≥ 4.5:1, large text and UI boundaries ≥ 3:1 | this skill |
| 3.2 | Typography | Tokens `font-display`, `font-heading`, `font-body`, `font-mono` with family, size, line-height, weight, and use. Maximum line length | this skill |
| 3.3 | Spacing, radius, elevation, motion | A spacing scale (4 or 8 px), radius by hierarchy, elevation levels, motion durations and easings (reduced motion honored), breakpoints | this skill |
| 4 | Components | One entry per shared component: when to use it and when not to, variants, states (default, hover, focus-visible, active, disabled, loading, error, empty), tokens used, accessibility | this skill, on request from `design-workitem` / `implement-workitem` |
| 5 | Layout and patterns | Grid and containers per breakpoint, navigation, page patterns (list, detail, form, dashboard), data states (loading, empty, error, partial) | this skill |
| 6 | Content and voice | Microcopy rules: sentence case, action-named buttons, matching confirmations, errors that explain the fix, glossary terms | this skill |
| 7 | Accessibility | WCAG 2.2 AA target and the concrete rules: focus, target size, text alternatives, color not the only signal, reduced motion | this skill |
| 8 | Do / Don't | Concrete, checkable rules derived from §2 | `ui-design-direction` |
| 9 | Decision log | Date, decision, reason, Jira key, for every change to §2–§8 | every change |

A repo without UI keeps the file with `Interface: none` and only §6, which then covers user-facing messages in APIs, emails, and CLIs, plus §9.

## Mode 1: create (no `DESIGN.md`, new UI)

1. Fill the header and §1 from the README, the Jira card, and the developer. Ask only what you cannot infer.
2. Run `ui-design-direction` Mode A for §2 and §8.
3. Generate candidate tokens with `ui-ux-pro-max` in design system mode (`--design-system -f markdown`, dials to match §2). Map the output into §3 as described in that skill. Rename everything to semantic tokens, add the dark theme, and verify contrast for every text and background pair.
4. Write §4 with the base components the stack already provides (button, input, select, dialog, toast, table, card, empty state), each with its states.
5. Write §5, §6, and §7 from the template, adapted to the product.
6. Add a §9 entry: "Initial design system".
7. Offer to write the code token source (CSS variables, the Tailwind theme, or the component library theme) at the path named in the header. Do this only with a yes.

## Mode 2: extract (existing UI, no or partial `DESIGN.md`)

1. Find the real tokens in code: Tailwind config / `@theme`, CSS custom properties, the component library theme (shadcn `globals.css`, MUI theme, etc.), font imports, and the icon package in the manifest.
2. Write §3 from those values. Give each token its semantic name and its role. Flag every hard-coded color, size, or font found outside the token source, and list the 10 worst offenders under "Known deviations" in §8. Do not fix code here.
3. Write §4 from the shared component folder.
4. Infer §2 from what the product looks like today, then confirm it with the developer. Don't invent a new direction during extraction.
5. If a `design-system/<slug>/MASTER.md` from ui-ux-pro-max exists, merge it into the matching sections and `git mv` it to `docs/architecture/decisions/` as history, or delete it with the developer's OK.
6. Add a §9 entry: "Extracted from code".

## Mode 3: update (a screen needs something new)

Called by `design-workitem` or `implement-workitem` with a request such as "need a `warning` banner component" or "need a denser table spacing".

1. Check whether an existing token or component already covers the request. Prefer reuse, and say so when it applies.
2. If it is really new, add the smallest addition that fits §2 and the existing scale. A new token lives on the existing scale, not beside it.
3. Verify contrast and states.
4. Add a §9 entry with the Jira key.
5. Return the exact token or component names the caller must use.

## Rules

- Values exist only in `DESIGN.md` and the code token source, and the two must agree. Components and screens reference tokens and never contain raw values.
- Never delete a token that code still uses. Deprecate it in §9 with its replacement.
- Keep the file scannable: tables over prose, and no essays.
