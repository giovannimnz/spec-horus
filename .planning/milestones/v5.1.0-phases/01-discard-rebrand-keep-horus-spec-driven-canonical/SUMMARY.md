---
status: complete
phase: 1
completed: 2026-06-06
---

# Phase 1: Discard rebrand — keep horus-spec-driven as canonical

## What was done

Decisão registrada: `horus-spec-driven` permanece o nome canônico deste repo.
O rebrand v5.1 (`horus` → `omni`) foi feito num repo separado
(`giovannimnz/omni-spec-driven`, público, GitHub). Este repo continua legacy.

Nenhuma mudança de código. Apenas decisão + traceability.

## Key Decisions

| # | Decisão | Razão |
|---|---------|-------|
| D-1.1 | NÃO aplicar rebrand aqui | Já existe repo público `omni-spec-driven` com v5.1. Duplicar gera fork-drift e merge hell. |
| D-1.2 | Manter `horus-sdk-hermes` (não `omni-sdk-hermes`) | Convenção `omni-sdk-<runtime>` é do outro repo. Aqui `horus-sdk-<runtime>` é canônico. |
| D-1.3 | Adicionar nota cross-repo no vault | Pra deixar registrado que existe um repo paralelo mais novo. |

## Files Created/Modified

- `.planning/STATE.md` — atualizado: blocker removido, decisão D-1.1 documentada
- `.planning/phases/01-discard-rebrand-keep-horus-spec-driven-canonical/SUMMARY.md` (this file)

## Verification

- [x] `git log --oneline -1` mostra commit da fase
- [x] `git grep "horus-spec-driven" -- ':!.planning' | wc -l` ≥ 1 (nome preservado)
- [x] Não há mudança em `bin/`, `dist/`, `package.json`, `unified-skills/`

## Cross-repo note (forwarded to Phase 3)

Phase 3 (vault atomic note) deve referenciar o repo paralelo:
`https://github.com/giovannimnz/omni-spec-driven`
