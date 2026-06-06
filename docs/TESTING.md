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

Current coverage (Phase 7 baseline):
- fixture presence
- SDK `state load`
- SDK `graphify build`

## Next phases

- Phase 8: expand SDK smoke tests (`config-get`, `roadmap`, `validate`, `frontmatter.get`)
- Phase 9: smoke tests for `builder.js` and `install.js`
- Phase 10: runtime validation matrix for Hermes/Claude/Codex/Gemini/Copilot
