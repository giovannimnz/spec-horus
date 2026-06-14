# Phase 5: Vault 21.06 — formalize D-20 SDK naming

## Goal

Adicionar nota cross-repo na D-20 de `21.06-Decisoes-v5.md` explicando que:
- Este repo (`horus-spec-driven`) usa `horus-sdk-<runtime>`
- Repo sucessor (`omni-spec-driven`) usa `omni-sdk-<runtime>`
- São **duas convenções distintas em repos distintos** — não migrar.

## Tasks

### T5.1 — Patch `21.06-Decisoes-v5.md` D-20

- Adicionar parágrafo "Convenção de naming neste repo" (já está `horus-sdk-<runtime>`)
- Adicionar parágrafo "Convenção no projeto sucessor" (cross-link omni-spec-driven)
- Cross-link `[[omni-spec-driven-rebrand-v5.1]]`

**Files:** `~/GitHub/obsidian-vault/ideaverse/20-PROJETOS/21-PROJETOS-ATIVOS/horus-spec-driven/21.06-Decisoes-v5.md`
**Verify:** `grep -A 2 "Convenção de naming" 21.06-Decisoes-v5.md` retorna o parágrafo

### T5.2 — Marcar Phase 5 como completed

**Files:** `.planning/ROADMAP.md`, `.planning/STATE.md`

## Out of scope

- Renomear `horus-sdk-hermes` → outro nome (D-1.2)
- Migrar para `omni-sdk-*` (vai contra D-1.1)

## Verification

- [x] D-20 tem nota cross-repo
- [x] `[[omni-spec-driven-rebrand-v5.1]]` referenciado
- [x] Phase 5 marcada como complete
