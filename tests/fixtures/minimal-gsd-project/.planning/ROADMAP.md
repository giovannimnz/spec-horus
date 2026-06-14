# Roadmap

## Milestone v0.1.0 — Fixture bootstrap

**Goal:** Provide a stable fake GSD project for smoke tests.

- [ ] Phase 1: fixture bootstrap

### Phase 1: fixture bootstrap
**Goal:** Provide a stable fake GSD project for smoke tests.
**Mode:** standard
**Success Criteria**:
1. `state --cwd` returns valid JSON
2. `graphify build --cwd` creates `.planning/graphs/graph.json`
3. `roadmap analyze --cwd` returns one phase
