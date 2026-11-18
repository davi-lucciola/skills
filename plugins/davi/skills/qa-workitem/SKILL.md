---
name: qa-workitem
description: "End-to-end QA of a work item on a running instance: turn every spec scenario and Jira acceptance criterion into a test case, add the common checks for the app type (web, API, worker, CLI), execute them with the Chrome DevTools MCP / curl / DB client, record evidence (screencast mp4, screenshots, console and network logs, responses, rows), and report pass or reproducible bugs. Used by the workitem-qa agent inside implement-workitem; also runs standalone (qa-workitem <KEY>)."
---

# QA a work item

You prove the work item works as specified, the way a user would use it. You never edit source code, tests, or specs. You report, and the author fixes. The report and evidence files are in English; what goes on the card follows `jira.md` › Language (pt-BR on the work item).

Read [../../references/jira.md](../../references/jira.md) when running standalone.

## Inputs

**Inside the loop** (from `implement-workitem`): the worktree path, the change path, the card key, the start command, the run type (`full`, or `recheck` with a list of failed cases), and the output folder `.workitem-evidence/<KEY>/qa-<N>/`.

**Standalone:** `<KEY>`. Find the worktree (`git worktree list`, pattern `*--<KEY>-*`) or ask which environment to test (a local worktree, or a staging URL). Use `.workitem-evidence/<KEY>/qa-standalone-<date>/`. If the card is not in **QA**, ask before transitioning it.

Replace secrets and personal data with `<REDACTED>` in everything you save.

## 1. Build the case list

1. **From the spec.** Each `#### Scenario:` in the change's delta specs becomes one case. Keep its name, such as `AC2 — …`.
2. **From the card.** Each acceptance criterion (`getJiraIssue`) without a matching scenario becomes a case too. Flag the mismatch in the report, because it means the spec missed an AC.
3. **From the app type.** Detect the type from the repo and the diff, then add the checks from the matching checklists. More than one can apply.
   - [references/checklists/web.md](references/checklists/web.md): any UI was touched.
   - [references/checklists/api.md](references/checklists/api.md): an HTTP or GraphQL surface changed.
   - [references/checklists/worker.md](references/checklists/worker.md): jobs, queues, cron, or event consumers.
   - [references/checklists/cli.md](references/checklists/cli.md): a command-line tool.
   - Add only the items that apply to the changed surface. Don't run the whole checklist over the whole app.
4. **One exploratory case.** Think of one business case the spec and the automated tests both miss, and add it.
5. **Recheck runs.** Re-run only the failed cases, plus one smoke case: the main happy path of the item.

For each case, write the action, the expected result, and the surface (UI, API, DB, or CLI) in `cases.md`.

## 2. Run the app

- Run the checks of [../../references/preflight.md](../../references/preflight.md) that QA needs first: the browser MCP for UI, the env keys through `env-check.py` (never by reading a dotenv file), the backing services, the seed command, and the test user's location. A failed item makes the run `blocked`, with the item named in the report.
- Use the start command you were given. Otherwise use the one documented in `AGENTS.md` or the README. If none is documented, stop and ask.
- Wait until it is healthy (health endpoint or first page load), and record the command and URL in the report.
- Seed data only through documented seeds, fixtures, or the app's own API. Never write to the database by hand to make a case pass.
- If the app does not start, stop with a `blocked` report that includes the error output.

## 3. Execute with evidence

### UI: Chrome DevTools MCP

Use the Chrome DevTools MCP tools, prefixed by this plugin (`chrome-devtools`).

1. `new_page` at the app URL. Set the viewport for the case (`resize_page`): desktop 1440×900, and also mobile 390×844 for responsive cases.
2. `screencast_start` with `filePath: <out>/video/<case-id>.mp4` **before** the first action of each flow.
3. Drive the flow with `take_snapshot` (to find element uids), `click`, `fill`/`fill_form`, `press_key`, and `wait_for`. Prefer the accessibility snapshot over guessing selectors.
4. `take_screenshot` with `filePath: <out>/screenshots/<case-id>-<step>.png` at each key state, and always at the final state the case asserts.
5. `screencast_stop`.
6. `list_console_messages`: save the errors and warnings to `<out>/console/<case-id>.txt`. An uncaught error or a failed resource load is a bug unless the case expects it.
7. `list_network_requests` and `get_network_request` for the calls the flow makes: save them to `<out>/network/<case-id>.json`. Unexpected 4xx/5xx responses are bugs.
8. For UI items, compare the final screenshots with the approved prototype linked in the card's `## Design` section and in `DESIGN.md`. Check `DESIGN.md` §7 Accessibility, and run `lighthouse_audit` (accessibility and best practices) once per changed page.
9. When a performance budget exists in the standards or the spec, run `performance_start_trace`/`performance_stop_trace` and `performance_analyze_insight`.

Fallback: if Chrome DevTools MCP is not connected, use Claude in Chrome (`mcp__claude-in-chrome__*`, gif recording instead of mp4). If neither is connected, stop and report `blocked`. Never mark a UI case as passed without visual evidence.

### API

`curl -sS -i` against the instance. The evidence is the exact command and the full response, saved to `<out>/api/<case-id>.txt`.

### Database

Query with the client the project already uses (`psql`, `mysql`, `mongosh`, an ORM console). The evidence is the query and the rows, saved to `<out>/db/<case-id>.txt`. Run read-only queries only.

### Worker / CLI

The evidence is the command, its exit code, the output, and the resulting state (a queue message, a file, a row).

## 4. Judge

- **pass:** the observed result matches the expected result, and there are no unexpected console or network errors.
- **bug:** it does not match. Write it reproducibly:

  ```markdown
  ### BUG-<n> [blocker|major|minor] <case-id>: <title>
  - Expected: <…>
  - Actual: <…>
  - Reproduce: <one command, or numbered UI steps from a clean state>
  - Evidence: video/<case>.mp4, screenshots/<case>-3.png, network/<case>.json
  - Suspected area: <file or module, if obvious; optional>
  ```

  A bug is a `blocker` when it breaks an AC or Scenario or loses data, `major` when it breaks a checklist item, and `minor` for cosmetic issues outside `DESIGN.md` rules.
- **blocked:** the case could not run because of the environment, missing data, or a missing tool. That is not a pass.
- On a recheck run, a previously failing case that still fails is the **same bug**. Keep its id so the orchestrator can apply the stop rule.

## 5. Report and publish evidence

Write `<out>/report.md`:

```markdown
# QA <KEY>, round <N> (<full|recheck>)

Environment: <url>, started with `<command>`, commit <sha>
Result: <n pass> / <n bug> / <n blocked>

| Case | Source | Result | Evidence |
|---|---|---|---|
| CA1 — … | spec | pass | `<KEY>-qa<N>-run.mp4` |
| WEB-console | checklist | bug BUG-1 | `<KEY>-qa<N>-console.log` |

## Bugs
<BUG blocks>

## Spec gaps
<CAs without a scenario, or the exploratory case>
```

Publish the evidence **on the Jira card**, following `jira.md` › Evidence on the card:

- Name every file for upload as `<KEY>-qa<N>-<case>.<ext>` already when you save it, so the report, the card, and the PR use the same names.
- Compress videos first (the `ffmpeg` line in `jira.md`). Mask secrets and personal data in screenshots and logs.
- **Inside the loop:** do not touch Jira. List the files to upload at the end of the report, under `## Uploads` (path, name, inline or attach). The orchestrator (`implement-workitem`) uploads them and posts the round comment.
- **Standalone runs:** after a yes, upload them yourself and comment on the card, in pt-BR: `**[qa-workitem]** Rodada de QA <N>: <resultado>`, with the case table, the screenshots inline next to their cases, and the names of the attached videos and logs.
- `pr-workitem` reuses the same files for the PR body.

Return the report path and the counts.
