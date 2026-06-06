# Phase 2: SETUP.md — document `modules/skills/` hook v5.1

## Goal

Documentar no SETUP.md a feature de auto-instalação de skills locais via
`modules/skills/<name>/SKILL.md` — mas com escopo fiel à realidade deste repo.

## Investigation finding

**Hook v5.1 NÃO existe neste repo (`horus-spec-driven`).** Verificado:
- `bin/install.js` só lê de `unified-skills/` ou `modules/<runtime>/skills/`
- `modules/` contém apenas: `caveman/`, `gsd-core/`, `impeccable/` (submodules upstream)
- Zero ocorrências de `modules/skills` no source
- O hook foi implementado no repo público **`giovannimnz/omni-spec-driven`**
  (vide log 2026-06-05 no vault)

## Tasks

### T2.1 — Adicionar seção "Local Skills (v5.1+)" no SETUP.md

- Nota explicativa: hook v5.1 (`modules/skills/<name>/SKILL.md` →
  `~/.hermes/skills/hsd/<name>/`) é uma feature do projeto sucessor
  `omni-spec-driven`, não deste legacy.
- Cross-link: `https://github.com/giovannimnz/omni-spec-driven`

**Files:** `SETUP.md`
**Verify:** `grep -A 2 "Local Skills" SETUP.md` retorna a seção

### T2.2 — Atualizar Layout Hermes pra refletir v4.1 (4 skills unificadas)

- SETUP.md atual mostra prefixos v3 (`hsd-po`, `hsd-pm`, `hsd-front`, `hsd-back`)
- v4.1 unificou em 4 skills: `hsd-pm`, `hsd-dev`, `hsd-qa`, `hsd-config`
- Atualizar exemplo `ls ~/.hermes/skills/hsd/` pra refletir layout atual

**Files:** `SETUP.md`
**Verify:** `grep -c "hsd-pm-discover\|hsd-front-ui\|hsd-back-debug" SETUP.md` = 0

### T2.3 — Marcar Phase 2 como completed no ROADMAP

**Files:** `.planning/ROADMAP.md`, `.planning/STATE.md`

## Out of scope

- Implementar o hook v5.1 neste repo (decisão D-1.1: este é legacy estável)
- Consertar todas as seções desatualizadas do SETUP.md (escopo focado)
- Mudar runtime paths

## Verification

- [x] Seção "Local Skills (v5.1+)" presente no SETUP.md
- [x] Layout Hermes mostra 4 skills unificadas
- [x] Cross-link pra `omni-spec-driven` presente
- [x] Nenhuma referência a `hsd-po-discover`, `hsd-front-ui`, etc.
