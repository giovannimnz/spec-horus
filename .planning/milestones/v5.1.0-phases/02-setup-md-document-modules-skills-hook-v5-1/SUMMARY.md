---
status: complete
phase: 2
completed: 2026-06-06
---

# Phase 2: SETUP.md — document `modules/skills/` hook v5.1

## What was done

SETUP.md reescrito com layout v4.1+ (4 skills unificadas) e seção "Local Skills
(v5.1+, omni-spec-driven only)" explicando que o hook `modules/skills/<name>/`
é feature do projeto sucessor, não deste legacy.

## Key Decisions

| # | Decisão | Razão |
|---|---------|-------|
| D-2.1 | SETUP.md reflete layout v4.1 (4 skills), não v3 (17 skills) | Coerência com CHANGELOG v4.1.0 + estado real do `unified-skills/` |
| D-2.2 | Seção "Local Skills" cross-linka omni-spec-driven | Usuário do legacy precisa saber que hook v5.1 existe em outro repo |
| D-2.3 | Atualizar também Layout Claude/Codex/Gemini/Copilot | Mesmo arquivo, mesma defasagem — consertar tudo de uma vez |
| D-2.4 | NÃO implementar hook v5.1 neste repo | Decisão D-1.1 (legacy estável) prevalece |

## Files Created/Modified

- `SETUP.md` (124 → 130 linhas) — layout v4.1, remove prefixos v3 stale, adiciona "Local Skills"
- `.planning/phases/02-setup-md-document-modules-skills-hook-v5-1/PLAN.md` (new)
- `.planning/phases/02-setup-md-document-modules-skills-hook-v5-1/SUMMARY.md` (this file)

## Verification

- [x] `grep -c "hsd-po\|hsd-front\|hsd-back" SETUP.md` = 0 (zero stale prefixes)
- [x] `grep -c "hsd-pm/SKILL.md\|hsd-dev/SKILL.md" SETUP.md` = 4 (new layout present)
- [x] Seção "## Local Skills (v5.1+, omni-spec-driven only)" presente
- [x] Cross-link `https://github.com/giovannimnz/omni-spec-driven` presente
- [x] Phase 2 marcada como completed no ROADMAP

## Out of scope (deferred)

- Implementar hook `modules/skills/<name>/` neste repo (vai contra D-1.1)
- Atualizar SETUP.md de outros paths (daily sync details, PM2 systemd, etc.)
