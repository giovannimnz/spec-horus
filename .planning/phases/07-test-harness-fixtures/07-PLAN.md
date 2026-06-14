# Phase 7: Test harness + fixtures

## Goal

Create a reproducible fixture and test harness that Phase 8-10 can reuse.

## Tasks

### T7.1 — Add Node test runner entrypoint
- add `npm test`
- use built-in `node:test`

### T7.2 — Create reusable CLI helper
- `tests/helpers/run-cli.js`
- helpers for SDK and builder subprocess invocation

### T7.3 — Create minimal fixture repo
- `tests/fixtures/minimal-gsd-project/`
- valid `.planning/` substrate
- one source file for graphify

### T7.4 — Add baseline harness tests
- fixture exists
- SDK `state load` works
- SDK `graphify build` works

### T7.5 — Document harness
- `docs/TESTING.md`

## Verification
- `npm test` green
- fixture generates `.planning/graphs/graph.json`
- no external install required
