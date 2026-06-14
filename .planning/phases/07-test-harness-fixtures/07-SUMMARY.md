---
status: complete
phase: 7
completed: 2026-06-06
---

# Phase 7: Test harness + fixtures — Summary

## What was built

Criado o baseline de testes do projeto: fixture mínima GSD, helper de subprocesso
para CLI/SDK e primeiro harness automatizado com Node test runner.

Isso dá base reutilizável para as próximas fases (`SDK smoke`, `builder/install smoke`,
`runtime matrix`) sem depender do repo real do usuário.

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| D-7.1 | Node built-in test runner (`node:test`) | Zero deps, compatível com a restrição do repo |
| D-7.2 | Fixture GSD mínima em `tests/fixtures/minimal-gsd-project/` | Reproduz `.planning/` sem depender do repo principal |
| D-7.3 | Helper único `tests/helpers/run-cli.js` | Evita duplicar `spawnSync` em cada teste |
| D-7.4 | Smoke baseline só em `state` + `graphify build` | Suficiente pra provar harness antes de expandir Phase 8 |

## Files Created/Modified

- `package.json`
- `tests/helpers/run-cli.js`
- `tests/fixtures/minimal-gsd-project/.planning/config.json`
- `tests/fixtures/minimal-gsd-project/.planning/PROJECT.md`
- `tests/fixtures/minimal-gsd-project/.planning/STATE.md`
- `tests/fixtures/minimal-gsd-project/.planning/ROADMAP.md`
- `tests/fixtures/minimal-gsd-project/src/sample.js`
- `tests/harness.test.js`
- `docs/TESTING.md`
- `.planning/phases/07-test-harness-fixtures/07-PLAN.md`
- `.planning/phases/07-test-harness-fixtures/07-SUMMARY.md`

## Verification

- [x] `npm test` green
- [x] 3 tests passed
- [x] fixture has valid `.planning/` substrate
- [x] SDK `state load` works against fixture
- [x] SDK `graphify build` creates `.planning/graphs/graph.json`
