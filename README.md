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

**67 comandos upstream → 3 papéis + config. 4 arquivos (Hermes/Claude), 15 (Codex/Gemini/Copilot).**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![version](https://img.shields.io/badge/version-4.1.0-7c3aed)](package.json)
[![Hermes](https://img.shields.io/badge/Hermes-Agent-7c3aed)](https://github.com/NousResearch/hermes-agent)
[![Claude](https://img.shields.io/badge/Claude-Code-2563eb)](https://claude.ai)
[![Codex](https://img.shields.io/badge/OpenAI-Codex-059669)](https://github.com/openai/codex)
[![Gemini](https://img.shields.io/badge/Gemini-CLI-ea580c)](https://deepmind.google/technologies/gemini/)
[![Copilot](https://img.shields.io/badge/GitHub-Copilot-dc2626)](https://github.com/features/copilot)

[![pt](https://img.shields.io/badge/lang-pt--BR-green)](README.md)
[![en](https://img.shields.io/badge/lang-en-blue)](README-en.md)

</div>

---

## O que é o Horus Spec Driven?

**HSD** é um wrapper multi-CLI sobre o [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) — o framework GSD (Get Shit Done) — que unifica **67 comandos em 3 papéis + config**, adaptando-se nativamente a **5 assistentes de código**: Hermes Agent, Claude Code, OpenAI Codex, Google Gemini CLI e GitHub Copilot.

```
open-gsd/gsd-core (67 comandos)
         │
         ▼
  ┌──────────────────────────────────┐
  │   Horus Spec Driven v4.1         │
  │                                  │
  │   📋 PM    ⚡ DEV    ✅ QA        │
  │   ┌──────────────────────────┐   │
  │   │ horus-sdk-hermes/codex │   │
  │   │ Rebrand engine (157)     │   │
  │   │ Content converters (5)   │   │
  │   │ Frontmatter converters   │   │
  │   │ i18n (pt, en)            │   │
  │   └──────────────────────────┘   │
  └──────────────────────────────────┘
         │
         ▼
  Hermes  Claude  Codex  Gemini  Copilot
  4 cmds  4 cmds  15 cmd  15 cmd  15 cmd
```

---

## Slash Commands

### 📋 `/hsd-pm` — Gerente de Projeto

> *Cria projetos, acompanha progresso, gerencia releases e configuração.*

| Subcomando | Mapeia de (gsd-core) | Descrição |
|---|---|---|
| `new` | new-project, new-milestone | Criar novo projeto ou milestone |
| `track` | progress, workstreams, thread, phase, workspace, graphify, stats | Acompanhar progresso e métricas |
| `ship` | ship, pr-branch, complete-milestone, milestone-summary, undo, update | Entregar releases e fazer deploy |
| `config` | config, settings, profile-user | Configurar modelos e preferências |
| `manage` | manager, surface, pause-work, resume-work, help, inbox | Dashboard e gestão geral |

**🚀 Auto-Detecção Inteligente:** se `/hsd-pm` for executado em um diretório sem `.planning/`, ele automaticamente:
1. Executa `map-codebase` para mapear o código existente
2. Cria a estrutura `.planning/` completa
3. Inicia o primeiro milestone e fase
4. Prossegue com o subcomando solicitado

**Exemplos:**
```bash
/hsd-pm new "meu-app"                    # Cria projeto novo
/hsd-pm track graph build                # Constrói grafo de conhecimento
/hsd-pm ship release                     # Prepara release
/hsd-pm config set model_profile gpt-4   # Configura modelo
```

---

### ⚡ `/hsd-dev` — Desenvolvedor

> *O ciclo completo: descobrir, definir, planejar, construir, depurar, manter, UI.*

| Subcomando | Mapeia de (gsd-core) | Descrição |
|---|---|---|
| `discover` | explore, spike, sketch, capture, ns-ideate, map-codebase, ns-context | Descoberta e mapeamento de código |
| `define` | discuss-phase, spec-phase, mvp-phase | Definir escopo e requisitos |
| `plan` | plan-phase, ultraplan-phase, ai-integration-phase | Criar planos detalhados |
| `build` | execute-phase, autonomous, quick, fast | Construir e executar |
| `debug` | debug, forensics | Debug sistemático e análise forense |
| `maintain` | docs-update, extract-learnings, ingest-docs, import, cleanup | Documentação e manutenção |
| `ui` | ui-phase, ui-review | Contratos de design e revisão visual |

**Exemplos:**
```bash
/hsd-dev discover "auth system"          # Explora padrões de autenticação
/hsd-dev define discuss --phase 2        # Discute escopo da fase 2
/hsd-dev plan phase 3                    # Planeja fase 3
/hsd-dev build run --phase 2             # Executa planos da fase 2
/hsd-dev debug trace                     # Debug com tracing
```

---

### ✅ `/hsd-qa` — Qualidade

> *Validação, auditoria e revisão em cada etapa do ciclo.*

| Subcomando | Mapeia de (gsd-core) | Descrição |
|---|---|---|
| `validate` | validate-phase, verify-work, health, add-tests | Validar fases e health checks |
| `audit` | audit-fix, audit-milestone, audit-uat | Auditar milestones e correções |
| `review` | code-review, eval-review, review, review-backlog, plan-review-convergence, secure-phase | Code review e revisão de segurança |

**Exemplos:**
```bash
/hsd-qa validate phase 3                 # Valida fase 3
/hsd-qa audit milestone M002             # Audita milestone M002
/hsd-qa review code --phase 2            # Revisa código da fase 2
```

---

### ⚙️ `/hsd-config` — Configuração

> *Idioma, compressão de fala e subagentes.*

| Configuração | Opções | Descrição |
|---|---|---|
| `language` | `pt`, `en` | Alterna idioma das descrições |
| `compression` | `lite`, `full`, `ultra` | Estilo de compressão da fala (caveman) |
| `agents` | `investigator`, `builder`, `reviewer`, `off` | Subagentes cavecrew |

**Exemplos:**
```bash
/hsd-config language pt                  # Português
/hsd-config compression ultra            # Modo ultra-comprimido
/hsd-config agents investigator          # Ativa cavecrew-investigator
```

---

## Agentes Especializados

Cada papel tem um agente dedicado com ferramentas específicas:

| Agente | Papel | Ferramentas |
|---|---|---|
| `hsd-pm-agent` | PM | read_file, write_file, terminal, search_files, delegate_task |
| `hsd-dev-agent` | DEV | read_file, write_file, terminal, search_files, delegate_task |
| `hsd-qa-agent` | QA | read_file, write_file, terminal, search_files, delegate_task |

Ativados automaticamente ao usar o slash command correspondente. Roteamento inteligente baseado no `$ARGUMENTS[0]`.

---

## Layout por Plataforma

| Runtime | Comandos | Formato | Roteamento |
|---|---|---|---|
| **Hermes** | `/hsd-pm` `/hsd-dev` `/hsd-qa` `/hsd-config` (4) | SKILL.md nested | `$ARGUMENTS[0]` |
| **Claude Code** | `/hsd-pm` `/hsd-dev` `/hsd-qa` `/hsd-config` (4) | SKILL.md flat | `$ARGUMENTS[0]` |
| **Codex CLI** | `hsd-pm-new` ... `hsd-qa-review` (15) + SDK | prompt.md + horus-sdk-codex | 1 arquivo/subcomando |
| **Gemini CLI** | `/hsd-pm:new` ... `/hsd-qa:review` (15) | .toml | 1 arquivo/subcomando |
| **GitHub Copilot** | `hsd-pm-new` ... `hsd-qa-review` (15) | .md | 1 arquivo/subcomando |

---

## Estrutura `dist/`

Cada CLI tem sua própria pasta em `dist/` com **tudo personalizado**:

```
dist/
├── hermes/      skills + agents + horus-sdk-hermes + install.sh
├── claude/      skills + agents + install.sh
├── codex/       prompts (15) + agents + horus-sdk-codex + install.sh
├── gemini/      commands (15 .toml) + agents + install.sh
└── copilot/     prompts (15) + agents + install.sh
```

**Gerado por:** `node bin/builder.js --all`  
**Total:** 108+ arquivos, 5 pacotes independentes

---

## Instalação

```bash
git clone --recurse-submodules https://github.com/giovannimnz/horus-spec-driven.git
cd horus-spec-driven

# Build unificado (93 files, 5 runtimes)
npm run build                       # ou: node bin/builder.js --all

# Build de um runtime específico
npm run build:hermes                # ou: node bin/builder.js --runtime=hermes
npm run build:claude                # etc.

# Install em cada CLI
bash dist/hermes/install.sh        # Hermes Agent
bash dist/claude/install.sh        # Claude Code
bash dist/codex/install.sh         # Codex CLI
bash dist/gemini/install.sh        # Gemini CLI
bash dist/copilot/install.sh       # GitHub Copilot

# Alternativa: install via wrapper Node (auto-detect runtime)
npm run install                     # ou: node bin/install.js install --all --global

# Sync diário
pm2 start ecosystem.daily-sync.cron.json
```

---

## Documentação

| Documento | Conteúdo |
|---|---|
| [README-en.md](README-en.md) | English version |
| [COMPATIBILITY.md](docs/COMPATIBILITY.md) | Matriz de compatibilidade por CLI |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitetura completa do sistema |
| [UNIFIED-COMMANDS.yaml](docs/UNIFIED-COMMANDS.yaml) | Mapeamento 67→3 |
| [CONVERTERS.md](docs/CONVERTERS.md) | Conversores de conteúdo e frontmatter |
| [REBRAND.md](docs/REBRAND.md) | Engine de rebrand |
| [modules/README.md](modules/README.md) | Submódulos (gsd-core, caveman, impeccable) |

---

<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   📋 PM cria. ⚡ DEV constrói. ✅ QA verifica.              ║
║                                                              ║
║   /hsd-pm new → /hsd-dev plan → /hsd-dev build               ║
║   → /hsd-qa validate → /hsd-pm ship                          ║
║                                                              ║
║   4 comandos. 5 plataformas. Ciclo completo.                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Horus Spec Driven v4.1 — [github.com/giovannimnz/horus-spec-driven](https://github.com/giovannimnz/horus-spec-driven)**

</div>
