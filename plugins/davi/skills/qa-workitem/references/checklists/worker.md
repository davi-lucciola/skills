# Worker / jobs / consumers checklist

Each item that applies becomes a case with id `WRK-<item>`. The evidence is the command that enqueues or triggers the job, the logs, and the resulting state.

| Id | Check | Bug when |
|---|---|---|
| WRK-happy | A valid message or trigger produces the specified effect | The effect is missing or wrong |
| WRK-idempotency | The same message processed twice has a single effect | A duplicate effect |
| WRK-invalid | A malformed or unknown message goes to the dead-letter path or is rejected with a log | A crash loop, a silent drop, or a poisoned queue |
| WRK-retry | A transient failure is retried with backoff, up to the limit | No retry, infinite retries, or retries without backoff |
| WRK-ordering | Ordering or concurrency assumptions in the spec hold | A race produces the wrong final state |
| WRK-observability | Logs and metrics identify the message and outcome, without PII | No correlation id, or PII or secrets in the logs |
| WRK-schedule | Cron or schedule timing and timezone, when applicable | It runs at the wrong time or zone, or overlapping runs |
