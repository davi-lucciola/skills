# API checklist

Each item that applies becomes a case with id `API-<item>`. The evidence is the `curl -sS -i` command and the full response.

| Id | Check | Bug when |
|---|---|---|
| API-contract | The response shape, types, and field names match the documented contract (OpenAPI, GraphQL schema, `design.md`) | A missing or extra field, a wrong type, or a breaking change not marked **BREAKING** |
| API-status | Status codes are correct for success, validation errors, not found, conflict, and server errors | A 200 with an error body, a 500 for bad input, or a 404 vs 403 leak |
| API-validation | Invalid, missing, oversized, and boundary inputs are rejected with a clear error | Accepted bad input, or an unhelpful or leaky error message (stack trace, SQL) |
| API-authn | No token, an invalid token, or an expired token is rejected | The endpoint is reachable without valid authentication |
| API-authz | Another user's or tenant's resource is not accessible | IDOR: data of another user or tenant is returned or modified |
| API-idempotency | Retrying a mutating request does not duplicate effects, when the spec requires it | A duplicate record or a double charge on retry |
| API-pagination | Limits, cursors or pages, ordering, and the empty page | Missing or repeated items across pages, or an unbounded page size |
| API-persistence | The DB state after the call matches the spec (read-only query) | Missing, wrong, or orphan rows |
| API-errors-downstream | Downstream failure or timeout (when it can be simulated) | A hang, an unclear 500, or a partial write without rollback |
