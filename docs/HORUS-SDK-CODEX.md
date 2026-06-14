# horus-sdk-codex

## Objetivo

SDK Codex-native para o Horus Spec Driven. Ele dá ao Codex uma rota local e reproduzível para operar `.planning/` sem depender de `gsd-tools.cjs`, Hermes ou Claude Code.

## Instalação

```bash
npm run build:codex
bash dist/codex/install.sh
```

Destino global:

```text
~/.codex/skills/horus-sdk-codex/
```

## Uso

```bash
node ~/.codex/skills/horus-sdk-codex/index.cjs config-get workflow.ui_phase --cwd /path/to/repo
node ~/.codex/skills/horus-sdk-codex/index.cjs roadmap analyze --cwd /path/to/repo
node ~/.codex/skills/horus-sdk-codex/index.cjs validate consistency --cwd /path/to/repo
```

## Decisões

| ID | Decisão | Razão |
|---|---|---|
| D12.1 | Criar `horus-sdk-codex`, não adapter genérico | Segue padrão `horus-sdk-<runtime>` e evita `if runtime` dentro de um SDK comum. |
| D12.2 | Copiar o núcleo filesystem do `horus-sdk-hermes` | Os verbos GSD/HSD operam `.planning/`; o runtime muda o home/skills, não o parser principal. |
| D12.3 | Instalar em `~/.codex/skills/horus-sdk-codex/` | Codex já usa `~/.codex/skills`; prompts podem referenciar esse path diretamente. |
| D12.4 | `dist/codex/install.sh` self-contained via `SCRIPT_DIR` | Instalação precisa funcionar de qualquer cwd. |

## Validação

```bash
npm test
npm run build
node dist/codex/adapter/index.cjs config-get workflow.ui_phase --cwd tests/fixtures/minimal-gsd-project
CODEX_HOME=$(mktemp -d) bash dist/codex/install.sh
```
