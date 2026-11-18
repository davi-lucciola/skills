#!/usr/bin/env bash
# Feed sample tool calls to each guard and check allow / deny.
# Usage: bash plugins/davi/hooks/tests/test_guards.sh
set -u
HOOKS="$(cd "$(dirname "$0")/.." && pwd)"
PROJ="$(mktemp -d)/app"
mkdir -p "$PROJ" "${PROJ}--ABC-12-login"
export CLAUDE_PROJECT_DIR="$PROJ"
# Isolate from the developer's ~/.claude/davi.json switches.
export HOME="$(mktemp -d)"
git -C "$PROJ" init -q -b feat/ABC-12-login >/dev/null 2>&1
fail=0

run() { # guard expected(deny|allow) json
  local out
  out="$(printf '%s' "$3" | python3 "$HOOKS/$1.py")"
  if [[ "$out" == *'"deny"'* ]]; then got=deny; else got=allow; fi
  if [[ "$got" != "$2" ]]; then
    echo "FAIL $1 expected $2 got $got: $3"; fail=1
  else
    echo "ok   $1 $2"
  fi
}
bash_call() { python3 -c 'import json,sys; print(json.dumps({"hook_event_name":"PreToolUse","tool_name":"Bash","cwd":sys.argv[2],"tool_input":{"command":sys.argv[1]}}))' "$1" "${2:-$PROJ}"; }

# guard-secrets
run guard-secrets deny  "$(bash_call 'cat .env')"
run guard-secrets deny  '{"tool_name":"Read","tool_input":{"file_path":"/x/app/.env.local"}}'
run guard-secrets deny  "$(bash_call 'cat ~/.ssh/id_ed25519')"
run guard-secrets allow '{"tool_name":"Read","tool_input":{"file_path":"/x/app/.env.example"}}'
run guard-secrets allow "$(bash_call 'python3 /home/u/.claude/plugins/cache/davi-lucciola/davi/0.2.0/scripts/env-check.py --file .env.local')"
run guard-secrets deny  "$(bash_call 'python3 scripts/env-check.py; cat .env')"

# guard-key-literals
run guard-key-literals deny  '{"hook_event_name":"PreToolUse","tool_name":"Write","tool_input":{"file_path":"a.ts","content":"const k = \"ghp_abcdefghijklmnopqrstuvwxyz0123456789\""}}'
run guard-key-literals allow '{"hook_event_name":"PreToolUse","tool_name":"Write","tool_input":{"file_path":"a.ts","content":"const k = process.env.GITHUB_TOKEN"}}'
run guard-key-literals allow '{"hook_event_name":"PreToolUse","tool_name":"Edit","tool_input":{"file_path":"a.md","new_string":"token: <your-token>"}}'

# guard-protected-push
run guard-protected-push allow "$(bash_call 'git push -u origin feat/ABC-12-login')"
run guard-protected-push allow "$(bash_call 'git push origin --delete feat/ABC-12-login')"
run guard-protected-push allow "$(bash_call 'git push --force-with-lease origin feat/ABC-12-login')"
run guard-protected-push deny  "$(bash_call 'git push origin main')"
run guard-protected-push deny  "$(bash_call 'git push origin HEAD:develop')"
run guard-protected-push deny  "$(bash_call 'git push --force origin master')"

# guard-delete-outside
run guard-delete-outside allow "$(bash_call 'rm -rf node_modules')"
run guard-delete-outside allow "$(bash_call "rm -rf ${PROJ}--ABC-12-login/dist")"
run guard-delete-outside allow "$(bash_call 'rm -rf /tmp/scratch-x')"
run guard-delete-outside deny  "$(bash_call 'rm -rf ~')"
run guard-delete-outside deny  "$(bash_call 'rm -rf /etc/nginx')"
run guard-delete-outside deny  "$(bash_call 'rm -rf ../../../../usr/local/other-repo')"

# switch off through ~/.claude/davi.json
mkdir -p "$HOME/.claude" && echo '{"guards":{"guard-protected-push":false}}' > "$HOME/.claude/davi.json"
run guard-protected-push allow "$(bash_call 'git push origin main')"

exit $fail
