#!/usr/bin/env python3
"""Say which env keys are set, never what they hold.

The guard-secrets hook denies reading dotenv files, so this is the sanctioned way
for a skill (preflight) to ask "is KEY set?". It prints one word per key and no value.

Usage:
  env-check.py [--file <dotenv>] [KEY ...]

With no KEY, the keys are the names listed in .env.example (or .env.sample).
--file defaults to the first that exists of .env.local, .env.

Stdout, one line per key: KEY present | KEY empty | KEY missing
Exit: 0 every key present, 1 at least one empty or missing, 64 usage.
"""
import os
import re
import sys

LINE = re.compile(r"^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$")


def parse(path):
    out = {}
    with open(path, errors="replace") as fh:
        for raw in fh:
            m = LINE.match(raw)
            if m and not raw.lstrip().startswith("#"):
                out[m.group(1)] = m.group(2).strip().strip("\"'").strip()
    return out


def main(argv):
    file, keys, i = None, [], 0
    while i < len(argv):
        a = argv[i]
        if a == "--file" and i + 1 < len(argv):
            file, i = argv[i + 1], i + 2
            continue
        if a in ("-h", "--help"):
            print(__doc__.strip())
            return 0
        if a.startswith("-") or not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", a):
            print("invalid argument: %s" % a, file=sys.stderr)
            return 64
        keys.append(a)
        i += 1
    if not keys:
        example = next((f for f in (".env.example", ".env.sample") if os.path.isfile(f)), None)
        if not example:
            print("no KEY given and no .env.example found", file=sys.stderr)
            return 64
        keys = list(parse(example))
    if file is None:
        file = next((f for f in (".env.local", ".env") if os.path.isfile(f)), None)
    values = parse(file) if file and os.path.isfile(file) else {}
    rc = 0
    for k in keys:
        state = "missing" if k not in values else ("present" if values[k] else "empty")
        print("%s %s" % (k, state))
        rc = rc if state == "present" else 1
    return rc


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
