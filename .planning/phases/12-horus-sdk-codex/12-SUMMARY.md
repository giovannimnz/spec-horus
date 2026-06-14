---
status: complete
phase: 12
title: horus-sdk-codex
completed: 2026-06-13
---

# Phase 12: horus-sdk-codex — Summary

## Resultado

- Criado `bin/lib/horus-sdk-codex/` como SDK HSD específico para Codex.
- `bin/builder.js --runtime=codex` agora gera `dist/codex/adapter/`.
- `dist/codex/install.sh` é self-contained via `SCRIPT_DIR` e instala prompts, agents e `horus-sdk-codex` em `CODEX_HOME`.
- Prompts Codex gerados recebem `<horus_sdk_adapter runtime="codex">` com o comando oficial do SDK.
- Docs públicas, matrix runtime, SETUP, CHANGELOG e testes atualizados.

## Decisões

| ID | Decisão | Alternativas | Razão |
|---|---|---|---|
| D12.1 | `horus-sdk-codex` separado | adapter genérico / reaproveitar `horus-sdk-hermes` direto | Padrão `horus-sdk-<runtime>`; evita acoplamento entre runtimes. |
| D12.2 | Núcleo filesystem reaproveitado do Hermes | reimplementar do zero | Verbos operam `.planning/`; o runtime muda home/skills, não parser principal. |
| D12.3 | Instalar em `~/.codex/skills/horus-sdk-codex/` | `~/.codex/adapter/` / só prompts | Codex já usa `~/.codex/skills`; prompts podem referenciar path direto. |
| D12.4 | Install scripts self-contained via `SCRIPT_DIR` | depender do cwd do repo | `dist/<runtime>/install.sh` precisa rodar de qualquer diretório. |
| D12.5 | Tests de graphify usam cópia temporária da fixture | escrever no fixture versionado | Teste não deve deixar working tree suja. |

## Arquivos principais

- `bin/lib/horus-sdk-codex/`
- `bin/builder.js`
- `bin/install.js`
- `dist/codex/adapter/`
- `dist/codex/install.sh`
- `tests/builder-install.test.js`
- `tests/sdk-smoke.test.js`
- `tests/harness.test.js`
- `docs/HORUS-SDK-CODEX.md`

## Validação

```bash
node --check bin/builder.js
node --check bin/install.js
node --check bin/lib/horus-sdk-codex/index.cjs
bun run build
bun run test
node dist/codex/adapter/index.cjs config-get workflow.ui_phase --cwd tests/fixtures/minimal-gsd-project
node dist/codex/adapter/index.cjs roadmap analyze --cwd tests/fixtures/minimal-gsd-project
CODEX_HOME=$(mktemp -d) bash dist/codex/install.sh
git diff --check
```

Resultado observado:

- `bun run test`: 25 pass, 0 fail.
- `bun run build`: 108 files across 5 runtimes.
- `dist/codex/adapter`: 15 files.
- `CODEX_HOME` temp: 15 prompts, 3 agents, SDK instalado.
- Secret scan: clean.

## Pendências

- Push remoto não executado.
- ACP real continua indisponível no `codex-cli 0.139.0`.
- Gemini/Copilot ainda não têm SDK dedicado.
