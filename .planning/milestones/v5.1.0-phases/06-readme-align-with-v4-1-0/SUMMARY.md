---
status: complete
phase: 6
completed: 2026-06-06
---

# Phase 6: README — align with v4.1.0

## What was done

Seção "Instalação" do README.md reescrita:
- Adicionado `npm run build` / `npm run build:<runtime>` (alternativas amigáveis)
- Adicionado `npm run install` (alternativa ao install manual)
- Removido `node bin/install.js language en` (subcommand inexistente)
- Removido "# Sync diário" duplicado

## Key Decisions

| # | Decisão | Razão |
|---|---------|-------|
| D-6.1 | Adicionar `npm run build` (não só `node bin/builder.js --all`) | npm scripts são mais user-friendly que CLI direto |
| D-6.2 | Manter ambos formatos (npm + node) | Compatibilidade: usuário pode usar o que preferir |
| D-6.3 | Remover `install.js language en` | Subcommand não existe no binário; confunde leitor |
| D-6.4 | Sync único e claro | "# Sync diário" duplicado era bug visual óbvio |

## Files Created/Modified

- `README.md` (instalação: 14 → 22 linhas, mais detalhada)
- `.planning/phases/06-readme-align-with-v4-1-0/PLAN.md` (new)
- `.planning/phases/06-readme-align-with-v4-1-0/SUMMARY.md` (this file)
- `.planning/ROADMAP.md` — Phase 6 checkbox

## Verification

- [x] `grep -c "npm run build" README.md` = 3 (quick start + build:hermes + build:claude)
- [x] `grep -c "language en" README.md` = 0 (bug removido)
- [x] `grep -c "^# Sync diário" README.md` = 1 (dedup)
- [x] Phase 6 marcada como complete
