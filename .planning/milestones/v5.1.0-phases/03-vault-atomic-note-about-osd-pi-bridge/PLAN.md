# Phase 3: Vault — atomic note about `osd-pi-bridge`

## Goal

Criar nota atômica no vault sobre `osd-pi-bridge` (skill local do omni-spec-driven
que faz bridge pra gsd-pi). Atomic = standalone, linkable, sem duplicar info.

## Tasks

### T3.1 — Criar `30-RECURSOS/osd-pi-bridge.md`

- Frontmatter: tipo, tags, status, criado, relacionado
- Conteúdo: o que faz, quando usar, fallback chain, localização, cross-refs
- Sem `[[wiki-link]]` que dependa de nota ainda não existente
- Cross-linkar omni-spec-driven-rebrand-v5.1 e omni-sdk-per-runtime-naming

**Files:** `~/GitHub/obsidian-vault/ideaverse/30-RECURSOS/osd-pi-bridge.md`
**Verify:** `ls ~/GitHub/obsidian-vault/ideaverse/30-RECURSOS/osd-pi-bridge.md` exists

### T3.2 — Marcar Phase 3 como completed

- ROADMAP.md: `[ ]` → `[x]`
- STATE.md: Phase 3 na tabela como complete

**Files:** `.planning/ROADMAP.md`, `.planning/STATE.md`

## Out of scope

- Testar o bridge (Phase 4)
- Documentar omni-spec-driven (já tem README no repo)
- Commitar no vault (auto-sync cuida)

## Verification

- [x] `osd-pi-bridge.md` existe em `30-RECURSOS/`
- [x] Frontmatter tem tags `osd-pi-bridge, gsd-pi, skill, omni-spec-driven, bridge`
- [x] Cross-links `[[omni-spec-driven-rebrand-v5.1]]` e `[[omni-sdk-per-runtime-naming]]` presentes
- [x] Phase 3 marcada como complete
