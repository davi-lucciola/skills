---
name: onboarding
description: "One-time global setup of a developer machine for Claude Code: tools, MCP servers (Jira/Confluence, Context7, Google Drive, Chrome DevTools), ~/.claude/davi.json, and a smoke test. Use when a developer joins, changes machine, or a workitem skill reports a missing MCP or config."
disable-model-invocation: true
---

# Onboarding

You set up this developer's machine so every `*-workitem` skill works. Everything here is **global** (user scope). Project-level setup is `project-harness`.

Reply to the developer in the language they write in; every file and config you write is in English. Run each step, show what you found, and fix what is missing. Never write a file or add an MCP without showing the change and getting a yes. Never print or store a token in a file other than the one the tool itself manages.

Read [../../references/jira.md](../../references/jira.md) before step 3.

## 1. Tools

Check, and report a table of ✅ / ❌ with the fix for each ❌:

| Tool | Check | Need |
|---|---|---|
| git | `git --version` | any recent |
| GitHub CLI | `gh auth status` | logged in with an account that can push to the repos you work on (`gh api user --jq .login`; for an org, `gh api orgs/<org> --jq .login`). If several accounts are logged in, the active one must be the one that owns those repos (`gh auth switch`). |
| SSH to GitHub | `ssh -T git@github.com` (or the host alias in `~/.ssh/config` the developer uses for those repos) | authenticates as that account |
| Node.js | `node --version` | ≥ 20 (Chrome DevTools MCP and Context7 run on it) |
| Python 3 | `python3 --version` | stdlib only, for `ui-ux-pro-max` search |
| Chrome | `google-chrome --version` / `chromium --version` / macOS app | current stable, for QA evidence |

Do not install system packages yourself. Give the command for the developer's OS and wait. A `gh auth login` is interactive: ask the developer to type `! gh auth login` in the prompt.

## 2. MCP servers

List what is connected with `claude mcp list` and by checking which tool prefixes exist in this session.

| Server | Purpose | How |
|---|---|---|
| **Atlassian** (Jira + Confluence) | Read/write cards, transitions, comments | Prefer the claude.ai connector (Settings → Connectors → Atlassian); tools appear as `mcp__claude_ai_Atlassian__*`. Without it: `claude mcp add --scope user --transport http atlassian https://mcp.atlassian.com/v1/mcp`, then `/mcp` → atlassian → Authenticate. |
| **Context7** | Up-to-date library docs while coding | Shipped by this plugin (`.mcp.json`). Optional API key for higher limits: `claude mcp add --scope user --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: <key>"`. Both entries then coexist; the skills use whichever responds. |
| **Google Drive** | Read PRDs and shared docs (evidence goes to Jira attachments, not Drive) | claude.ai connector (Settings → Connectors → Google Drive). Tools appear as `mcp__claude_ai_Google_Drive__*`. |
| **Chrome DevTools** | QA: screenshots, screencast (mp4), console, network, Lighthouse, performance | Shipped by this plugin (`npx chrome-devtools-mcp@latest`). Needs Node and Chrome. |

Suggested, optional — offer them, install only on a yes:

| Server | When it helps |
|---|---|
| **Figma** (claude.ai connector) | The team designs in Figma; `design-workitem` reads frames instead of only drawing artifacts. |
| **Sentry** (`https://mcp.sentry.dev/mcp`) | `create-workitem bug` pulls the stack trace and event links into the card. |
| **GitHub MCP** (`https://api.githubcopilot.com/mcp/`) | Only if the developer cannot use `gh`. The skills default to `gh`. |
| **Claude in Chrome** | Required once per Jira project for [jira-setup.md](../../references/jira-setup.md) (creating issue types and workflows, changing a card's type). Also the fallback browser for QA, and how `wayfind-workitem` does manual **Task** tickets in web consoles. |

Done when Atlassian, Context7, Google Drive, and Chrome DevTools respond, and `ffmpeg` is on the PATH (it compresses QA videos before they are attached to Jira), or the developer chose to skip one and knows which skills lose what.

## 3. Global config — `~/.claude/davi.json`

1. Call `getAccessibleAtlassianResources`. If more than one site comes back, ask which one the developer works in. Keep `cloudId` and the site URL.
2. Ask for a sample project key and read its workflow: `searchJiraIssuesUsingJql` with `project = <KEY> ORDER BY updated DESC` (max 5), then list transitions of one card. Map the real status names to the keys in `jira.md` (`new`, `productRefinement`, `todo`, `techRefinement`, `inProgress`, `codeReview`, `qa`, `done`). Show the mapping and confirm. The project key itself is **not** stored here — it lives in each repo's `AGENTS.md`.
3. **Issue types.** `listJiraProjectIssueTypesMetadata` on the sample project. It needs Epic, Story, Bug, Habilitador, Subtask, and the refinement types Decisão, Pesquisa, Protótipo, and Task (`jira.md` › Issue types), and the refinement types must run the short workflow (Novo → A Fazer → Desenvolvendo → Concluído) while Story, Bug, and Habilitador run the delivery workflow: list the transitions of one card of each. When the site uses other names, map them under `issueTypes`. When a type or the short workflow is missing, offer to set it up now with Claude in Chrome, following [jira-setup.md](../../references/jira-setup.md); the developer must be a project admin. Without them, `wayfind-workitem` cannot chart.
4. **Attachments.** Check that `uploadAttachmentToJiraIssue` is reachable through `discover`. Evidence is attached to the cards (`jira.md` › Evidence on the card).
5. Write the file with the shape in `jira.md` (`loops.maxRounds` = 5). Show it before writing. If the file exists, show the diff and merge.

## 4. Permissions

Propose an allowlist for `~/.claude/settings.json` with read-only operations only, so the workflow does not prompt for every lookup:

```json
{
  "permissions": {
    "allow": [
      "mcp__claude_ai_Atlassian__getJiraIssue",
      "mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql",
      "mcp__claude_ai_Atlassian__getAccessibleAtlassianResources",
      "mcp__context7",
      "mcp__plugin_davi_context7",
      "mcp__plugin_davi_chrome-devtools__take_screenshot",
      "mcp__plugin_davi_chrome-devtools__take_snapshot",
      "mcp__plugin_davi_chrome-devtools__list_console_messages",
      "mcp__plugin_davi_chrome-devtools__list_network_requests",
      "Bash(gh pr view:*)",
      "Bash(gh pr list:*)",
      "Bash(gh pr diff:*)",
      "Bash(git worktree list:*)"
    ]
  }
}
```

Adjust the prefixes to the ones actually present (step 2). Write-type operations (create, edit, transition, comment, `gh pr create`) stay out: the skills ask before them. Merge with the existing file; never drop entries the developer already has. Use the `update-config` skill when it is available.

## 5. Guard hooks

The plugin ships four guard hooks (`hooks/hooks.json`). They are on as soon as the plugin is installed. Explain them in one line each:

| Guard | Blocks |
|---|---|
| `guard-secrets` | Reading or piping dotenv files, SSH keys, and credential files. Use the plugin's `scripts/env-check.py` to see which keys are set. |
| `guard-key-literals` | Writing something that looks like a live key into a file. |
| `guard-protected-push` | Pushing to or force-pushing `develop`, `main`, or `master`. Feature branches are fine. |
| `guard-delete-outside` | `rm`, `find -delete`, and `git clean` outside the project and its `<name>--*` worktrees. |

To switch one off, set it to `false` under `"guards"` in `~/.claude/davi.json`, for example `"guards": {"guard-protected-push": false}`. Ask whether the developer wants any off, and write only on a yes.

## 6. Smoke test

Run each, report ✅ / ❌:

1. Jira: `getJiraIssue` on one card of the sample project.
2. Context7: resolve a library id (e.g. `react`) and fetch one doc snippet.
3. Drive: search for any file.
4. Jira attachments: upload a small text file to a card the developer names, then ask them to delete it (skills never delete). Skip if they prefer.
5. Chrome DevTools: open `about:blank` with `new_page`, `take_screenshot`, close it.
6. GitHub: `gh repo list <owner> --limit 1`, where `<owner>` is the account or org of the repos you work on.

## 7. Next steps

End with:

- Which skills are ready, and which lost a capability because a server was skipped.
- In a project repo without the standard docs: run `/davi:project-harness`. Make sure its `AGENTS.md` `## Jira` section has the project key **and the project label** (`- Label: <slug>`, `jira.md` › Project label).
- To start work: `/davi:create-workitem story|bug|habilitador` for a clear idea, `/davi:wayfind-workitem chart <idea>` for a big, foggy one, or `/davi:wayfind-workitem status <KEY>` to know where an existing card or Epic stands.
