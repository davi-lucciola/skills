# Seams vocabulary

Short shared terms for talking about where tests go and how deep a module is. `spec-workitem` uses them to propose seams, and `review-workitem` uses them for deepening follow-ups.

| Term | Meaning |
|---|---|
| **Module** | Anything with an interface and an implementation: a function, a class, a package, a service. |
| **Interface** | What a caller must know to use the module: signatures, inputs, outputs, errors, and the rules about calling it. |
| **Depth** | How much useful behavior hides behind how small an interface. A deep module does a lot behind a small interface. A shallow module's interface is nearly as complex as its implementation. |
| **Seam** | A place where behavior can be observed or substituted without editing the code around it: a public function, an HTTP route, a CLI command, a queue consumer, a UI page. Tests live at seams. |
| **Adapter** | The code at a system boundary (database, external API, clock, filesystem) that turns the outside world into the module's own terms. Adapters are the only place a test swaps in a fake. |
| **Leverage** | How many callers or behaviors a change in one place affects. |
| **Locality** | Whether the knowledge needed to change a behavior sits in one place or is spread across call sites. |

## Choosing seams

- Prefer seams the code already has.
- Go as high as possible: the highest seam that still runs fast and deterministically catches the most real bugs per test.
- Use as few as possible. One is ideal for a small change.
- For each seam, write one line on what it catches and what it misses.

## Deletion test

Ask what would vanish if a module were removed. If the answer is "nothing, the callers would just call the thing underneath", the module is shallow: a pass-through, a wrapper, a factory with one product. Shallow modules are candidates for deletion (`ponytail` Lean findings) or for deepening (`review-workitem` follow-ups), never for new tests of their own.
