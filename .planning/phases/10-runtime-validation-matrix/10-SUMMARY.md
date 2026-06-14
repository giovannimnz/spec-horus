---
status: complete
phase: 10
completed: 2026-06-06
---

# Phase 10: Runtime validation matrix — Summary

## What was built

Validação runtime real dos 5 pacotes gerados:
- Hermes install smoke em `HERMES_HOME=/tmp/...`
- Claude install smoke em `HOME=/tmp/...`
- Codex/Gemini/Copilot install/layout smoke em diretórios temporários
- matrix consolidada em `docs/RUNTIME-VALIDATION-MATRIX.md`

Também corrigi 3 bugs/discrepâncias reais:
1. `dist/hermes/install.sh` não criava o diretório do adapter
2. `dist/claude/install.sh` assumia flat files inexistentes
3. Docs/manifests diziam `4-16`, mas o artefato real é `4-15`

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| D-10.1 | Corrigir runtime bugs dentro da phase | Validation sem correção deixaria suite vermelha sem ganho real |
| D-10.2 | Atualizar docs para `4-15` | Código real entrega 15 flat commands; docs devem refletir realidade |
| D-10.3 | Serializar suite com `--test-concurrency=1` | `builder` regenera `dist/`; paralelo gerava race condition |
| D-10.4 | Testar Copilot via repo temporário com `.github/prompts/` | Install target é local ao repo, não HOME-based |

## Files Created/Modified

- `bin/builder.js`
- `dist/hermes/install.sh`
- `dist/claude/install.sh`
- `dist/claude/README.md`
- `README.md`
- `SETUP.md`
- `CHANGELOG.md`
- `horus-spec-driven.json`
- `docs/UNIFIED-COMMANDS.yaml`
- `docs/RUNTIME-VALIDATION-MATRIX.md`
- `tests/runtime-install.test.js`
- `package.json`
- `docs/TESTING.md`
- `.planning/phases/10-runtime-validation-matrix/10-PLAN.md`
- `.planning/phases/10-runtime-validation-matrix/10-SUMMARY.md`

## Verification

- [x] `npm test` green
- [x] 20 tests passed
- [x] Hermes install smoke passed
- [x] Claude install smoke passed
- [x] Codex install smoke passed (15 prompts)
- [x] Gemini install smoke passed (15 commands)
- [x] Copilot install smoke passed (15 prompts)
- [x] Runtime matrix markdown created
- [x] Docs/manifests aligned to `4-15`
