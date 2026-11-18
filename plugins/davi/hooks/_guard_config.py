"""Shared switch for the davi guard hooks.

A guard is on unless ~/.claude/davi.json sets "guards": {"<guard-name>": false}.
Errors reading the file leave the guard on.
"""
import json
import os


def disabled(name):
    try:
        with open(os.path.expanduser("~/.claude/davi.json")) as fh:
            return (json.load(fh).get("guards") or {}).get(name) is False
    except Exception:
        return False
