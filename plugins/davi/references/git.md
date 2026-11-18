# Git, worktrees, branches, and commits

## Base branch

`<base>` is the first of `develop`, `main`, and `master` whose ref `refs/remotes/origin/<name>` exists after `git fetch origin`. A branch that exists only locally is not `<base>`. When none exists, stop and say so.

## Worktree

For a repo checked out at `<parent>/<name>`, the work item is implemented in the sibling worktree `<parent>/<name>--<KEY>-<slug>`. `<KEY>` is the Jira card (`ABC-123`), `<slug>` is 2–5 kebab-case words from the card title.

```bash
git -C <parent>/<name> fetch origin
git -C <parent>/<name> worktree add <parent>/<name>--<KEY>-<slug> -b <branch> origin/<base>
```

- Reading, refinement, and spec writing may happen in the original checkout. Code, review, QA, fixes, and the PR happen in the worktree.
- If `<branch>` is already checked out somewhere, stop and say where. Reuse an existing worktree for the same `<KEY>` instead of creating a second one.
- Never create worktrees in `/tmp`, inside the repo, or in the home directory: `ship-workitem` only cleans the sibling pattern.

Parallel slices (see `implement-workitem`) get their own worktree `<parent>/<name>--<KEY>-<slug>--s<N>` on branch `<branch>--s<N>`, created from the integration branch tip.

## Branch names

Read the repo's own convention first: `CONTRIBUTING.md`, commitlint config, `AGENTS.md`, `docs/architecture/standards/git.md`, or a consistent `git log` style. When the repo has one, use it. Otherwise:

| Jira type | Branch |
|---|---|
| Story | `feat/<KEY>-<slug>` |
| Bug | `fix/<KEY>-<slug>` |
| Habilitador | `chore/<KEY>-<slug>` (or `refactor/`, `docs/`, `ci/` when that is what it is) |

## Commits

Conventional Commits with the Jira key, unless the repo says otherwise:

```
<type>(<scope>): <subject>

<body: why, not what>

Refs: <KEY>
```

- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`.
- The subject is imperative and in English.
- One logical change per commit. A red test and the code that turns it green may share a commit.
- Never commit secrets, `.env` files, or evidence binaries (`.workitem-evidence/` is git-ignored).

## Evidence folder

`.workitem-evidence/<KEY>/` lives in the worktree root and is added to `.git/info/exclude` (not `.gitignore`, so no repo change is needed). It holds `plan.md` handoffs, review reports, QA reports, screenshots, and screencasts. Secrets are replaced with `<REDACTED>` before anything is saved.
