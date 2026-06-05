<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██╗  ██╗ ██████╗ ██████╗ ██╗   ██╗███████╗                ║
║   ██║  ██║██╔═══██╗██╔══██╗██║   ██║██╔════╝                ║
║   ███████║██║   ██║██████╔╝██║   ██║███████╗                ║
║   ██╔══██║██║   ██║██╔══██╗██║   ██║╚════██║                ║
║   ██║  ██║╚██████╔╝██║  ██║╚██████╔╝███████║                ║
║   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝                ║
║                                                              ║
║   ███████╗██████╗ ███████╗ ██████╗                           ║
║   ██╔════╝██╔══██╗██╔════╝██╔════╝                           ║
║   ███████╗██████╔╝█████╗  ██║                                ║
║   ╚════██║██╔═══╝ ██╔══╝  ██║                                ║
║   ███████║██║     ███████╗╚██████╗                           ║
║   ╚══════╝╚═╝     ╚══════╝ ╚═════╝                           ║
║                                                              ║
║   ██████╗ ██████╗ ██╗██╗   ██╗███████╗███╗   ██╗            ║
║   ██╔══██╗██╔══██╗██║██║   ██║██╔════╝████╗  ██║            ║
║   ██║  ██║██████╔╝██║██║   ██║█████╗  ██╔██╗ ██║            ║
║   ██║  ██║██╔══██╗██║╚██╗ ██╔╝██╔══╝  ██║╚██╗██║            ║
║   ██████╔╝██║  ██║██║ ╚████╔╝ ███████╗██║ ╚████║            ║
║   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Desenvolvimento Guiado por Especificações — Para Todo CLI

**67 comandos gsd-core → 4 skills unificadas no Hermes (com roteamento interno), 15+ comandos planos nos outros runtimes. 5 plataformas.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Hermes](https://img.shields.io/badge/Hermes-Agent-7c3aed)](https://github.com/NousResearch/hermes-agent)
[![Claude](https://img.shields.io/badge/Claude-Code-2563eb)](https://claude.ai)
[![Codex](https://img.shields.io/badge/OpenAI-Codex-059669)](https://github.com/openai/codex)
[![Gemini](https://img.shields.io/badge/Gemini-CLI-ea580c)](https://deepmind.google/technologies/gemini/)
[![Copilot](https://img.shields.io/badge/GitHub-Copilot-dc2626)](https://github.com/features/copilot)
[![pt](https://img.shields.io/badge/lang-pt-green)](README.md)
[![en](https://img.shields.io/badge/lang-en-blue)](README-en.md)

</div>

---

## Slash Commands

### ⚡ /hsd-dev — Developer

**7 subcomandos:** discover, define, plan, build, debug, maintain, ui

| Subcomando | Mapeia de (gsd-core) |
|---|---|
| `discover` | explore, spike, sketch, capture, ns-ideate, map-codebase, ns-context |
| `define` | discuss-phase, spec-phase, mvp-phase |
| `plan` | plan-phase, ultraplan-phase, ai-integration-phase |
| `build` | execute-phase, autonomous, quick, fast |
| `debug` | debug, forensics |
| `maintain` | docs-update, extract-learnings, ingest-docs, import, cleanup |
| `ui` | ui-phase, ui-review |

**Exemplos:**
```
/hsd-dev discover "auth system design"
/hsd-dev define discuss --phase 1
/hsd-dev build run --phase 2
/hsd-dev debug trace
/hsd-dev maintain docs
```

### 📋 /hsd-pm — Project Manager

**5 subcomandos:** new, track, ship, config, manage

| Subcomando | Mapeia de |
|---|---|
| `new` | new-project, new-milestone |
| `track` | progress, workstreams, thread, phase, workspace, graphify, stats |
| `ship` | ship, pr-branch, complete-milestone, milestone-summary, undo, update |
| `config` | config, settings, profile-user |
| `manage` | manager, surface, pause-work, resume-work, help, inbox |

**Exemplos:**
```
/hsd-pm new project "my-app"
/hsd-pm track graph build
/hsd-pm ship release
/hsd-pm config set model_profile gpt-4
```

### ✅ /hsd-qa — Quality

**3 subcomandos:** validate, audit, review

| Subcomando | Mapeia de |
|---|---|
| `validate` | validate-phase, verify-work, health, add-tests |
| `audit` | audit-fix, audit-milestone, audit-uat |
| `review` | code-review, eval-review, review, review-backlog, plan-review-convergence, secure-phase |

**Exemplos:**
```
/hsd-qa validate phase 1
/hsd-qa audit milestone M001
/hsd-qa review code --phase 2
```

### ⚙️ /hsd-config — Configuração

```
/hsd-config language pt      → Português
/hsd-config language en      → English
```

---

## Arquitetura

```
67 comandos gsd-core → 3 papéis + config → 5 plataformas

modules/
├── gsd-core/          → upstream GSD framework
├── caveman/           → compressão ultra (juliusbrussee)
└── impeccable/        → design language system

bin/
├── install.js         → submodule update + wordlist + install
├── rebrand.js         → 157 regras (gsd-X → hsd-{role})
├── build-unified-skills.cjs → gera 4 SKILL.md + i18n
└── lib/
    ├── horus-sdk-adapter/  → 31 verbos, graphifyy.py
    ├── content-converters/   → 5 runtimes
    └── frontmatter-converters/ → 5 runtimes
```

---

## 🌐 Idioma

| Idioma | Código | Comando |
|---|---|---|
| Português | `pt` | `horus-spec-driven language pt` |
| English | `en` | `horus-spec-driven language en` |

---

## Instalação

```bash
git clone --recurse-submodules https://github.com/giovannimnz/horus-spec-driven.git
cd horus-spec-driven
node bin/install.js install --runtime=hermes --global
```

---

## Layout por Plataforma

A mesma unificação (3 papéis + config) se adapta ao formato de cada runtime:

| Runtime | Slash Commands | Formato | Roteamento |
|---|---|---|---|
| **Hermes** | `/hsd-dev` `/hsd-pm` `/hsd-qa` `/hsd-config` (4) | SKILL.md nested | `$ARGUMENTS[0]` no body |
| **Claude Code** | `/hsd-dev` `/hsd-pm` `/hsd-qa` `/hsd-config` (4) | SKILL.md flat | `$ARGUMENTS[0]` no body |
| **Codex CLI** | `hsd-dev-discover` ... `hsd-config` (16) | prompt.md | 1 arquivo por subcomando |
| **Gemini CLI** | `/hsd-dev:discover` ... `/hsd-config:language` (16) | .toml | 1 arquivo por subcomando |
| **GitHub Copilot** | `hsd-dev-discover` ... `hsd-config` (16) | copilot-instructions.md | 1 arquivo por subcomando |

**Hermes e Claude** usam 4 arquivos com roteamento inteligente. **Codex, Gemini e Copilot** precisam de 1 arquivo por subcomando (16 no total) — pois não suportam `$ARGUMENTS[0]`.

---

## Documentação

| Doc | Descrição |
|---|---|
| [README-en.md](README-en.md) | English version |
| [COMPATIBILITY.md](docs/COMPATIBILITY.md) | Matriz compatível por CLI |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitetura completa |
| [UNIFIED-COMMANDS.yaml](docs/UNIFIED-COMMANDS.yaml) | Mapeamento 67→3 |
| [modules/README.md](modules/README.md) | Submódulos (gsd-core, caveman, impeccable) |

---

**Horus Spec Driven v4.0 — 3 papéis, 4~16 comandos conforme o runtime, 5 plataformas.**

</div>
