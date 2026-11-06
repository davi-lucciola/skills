---
name: explore-feature
description: "Read a repository and its docs for a feature and return a cited note of files, business rules, and open gaps. Use when implement-feature launches an explorer, or when the user asks to explore a codebase before planning a change."
---

# Explore a feature

You are the explorer. Read the repo and its docs. Return one note. The parent writes the contracts.

On Cursor the parent launches you as `composer-2.5` with fast off. On Codex, `gpt-5.6-luna` at reasoning effort low. On Claude Code, `haiku` at effort medium. When that model is unavailable, the parent launches you on its own model: `inherit` on Cursor, or with the model override omitted on Codex and Claude Code. The launch row is [hosts.md](../implement-feature/references/hosts.md).

## What you read

Read the paths the feature is likely to touch, and the docs next to them. When `GLOSSARY.md` exists, use its words in the note. When an ADR sits next to the area you read, cite it.

Primary sources are this repo and its docs. Cite the file for each claim.

## The note

Return the note in the response. Write it to disk only when the parent gives you a path outside the original checkout.

Cover all four:

- Relevant files, each with the role it plays.
- Docs found, each with the path.
- Business rules already in the product, each tied to a file.
- Open gaps: a business or technical question the repo and the docs leave unanswered.

Done when a reader can point at a file for every rule, and every gap is a question rather than a guess.

Leave the tree as you found it. The parent turns the gaps into contracts.
