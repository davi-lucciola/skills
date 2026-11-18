# Notice

The guard scripts in this folder (`guard-secrets.py`, `guard-key-literals.py`, `guard-protected-push.py`, `guard-delete-outside.py`) are adapted from [EricTechPro/super-board](https://github.com/EricTechPro/super-board), `hooks/`. `scripts/env-check.py` is a Python rewrite of its `scripts/super-board-env-check.sh`.

What changed:
- Each guard can be switched off through `"guards"` in `~/.claude/davi.json` (`_guard_config.py`).
- `guard-protected-push` protects `develop`, `main`, and `master` plus `DAVI_PROTECTED_BRANCHES`, and points to the davi PR flow.
- `guard-delete-outside` treats the sibling work item worktrees (`<name>--*`) as part of the project.
- `guard-secrets` allows the plugin's `env-check.py` instead of `super-board-env-check.sh`.

Original license:

```
MIT License

Copyright (c) 2026 Eric Tech

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
