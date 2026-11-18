# Web checklist

Apply only the items that are relevant to the screens the item changed. Each item that applies becomes a case with id `WEB-<item>`.

| Id | Check | How | Bug when |
|---|---|---|---|
| WEB-console | No errors in the console during the flows | `list_console_messages` | An uncaught error, a React/Vue warning in a changed component, or a failed resource load |
| WEB-network | No unexpected failing requests | `list_network_requests` | An unexpected 4xx or 5xx, a request to the wrong environment, a duplicated request on a single action |
| WEB-responsive | Layout works on mobile and desktop | `resize_page` 390×844 and 1440×900, plus screenshots | Horizontal scroll, overlapping or clipped content, unreachable actions |
| WEB-states | Loading, empty, error, and partial states exist and follow `DESIGN.md` §5 | Force each state through test data, an offline network (`emulate`), or an invalid input | Blank screen, endless spinner, raw error text, or an empty state without a next action |
| WEB-forms | Validation, error messages, and submit behavior | Submit empty, invalid, and boundary values | No inline error, a lost input after an error, double submit possible, no focus on the first error |
| WEB-keyboard | The flow works with the keyboard only, with visible focus | `press_key` Tab / Shift+Tab / Enter / Escape, plus screenshots | Unreachable control, invisible focus, focus trap, a dialog that does not close on Escape |
| WEB-a11y | Accessibility of the changed pages | `lighthouse_audit` (accessibility) and `take_snapshot` | A Lighthouse accessibility score below 90, an unlabeled control, contrast below `DESIGN.md` §3.1 |
| WEB-design | Matches the approved prototype and `DESIGN.md` | Screenshots compared with the prototype linked in `DESIGN.md` | A visible divergence from the prototype, or a value or component outside `DESIGN.md` |
| WEB-copy | Copy follows `DESIGN.md` §6 and `GLOSSARY.md` | Read the screenshots | Placeholder text, inconsistent verbs, or a term not in the glossary |
| WEB-auth | Permissions and session | Repeat the flow as an unauthorized role and with an expired session | Data or actions visible to the wrong role, or a session that does not expire or redirect |
| WEB-nav | URLs, back button, refresh, deep link | Navigate, go back, reload mid-flow, open the URL directly | Lost state that should persist, a broken deep link, or a 404 on refresh |
| WEB-perf | Within the budget, when one exists | `performance_start_trace` / `performance_stop_trace` / `performance_analyze_insight` | A budget in the standards or spec is exceeded (LCP, INP, CLS) |
