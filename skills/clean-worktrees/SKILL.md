---
name: clean-worktrees
description: "Remove sibling worktrees of the original repo after their pull request is merged into that repo's integration branch."
disable-model-invocation: true
---

# Clean worktrees

The user invokes this skill. Remove each leftover sibling worktree once its pull request is merged into this repo's integration branch.

## 1. Resolve the original repo

The original repository is the main worktree on the first line of `git worktree list`, not a linked worktree. Call it `<original>` at `<parent>/<name>`.

A candidate is a directory whose path is `<parent>/<name>--<slug>` with a non-empty slug. The slug is that suffix. A branch prefix such as `feat/` stays on the branch name. Those directories are the siblings of `<original>`. A worktree registered at any other path stays off the list. When this session is already inside `<name>--<slug>`, the candidates are still the siblings of `<original>`, never children of the linked worktree.

Done when every candidate path matches `<parent>/<name>--<slug>` with a non-empty slug, and `<original>` itself is not a candidate.

## 2. Resolve the qualifying bases

Qualifying bases come from the remote `origin`. A name that exists only as a local branch stays out of the set.

`git -C <original> fetch origin`.

Read the default branch with `git -C <original> symbolic-ref --short refs/remotes/origin/HEAD`, and remove the `origin/` prefix. When that ref is missing, stop and report that the remote has no default branch.

For each of `develop`, `main`, and `master`, add the name when `refs/remotes/origin/<name>` exists. Add the default branch resolved above when its name is different. The qualifying set is those refs.

For each qualifying name, create the local branch from the remote when the local branch is absent:

`git -C <original> branch <name> origin/<name>`

That is the only way a local `develop`, `main`, or `master` is created here. An existing local branch stays where it is. The merge check uses `origin/<name>`, not commits that exist only on the local branch.

A pull request counts as landed when `state` is `MERGED` and `baseRefName` is one of those qualifying bases. A merge into any other base does not.

Done when every qualifying base is a branch on `origin`, and each missing local branch was created from `origin/<name>`.

## 3. Classify each candidate

`git -C <original> worktree list --porcelain` shows whether a candidate is a worktree of `<original>`. A `branch refs/heads/<branch>` line names the branch. A `detached` line means the checkout is detached. `git -C <worktree> rev-parse HEAD` is the tip. `git -C <worktree> status --porcelain` is the cleanliness check.

Run this command with its working directory set to `<original>`: `gh pr list --head <branch> --state all --json number,state,baseRefName,headRefOid,url`.

Keep the directory and report it when any of these is true:

- It is not a worktree of `<original>`.
- The checkout is detached, or the branch name is one of the qualifying bases resolved in step 2.
- That `gh pr list` returns no pull request.
- Any pull request for that head is `OPEN`.
- No pull request is `MERGED` into a qualifying base. A closed pull request that was not merged, and a merge into some other base, keep the directory.
- `git -C <worktree> status --porcelain` is non-empty.
- The branch tip is not the `headRefOid` of the merged qualifying pull request. A commit landed after that pull request.
- The process cwd is inside that worktree. Report that this session is inside it. Leave the directory in place.

A candidate is removable when there is a `MERGED` pull request whose base is qualifying, no open pull request for that head, the worktree is clean, the tip equals that pull request's `headRefOid`, and the session cwd is outside the directory.

Done when every candidate is removable or kept, and each kept directory has a reason from the list above.

## 4. Remove

Remove each removable candidate from `<original>`, in this order. Step 1 is `git worktree remove` with the path and without `--force`.

1. `git -C <original> worktree remove <path>`
2. `git -C <original> branch -d <branch>`. When `-d` refuses because the merge was a squash, `git -C <original> branch -D <branch>` is allowed only if the tip still equals the merged pull request `headRefOid` and the worktree was clean before removal.
3. `git -C <original> push origin --delete <branch>` only after step 2 succeeds. A remote ref that is already gone counts as done. When step 2 fails, the remote branch stays.

`.feature-evidence/` inside the worktree is removed with the directory. Do not copy it out.

One candidate failing leaves the others running.

Done when every removable candidate has finished this sequence, or its failure is recorded and the other candidates have continued.

## 5. Report

End with a report. Each candidate has its path, branch, pull request url, base, and whether it was removed or kept and why. For a removal, say that the worktree, the local branch, and the remote branch are gone, or that the remote was already absent.

Done when every candidate appears in that report.
