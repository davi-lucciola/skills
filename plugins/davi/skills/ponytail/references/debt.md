# Shortcut ledger

Every deliberate shortcut is marked with a comment naming its limit and its upgrade trigger. This ledger collects them so a deferral can't quietly become permanent. Adapted from `ponytail-debt` in [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) (MIT).

## Marker

```
shortcut(<KEY>): <the limit>, <when to upgrade>
shortcut: <the limit>, <when to upgrade>
```

The card key is optional but preferred: it ties the debt to the work item that took it.

## Scan

Whole repo, skipping `.git` and everything ignored:

```bash
git grep -nE '(#|//|/[*]|--|<!--) ?(shortcut|ponytail)(\([A-Z][A-Z0-9]+-[0-9]+\))?:'
```

Only what a merged PR introduced (used by `ship-workitem`):

```bash
git diff <merge-base>..<merge-commit> -U0 | grep -nE '^\+.*(#|//|/[*]|--|<!--) ?(shortcut|ponytail)(\([A-Z][A-Z0-9]+-[0-9]+\))?:'
```

Skip hits that are not a deferral, such as a note about a keyboard shortcut.

## Output

One row per marker, grouped by file:

```
<file>:<line>, <what was simplified>. limit: <the limit>. upgrade: <the trigger>. card: <KEY or ->
```

A marker with no upgrade trigger gets a `no-trigger` tag. Those are the ones that silently rot.

End with `<N> markers, <M> with no trigger.` Nothing found: `No shortcut debt.`

## Turning debt into cards

The ledger only reports. When the developer asks, each row (or a group of rows on the same module) becomes a Habilitador card through `create-workitem habilitador`, titled "Dívida técnica: …" with only the project label, the marker location in Context, and the upgrade trigger as the goal. Show the cards before creating them.
