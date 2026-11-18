# Design

> The design contract for this product. Agents and people read it before they design or build UI, and nothing in the UI uses a value that is not defined here.
> Maintained by `ui-design-system`. Every change is recorded in the [Decision log](#9-decision-log).

- **Interface:** <web app | mobile app | desktop | none>
- **UI stack:** <e.g. React + Tailwind + shadcn/ui; icons: Phosphor>
- **Token source of truth in code:** <e.g. `src/styles/tokens.css`, `tailwind.config.ts`>
- **Prototypes:** <links to Claude artifacts / Figma>

## 1. Product and audience

<Who uses the product, in which context (device, environment, frequency), and the main job the UI does for them. 2–4 sentences.>

## 2. Aesthetic direction

- **Tone:** <3–5 adjectives that describe the feel, e.g. calm, precise, dense>
- **Signature element:** <the one memorable thing the UI is allowed to be bold about>
- **References:** <products or materials that inspire it, and what is taken from each>
- **Avoid:** <generic defaults this product must not fall into>

## 3. Tokens

All values in code come from these tokens. Each one has a name, a value, and a role.

### 3.1 Color

| Token | Light | Dark | Role |
|---|---|---|---|
| `color-bg` | | | page background |
| `color-surface` | | | cards, panels |
| `color-text` | | | body text |
| `color-text-muted` | | | secondary text |
| `color-primary` | | | primary actions, focus |
| `color-on-primary` | | | text on primary |
| `color-border` | | | dividers, inputs |
| `color-success` / `color-warning` / `color-danger` / `color-info` | | | status |

Contrast, verified for each pair: body text ≥ 4.5:1, large text and UI boundaries ≥ 3:1, in both themes.

### 3.2 Typography

| Token | Family | Size / line-height | Weight | Use |
|---|---|---|---|---|
| `font-display` | | | | page titles |
| `font-heading` | | | | section titles |
| `font-body` | | | | text |
| `font-mono` | | | | code, ids |

Line length: at most ~75 characters for running text.

### 3.3 Spacing, radius, elevation, motion

| Token | Value | Use |
|---|---|---|
| `space-1 … space-N` | <4px or 8px scale> | padding, gaps |
| `radius-sm / md / lg` | | by hierarchy, not the same everywhere |
| `shadow-1 / 2` | | elevation levels |
| `motion-fast / base / slow` | <ms + easing> | user-triggered feedback; respect `prefers-reduced-motion` |
| `breakpoint-sm / md / lg` | | responsive layout |

## 4. Components

One entry per shared component. A new component gets an entry before it ships.

### <Component name>
- **Use for:** <when> · **Do not use for:** <when not>
- **Variants:** <primary, secondary, …>
- **States:** default, hover, focus-visible, active, disabled, loading, error, empty
- **Tokens:** <which tokens it uses>
- **Accessibility:** <role, label, keyboard behavior>

## 5. Layout and patterns

- **Grid and containers:** <max width, columns, gutters per breakpoint>
- **Navigation:** <structure, where it lives on mobile and desktop>
- **Page patterns:** <list, detail, form, dashboard, and how each is laid out>
- **Data states:** loading (skeleton vs spinner), empty (always offers the next action), error (what happened + how to fix), partial

## 6. Content and voice

- Sentence case. Active voice. A button names the action it performs ("Save changes", not "Submit"), and the confirmation uses the same verb ("Changes saved").
- Errors say what went wrong and how to fix it, with no apology and no vagueness.
- Terms come from [GLOSSARY.md](GLOSSARY.md).

## 7. Accessibility

Target: WCAG 2.2 AA.
- Visible keyboard focus on every interactive element. The focus order follows the visual order.
- Touch targets: at least 44×44 px.
- Icons that carry meaning have a text alternative. Decorative icons are `aria-hidden`.
- Never use color as the only signal.
- Respect reduced motion.

## 8. Do / Don't

| Do | Don't |
|---|---|
| | |

## 9. Decision log

| Date | Decision | Why | Jira |
|---|---|---|---|
| YYYY-MM-DD | | | |
