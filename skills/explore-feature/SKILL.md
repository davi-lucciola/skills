---
name: explore-feature
description: "Read a repository and its docs for a feature and return a cited note of files, business rules, and open gaps. Use when implement-feature launches an explorer, or when the user asks to explore a codebase before planning a change."
---

# Explore a feature

You are the explorer. Read the repo and its docs. Return one note. The parent writes the plan. On a single repo the parent may do this reading itself and follow this skill.

The parent launches you on its own model. The launch rule is [hosts.md](../implement-feature/references/hosts.md).

## What you read

Read the paths the feature is likely to touch, and the docs next to them. When `GLOSSARY.md` exists, use its words in the note. When an ADR sits next to the area you read, cite it.

Primary sources are this repo and its docs. Cite the file for each claim.

A **seam** is where a caller observes behavior through the public interface. Name the seams and the interfaces the feature already has, so the parent can put them on the contract.

## The note

Return the note in the response. Write it to disk only when the parent gives you a path outside the original checkout.

Cover:

- Relevant files, each with the role it plays.
- Docs found, each with the path.
- Business rules already in the product, each tied to a file. Write each rule so the parent can place it under MODIFIED or REMOVED. A behavior the product does not have stays an open gap. The parent may turn that gap into an ADDED requirement.
- Open gaps: a business or technical question the repo and the docs leave unanswered.
- Seams and interfaces the parent will turn into a contract.

Done when a reader can point at a file for every rule, and every gap is a question rather than a guess.

Leave the tree as you found it. The parent turns the gaps into the plan.
