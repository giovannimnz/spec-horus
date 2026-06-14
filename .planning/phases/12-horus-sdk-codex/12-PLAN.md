---
status: planned
phase: 12
title: horus-sdk-codex
---

# Phase 12: horus-sdk-codex — Plan

## Objetivo

Criar o SDK HSD específico para Codex e integrá-lo ao builder/install/dist com smoke tests reais.

## Tarefas

- [x] Criar `bin/lib/horus-sdk-codex/` a partir do núcleo GSD/HSD existente.
- [x] Ajustar lookup de skills/agents para `CODEX_HOME` / `~/.codex`.
- [x] Fazer `bin/builder.js` emitir `dist/codex/adapter/`.
- [x] Tornar `dist/codex/install.sh` self-contained com `SCRIPT_DIR`.
- [x] Fazer install Codex copiar prompts, agents e `horus-sdk-codex`.
- [x] Adicionar smoke tests de builder, install e SDK.
- [x] Atualizar docs públicas e matrix runtime.

## Fora do escopo

- ACP real no Codex CLI. `codex-cli 0.139.0` não expõe `--acp`.
- SDK para Gemini/Copilot.
- Publicar/push remoto.

## Verificação

- `npm test`
- `npm run build`
- smoke direto em `dist/codex/adapter/index.cjs`
- install com `CODEX_HOME` temporário
