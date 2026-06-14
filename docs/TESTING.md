# Testing

## Scope

This document describes the test harness introduced in milestone v5.2.0.
It exists to validate `horus-spec-driven` without depending on a live user repo.

## Fixture

Path:

```bash
tests/fixtures/minimal-gsd-project/
```

Contains:
- minimal `.planning/` substrate
- one `src/sample.js` code file
- no external dependencies

## Running tests

```bash
npm test
```

Current coverage (Phase 7 baseline, expanded by Phase 8-10):
- fixture presence
- SDK `state load`
- SDK `graphify build`
- SDK smoke verbs (`config-get`, `roadmap`, `validate`, `frontmatter.*`, `phase.mvp-mode`)
- Codex SDK smoke verbs (`config-get`, `roadmap`, unknown verb failure)
- runtime install smoke (Hermes/Claude/Codex/Gemini/Copilot)

## Test runner note

The suite runs with `--test-concurrency=1`.

Reason: some tests intentionally regenerate `dist/` (`builder --all`) while others
consume those generated artifacts (`install.sh`). Running them in parallel causes
race conditions and flaky false negatives.