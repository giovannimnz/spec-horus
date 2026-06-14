---
status: complete
phase: 8
completed: 2026-06-06
---

# Phase 8: Hermes SDK smoke tests — Summary

## What was built

Ampliei a fixture da Phase 7 para casar com o parser real do adapter e criei
`tests/sdk-smoke.test.js` cobrindo os verbos críticos do `horus-sdk-hermes`.

A suite agora valida tanto o caminho feliz quanto o caminho de erro útil.

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| D-8.1 | Ajustar fixture pro formato `### Phase N:` | O parser de `roadmap.cjs` é simplificado e exige esse formato literal |
| D-8.2 | Testar dot-notation como CLI pública (`frontmatter.get`, `phase.mvp-mode`) | São pontos frágeis e fáceis de quebrar em refactor |
| D-8.3 | Cobrir unknown verb explicitamente | Error path é parte da UX da CLI |
| D-8.4 | Reusar `npm test` full-suite, não arquivo isolado | Garante que Phase 8 não quebra o baseline da Phase 7 |

## Files Created/Modified

- `tests/fixtures/minimal-gsd-project/.planning/ROADMAP.md`
- `tests/fixtures/minimal-gsd-project/.planning/phases/01-fixture-bootstrap/fixture-note.md`
- `tests/fixtures/minimal-gsd-project/.planning/phases/01-fixture-bootstrap/.gitkeep`
- `tests/sdk-smoke.test.js`
- `.planning/phases/08-hermes-sdk-smoke-tests/08-PLAN.md`
- `.planning/phases/08-hermes-sdk-smoke-tests/08-SUMMARY.md`

## Verification

- [x] `npm test` green
- [x] 11 tests passed
- [x] `config-get` covered
- [x] `roadmap analyze` covered
- [x] `roadmap get-phase` covered
- [x] `validate consistency` covered
- [x] `frontmatter.get` covered
- [x] `frontmatter.validate` covered
- [x] `phase.mvp-mode` covered
- [x] unknown verb error path covered
