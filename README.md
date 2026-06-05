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

### Desenvolvimento Guiado por Especificações para Todo CLI

**67 comandos → 17 unificados. 5 papéis. 5 plataformas. Zero atrito.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Hermes](https://img.shields.io/badge/Hermes-Agent-7c3aed)](https://github.com/NousResearch/hermes-agent)
[![Claude](https://img.shields.io/badge/Claude-Code-2563eb)](https://claude.ai)
[![Codex](https://img.shields.io/badge/OpenAI-Codex-059669)](https://github.com/openai/codex)
[![Gemini](https://img.shields.io/badge/Google-Gemini-ea580c)](https://deepmind.google/technologies/gemini/)
[![Copilot](https://img.shields.io/badge/GitHub-Copilot-dc2626)](https://github.com/features/copilot)
[![pt-BR](https://img.shields.io/badge/lang-pt--BR-green)](README.md)
[![en](https://img.shields.io/badge/lang-en-blue)](README-en.md)

</div>

---

## O que é o Horus Spec Driven?

**HSD** é um wrapper multi-CLI sobre o [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) — o framework GSD (Get Shit Done) — adaptado para funcionar nativamente em **todo assistente de código com IA**.

Em vez de 67 comandos exclusivos do Claude Code, você tem **17 comandos unificados por papel** que funcionam nativamente no **Hermes Agent, Claude Code, OpenAI Codex, Google Gemini CLI e GitHub Copilot**.

```
gsd-core (67 comandos, só Claude Code)
         │
         ▼
  ┌──────────────────────────────────┐
  │  Horus Spec Driven               │
  │  ┌────────────────────────────┐   │
  │  │ Rebrand engine (157 regras)│   │
  │  │ Conversores de conteúdo(5) │   │
  │  │ Conversores de frontmatter │   │
  │  │ Neutralização de subagents │   │
  │  │ horus-sdk-adapter (31 API) │   │
  │  └────────────────────────────┘   │
  └──────────────────────────────────┘
         │
         ▼
  17 comandos unificados × 5 plataformas
```

### Por que "Spec Driven"?

Toda fase começa com uma especificação — `ROADMAP.md` → `REQUIREMENTS.md` → `CONTEXT.md` → `PLAN.md` → execução. O código é o último passo, não o primeiro. Especificações guiam tudo.

---

## 🌐 Suporte a Idioma

O Horus Spec Driven oferece **descrições localizadas** dos slash commands.

| Idioma | Código | Status |
|---|---|---|
| English | `en` | ✅ Completo |
| Português (Brasil) | `pt-BR` | ✅ Completo |

**Importante:** A localização afeta **apenas as descrições** dos comandos que aparecem para o usuário. Os artefatos do framework (`.planning/`, `ROADMAP.md`, `REQUIREMENTS.md`, `CONTEXT.md`, `PLAN.md`, logs, session notes) **permanecem em inglês** independentemente do idioma selecionado. Isso garante consistência entre projetos e evita confusão com documentos bilíngues.

### Alternando o Idioma

```bash
# Ver idioma atual e disponíveis
horus-spec-driven language

# Alternar para português
horus-spec-driven language pt-BR

# Voltar para inglês
horus-spec-driven language en
```

Ao alternar o idioma, os skills são **automaticamente reconstruídos e reinstalados** com as novas descrições.

---

## Slash Commands

### 🎯 PO — Product Owner
> *Define O QUE será construído*

| Comando | Subcomandos | Mapeia de (gsd-core original) |
|---|---|---|
| `/hsd-po-discover` | explore, spike, sketch, map, capture | `explore`, `spike`, `sketch`, `capture`, `ns-ideate`, `map-codebase` |
| `/hsd-po-new` | project, milestone | `new-project`, `new-milestone` |
| `/hsd-po-define` | discuss, spec, mvp | `discuss-phase`, `spec-phase`, `mvp-phase` |
| `/hsd-po-inbox` | — | `inbox` |

### 📋 PM — Project Manager
> *Gerencia COMO será construído*

| Comando | Subcomandos | Mapeia de |
|---|---|---|
| `/hsd-pm-plan` | phase, ultra, ai | `plan-phase`, `ultraplan-phase`, `ai-integration-phase` |
| `/hsd-pm-exec` | run, auto, quick, fast | `execute-phase`, `autonomous`, `quick`, `fast` |
| `/hsd-pm-track` | progress, streams, graph, stats, phase, workspace | `progress`, `workstreams`, `graphify`, `stats`, `phase`, `workspace`, `thread`, `ns-*` |
| `/hsd-pm-config` | set, get, model, profile | `config`, `settings`, `profile-user` |
| `/hsd-pm-ship` | release, complete, summary, rollback, update | `ship`, `pr-branch`, `complete-milestone`, `milestone-summary`, `undo`, `update` |
| `/hsd-pm-manage` | dashboard, pause, resume, toggle, help | `manager`, `surface`, `pause-work`, `resume-work`, `help` |

### 🎨 FRONT — Frontend
> *Constrói a interface*

| Comando | Subcomandos | Mapeia de |
|---|---|---|
| `/hsd-front-ui` | spec, review | `ui-phase`, `ui-review` |

### ⚙️ BACK — Backend
> *Constrói a lógica e infraestrutura*

| Comando | Subcomandos | Mapeia de |
|---|---|---|
| `/hsd-back-debug` | trace, forensics | `debug`, `forensics` |
| `/hsd-back-maintain` | docs, learn, ingest, import, clean | `docs-update`, `extract-learnings`, `ingest-docs`, `import`, `cleanup` |
| `/hsd-back-context` | — | `ns-context` |

### ✅ QA — Quality
> *Verifica tudo*

| Comando | Subcomandos | Mapeia de |
|---|---|---|
| `/hsd-qa-validate` | phase, verify, health, tests | `validate-phase`, `verify-work`, `health`, `add-tests` |
| `/hsd-qa-audit` | fix, milestone, uat | `audit-fix`, `audit-milestone`, `audit-uat` |
| `/hsd-qa-review` | code, peer, backlog, security, convergence | `code-review`, `eval-review`, `review`, `review-backlog`, `plan-review-convergence`, `ns-review`, `secure-phase` |

### ⚙️ Config — Sistema
> *Configura preferências e idioma*

| Comando | Descrição |
|---|---|
| `/hsd-config` | Configurar idioma, modelos e preferências do HSD |

---

## Plataformas Suportadas

| Plataforma | Status | Caminho de Instalação | Observações |
|---|---|---|---|
| **Hermes Agent** | ✅ Completo | `~/.hermes/skills/hsd/` | 18 skills (17 + adapter). Conversor de conteúdo + frontmatter + horus-sdk-adapter. Graphify completo (Python + arquivo). |
| **Claude Code** | ✅ Completo | `~/.claude/skills/` | Conversores de conteúdo e frontmatter. Neutralização de subagents. |
| **OpenAI Codex** | ✅ Completo | `~/.codex/prompts/` | Conversor de conteúdo (template vars, slash→skill). |
| **Google Gemini** | ✅ Completo | `~/.gemini/commands/hsd/` | Conversor de conteúdo (formato TOML). |
| **GitHub Copilot** | ⏸️ Desabilitado | `.github/prompts/` | Conversor de conteúdo. Desabilitado por padrão — ative em `horus-spec-driven.json`. |

### Em Planejamento

| Plataforma | Previsão |
|---|---|
| **Amazon Q Developer** | 📋 Planejado |
| **JetBrains AI** | 📋 Planejado |
| **Cursor** | 📋 Planejado |

---

## Arquitetura

```
horus-spec-driven/
├── bin/
│   ├── install.js                  Pipeline: pull → wordlist → unificado → instalar
│   ├── rebrand.js                  Construtor de wordlist (157 regras, 67→17)
│   ├── build-unified-skills.cjs    Gera 18 SKILL.md com suporte a i18n
│   ├── sync.js                     Atalho de sincronização
│   └── lib/
│       ├── horus-sdk-adapter/      Reimplementação do gsd-tools.cjs (31 verbos)
│       │   ├── index.cjs           Dispatch CLI
│       │   ├── state.cjs           Gerenciamento de estado (16 subcomandos)
│       │   ├── config.cjs          Config get/set (6 subcomandos)
│       │   ├── graphify.cjs        Grafo de conhecimento (fallback JS)
│       │   ├── graphifyy.py        Scanner de código (Python, 460 linhas)
│       │   └── ...                 13 módulos no total
│       ├── content-converters/     5 conversores específicos por runtime
│       ├── frontmatter-converters/ 5 conversores de frontmatter
│       ├── subagent-adapter/       Neutralização de chamadas Agent()
│       ├── layout.js               Layout de instalação kind-driven
│       └── runtime-paths.js        Resolução de home por runtime
├── unified-skills/                 18 SKILL.md gerados com i18n
├── locales/                        Arquivos de tradução (en, pt-BR)
├── runtimes/                       Especificações de layout por plataforma
├── docs/                           Documentação de arquitetura, rebrand, mapeamento
├── vendor/                         gsd-core (gitignored, baixado na instalação)
└── ecosystem.daily-sync.cron.json  Cron PM2 diário às 08:00 UTC
```

---

## horus-sdk-adapter

O `gsd-tools.cjs` (1722 linhas, 60+ subcomandos) é exclusivo do Claude Code — usa `Agent()`, `Skill()` e `gsd-sdk` que não existem no Hermes.

O **horus-sdk-adapter** é uma reimplementação completa usando ferramentas nativas do Hermes: `delegate_task`, `skill_view`, `read_file`, `write_file`, `terminal`, `memory`.

### Verbos Implementados (31)

```
state        init        state-snapshot    summary-extract
config-get   config-set  commit            frontmatter.get
frontmatter.set  roadmap  phase            validate
workstream   scaffold    milestone         requirements
progress     resolve-model  generate-slug  current-timestamp
list-todos   gap-analysis  learnings       prompt-budget
update-context  verify-path-exists  skill-manifest
graphify     agent-skills  websearch
```

### Onde Roda

| Funcionalidade | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|
| horus-sdk-adapter | ✅ Nativo | — | — | — | — |
| graphify (Python) | ✅ Nativo | — | — | — | — |
| graphify (Arquivo) | ✅ Fallback | — | — | — | — |
| agent-skills | ✅ skill_view() | Agent() | delegate | — | — |
| websearch | ✅ web_search() | Brave API | — | — | — |
| Conversor de conteúdo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Conversor de frontmatter | ✅ | ✅ | ✅ | ✅ | ✅ |
| Subagent adapter | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Instalação Rápida

```bash
git clone https://github.com/giovannimnz/horus-spec-driven.git
cd horus-spec-driven

# Instalar para todos os runtimes detectados
node bin/install.js install --all --global

# Ou para um runtime específico
node bin/install.js install --runtime=hermes --global
node bin/install.js install --runtime=claude --global
```

### Verificar

```bash
node bin/install.js detect
# → hermes claude codex gemini
```

### Sincronização Diária

```bash
# Manual
node bin/install.js sync --all --global

# Automática (PM2)
pm2 start ecosystem.daily-sync.cron.json
pm2 save
```

### Graphify (Grafo de Conhecimento)

```bash
# Construir grafo (análise de código Python + artefatos .planning/)
/hsd-pm-track graph build

# Consultar
/hsd-pm-track graph query "módulo de autenticação"

# Status
/hsd-pm-track graph status

# Diff
/hsd-pm-track graph diff
```

---

## Requisitos

| Dependência | Obrigatório? | Observações |
|---|---|---|
| Node.js ≥ 22 | ✅ Obrigatório | Motor principal |
| Python 3.8+ | ✅ Recomendado | Para graphify com análise de código (auto-instala se ausente) |
| Git | ✅ Obrigatório | Para baixar o vendor |
| PM2 | ⏸️ Opcional | Para cron de sincronização diária |

---

## Documentação

| Documento | Descrição |
|---|---|
| [README-en.md](README-en.md) | English version |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitetura completa do sistema |
| [REBRAND.md](docs/REBRAND.md) | Engine de rebrand e wordlist |
| [RUNTIMES.md](docs/RUNTIMES.md) | Especificações de layout por plataforma |
| [CONVERTERS.md](docs/CONVERTERS.md) | Conversores de conteúdo e frontmatter |
| [HORUS-SDK-MAPPING.md](docs/HORUS-SDK-MAPPING.md) | Mapeamento gsd-tools → horus-sdk |
| [UNIFIED-COMMANDS.yaml](docs/UNIFIED-COMMANDS.yaml) | Especificação do mapeamento 67→17 |

---

## Regras de Rebrand

Cada referência a `gsd-*` nos skills é reescrita durante a instalação. A wordlist tem 157 regras:

| Original | Reescrito | Contexto |
|---|---|---|
| `gsd-new-project` | `hsd-po-new` | Comando PO |
| `gsd-execute-phase` | `hsd-pm-exec` | Comando PM |
| `gsd-validate-phase` | `hsd-qa-validate` | Comando QA |
| `CLAUDE.md` | `HERMES.md` | Marca |
| `~/.claude/` | `~/.hermes/` | Caminhos |
| `gsd-core` | `hsd-core` | Nome do projeto |
| `get-shit-done` | `horus-spec-driven` | Marca do projeto |
| `Agent(subagent_type="gsd-X")` | Forma neutra `<subagent>` | Adapter de subagent |
| `skills/gsd/` | `skills/hsd/` | Namespace |

---

## Identidade do Projeto

- **Nome:** Horus Spec Driven
- **Sigla:** HSD
- **Repo:** [giovannimnz/horus-spec-driven](https://github.com/giovannimnz/horus-spec-driven)
- **Upstream:** [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) (MIT)
- **Licença:** MIT
- **Versão:** 3.0.0

<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   Especificações guiam. Papéis orientam. Código segue.      ║
║                                                              ║
║   /hsd-po-discover → /hsd-po-define → /hsd-pm-plan           ║
║   → /hsd-pm-exec → /hsd-qa-validate → /hsd-pm-ship           ║
║                                                              ║
║   Esse é o caminho de Hórus.                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

</div>
