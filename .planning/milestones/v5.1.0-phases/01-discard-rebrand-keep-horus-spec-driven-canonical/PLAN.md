# Phase 1: Discard rebrand — keep horus-spec-driven as canonical

## Goal

Registrar a decisão de que `horus-spec-driven` permanece o nome canônico deste
repo. Rebrand v5.1 vive em repo separado. Sem código novo.

## Tasks

### T1.1 — Documentar decisão no STATE.md

- Adicionar bloco "Decisions registered" com D-1.1, D-1.2, D-1.3
- Especificar: nome canônico, SDK naming convention, forward-reference pra Phase 3

**Files:** `.planning/STATE.md`
**Verify:** `grep -A 1 "D-1.1" .planning/STATE.md` retorna a decisão

### T1.2 — Marcar Phase 1 como completed no ROADMAP

- Trocar `[ ]` → `[x]` no heading da Phase 1
- Adicionar sufixo "✅ COMPLETE (2026-06-06)"

**Files:** `.planning/ROADMAP.md`
**Verify:** `grep "Phase 1.*COMPLETE" .planning/ROADMAP.md` retorna match

### T1.3 — Criar SUMMARY.md com key decisions

- Frontmatter: `status: complete`, `phase: 1`, `completed: 2026-06-06`
- Body: What was done / Key Decisions (D-1.1, D-1.2, D-1.3) / Files / Verification / Cross-repo note

**Files:** `.planning/phases/01-discard-rebrand-keep-horus-spec-driven-canonical/SUMMARY.md`
**Verify:** `head -5 SUMMARY.md` mostra `status: complete`

## Out of scope

- Qualquer mudança em `bin/`, `dist/`, `package.json`, `unified-skills/`
- Sync com vault (Phase 3 vai fazer)
- Rebrand real deste repo (decisão contrária)

## Verification

- [x] STATE.md contém bloco "Decisions registered" com D-1.1
- [x] ROADMAP.md marca Phase 1 como `[x]`
- [x] SUMMARY.md tem frontmatter `status: complete`
- [x] Nenhuma mudança fora de `.planning/`
- [x] `git grep "horus-spec-driven" -- ':!.planning'` ≥ 1 (nome preservado)
