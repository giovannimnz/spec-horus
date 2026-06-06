# Phase 10: Runtime validation matrix

## Goal

Validar os 5 pacotes gerados por runtime e consolidar uma matrix objetiva:
install real quando existe script, layout/naming quando install não é o foco.

## Tasks

### T10.1 — Hermes install smoke
- instalar em `HERMES_HOME=/tmp/...`
- validar 4 skills + 3 agents + adapter path

### T10.2 — Claude install smoke
- instalar em `HOME=/tmp/...`
- corrigir script se layout real divergir do esperado
- validar 4 skills flat em `~/.claude/skills/`

### T10.3 — Codex/Gemini/Copilot layout smoke
- contar arquivos esperados
- validar nomes e extensões
- registrar caveats de install target

### T10.4 — Emitir matrix markdown
- runtime
- format
- install path
- install smoke
- caveats

## Verification
- Hermes install green
- Claude install green
- Codex/Gemini/Copilot layout smoke green
- matrix markdown criada
