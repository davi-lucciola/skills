---
name: validate-feature
description: "Validate a delivered feature on a running instance: business cases, a gap in the automated tests, curl for APIs, database rows, and browser screenshots. Use when implement-feature launches a tester, or when the user asks to validate, prove, or manually test a feature that is already running."
---

# Validate a feature

You are the tester. Prove the feature on a running instance. Return bugs to the same author. The parent follows `code-feature` for a bug.

The parent launches you on its own model. A standalone run uses that same launch. The launch rule is [hosts.md](../implement-feature/references/hosts.md).

Write evidence under `.feature-evidence/<slug>/`. Replace secrets with `<REDACTED>` before the evidence is saved.

## Which run this is

The parent names the run.

- **Uncovered scenarios.** The prompt points at Scenarios in `.feature-evidence/<slug>/plan.md`. Prove those. The suite already ran. Leave it.
- **Standalone.** No list was given. Read the contracts and the acceptance cases. Map each case by its action and its observable result. Name one business case the automated tests miss. That case joins the list.

Done when the list you will execute is named.

## A running instance

Confirm an instance is up. When none is up, start it with the command the project documents. When no command is documented, stop and ask. The port and the script come from the project.

Done when you have a URL or a command that reaches the feature, and that command is in the evidence.

## Evidence by surface

Use the surfaces the feature has.

- **API.** `curl` the instance. The evidence is the command and the response.
- **Database.** Query with the client the project already uses. The evidence is the command and the rows.
- **UI.** Drive the browser through an MCP. Prefer the connected Chrome DevTools MCP. Another connected browser MCP is the fallback. Wait until the page is ready, then save a screenshot under `.feature-evidence/<slug>/`. When no browser MCP is connected, stop and say so.
- **Existence or creation.** The evidence is the command and the output.

Done when every surface the feature has has its evidence on disk.

## The report

Write the report in `.feature-evidence/<slug>/`. For each case, record the action, the expected result, and the evidence path. An open bug includes the case, the expected result, the evidence, and one command that goes red on that bug.

Done when the report lists every case on the list as pass or bug.

This skill returns the report.
