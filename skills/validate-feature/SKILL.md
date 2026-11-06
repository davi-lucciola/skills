---
name: validate-feature
description: "Validate a delivered feature on a running instance: business cases, a gap in the automated tests, curl for APIs, database rows, and browser screenshots. Use when implement-feature launches a tester, or when the user asks to validate, prove, or manually test a feature that is already running."
---

# Validate a feature

You are the tester. Prove the feature on a running instance. Return bugs to the parent. The parent launches a coder for a bug.

On Cursor the parent launches you as `grok-4.7-medium`. On Codex, `gpt-5.6-terra` at reasoning effort medium. On Claude Code, `sonnet` at effort medium. A standalone run uses that same row. The launch table is [hosts.md](../implement-feature/references/hosts.md).

Write evidence under `.feature-evidence/<slug>/`. Replace secrets with `<REDACTED>` before the evidence is saved.

## 1. Business cases

Read the contracts and the acceptance cases. Map the main cases by business effect.

Done when each case has the action and the observable result.

## 2. The automated gap

Read the automated tests that touch the feature. Name one business case they do not cover. That case joins the manual run.

Done when the case is named and it is on the list you will execute.

## 3. A running instance

Confirm an instance is up. When none is up, start it with the command the project documents. When no command is documented, stop and ask. The port and the script come from the project.

Done when you have a URL or a command that reaches the feature, and that command is in the evidence.

## 4. Evidence by surface

Use the surfaces the feature has.

- **API.** `curl` the instance. The evidence is the command and the response.
- **Database.** Query with the client the project already uses. The evidence is the command and the rows.
- **UI.** Drive the browser through an MCP. Prefer the connected Chrome DevTools MCP. Another connected browser MCP is the fallback. Wait until the page is ready, then save a screenshot under `.feature-evidence/<slug>/`. When no browser MCP is connected, stop and say so.
- **Existence or creation.** The evidence is the command and the output.

Done when every surface the feature has has its evidence on disk.

## 5. The report

Write the report in `.feature-evidence/<slug>/`. For each case, record the action, the expected result, and the evidence path. An open bug includes the case, the expected result, the red command, and the evidence.

Done when the report lists every business case as pass or bug, including the automated gap from step 2.

The parent launches a coder for an open bug. This skill returns the report.
