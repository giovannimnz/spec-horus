# Roadmap

## Milestone v0.1.0 — Fixture bootstrap

**Goal:** Provide a stable fake GSD project for smoke tests.

### [ ] **Phase 1: fixture bootstrap**

**Goal:** Create a valid minimal `.planning/` substrate and one code file.

Requirements: FIX-01
Success criteria:
1. `state --cwd` returns valid JSON
2. `graphify build --cwd` creates `.planning/graphs/graph.json`
3. The fixture can be copied without extra setup
