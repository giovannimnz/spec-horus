# Phase 8: Hermes SDK smoke tests

## Goal

Cobrir os verbos críticos do `horus-sdk-hermes` com smoke tests automatizados
contra a fixture mínima criada na Phase 7.

## Tasks

### T8.1 — Expand fixture pro parser real do adapter
- ROADMAP no formato `### Phase N:`
- `fixture-note.md` com frontmatter
- phase dir `01-fixture-bootstrap/`

### T8.2 — Add SDK smoke tests
- `config-get`
- `roadmap analyze`
- `roadmap get-phase`
- `validate consistency`
- `frontmatter.get`
- `frontmatter.validate`
- `phase.mvp-mode`
- unknown verb error path

### T8.3 — Re-run full test suite
- `npm test`

## Verification
- SDK tests green
- dot-notation verbs covered
- stderr message útil no unknown verb
