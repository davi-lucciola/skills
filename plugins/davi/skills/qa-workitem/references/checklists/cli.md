# CLI checklist

Each item that applies becomes a case with id `CLI-<item>`. The evidence is the command, the exit code, stdout, and stderr.

| Id | Check | Bug when |
|---|---|---|
| CLI-happy | The specified command produces the specified output or effect | Wrong output or effect |
| CLI-exit | Exit code 0 on success and non-zero on each failure class | A zero exit on failure, or a non-zero exit on success |
| CLI-help | `--help` documents the new or changed flags | Missing or wrong help text |
| CLI-invalid | Unknown flags, missing arguments, and bad values give a clear message on stderr | A stack trace, a silent failure, or a message on stdout |
| CLI-io | It works with pipes and non-TTY output, and respects `NO_COLOR` when applicable | Broken output when piped, or ANSI codes in files |
| CLI-destructive | Destructive actions ask for confirmation or need `--yes`, and support `--dry-run` when the spec says so | Data is changed without confirmation |
