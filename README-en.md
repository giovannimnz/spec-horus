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

### Spec-Driven Development for Every CLI

**67 commands → 17 unified. 5 roles. 5 platforms. Zero friction.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Hermes](https://img.shields.io/badge/Hermes-Agent-7c3aed)](https://github.com/NousResearch/hermes-agent)
[![Claude](https://img.shields.io/badge/Claude-Code-2563eb)](https://claude.ai)
[![Codex](https://img.shields.io/badge/OpenAI-Codex-059669)](https://github.com/openai/codex)
[![Gemini](https://img.shields.io/badge/Google-Gemini-ea580c)](https://deepmind.google/technologies/gemini/)
[![Copilot](https://img.shields.io/badge/GitHub-Copilot-dc2626)](https://github.com/features/copilot)
[![en](https://img.shields.io/badge/lang-en-blue)](README-en.md)
[![pt-BR](https://img.shields.io/badge/lang-pt--BR-green)](README.md)

</div>

---

## What is Horus Spec Driven?

**HSD** wraps [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) — the GSD (Get Shit Done) framework — and adapts it for **every AI coding assistant**. Instead of 67 Claude-only slash commands, you get **17 role-based unified commands** that work natively on **Hermes Agent, Claude Code, OpenAI Codex, Google Gemini CLI, and GitHub Copilot**.

```
gsd-core (67 commands, Claude-only)
         │
         ▼
  ┌──────────────────────────────────┐
  │  Horus Spec Driven               │
  │  ┌────────────────────────────┐   │
  │  │ Rebrand engine (157 rules) │   │
  │  │ Content converters (5)     │   │
  │  │ Frontmatter converters (5) │   │
  │  │ Subagent neutralization    │   │
  │  │ horus-sdk-adapter (31 API) │   │
  │  └────────────────────────────┘   │
  └──────────────────────────────────┘
         │
         ▼
  17 unified commands × 5 platforms
```

### Why "Spec Driven"?

Every phase starts with a specification — `ROADMAP.md` → `REQUIREMENTS.md` → `CONTEXT.md` → `PLAN.md` → execution. The code is the last step, not the first. Specs drive everything.

---

## 🌐 Language Support

Horus Spec Driven offers **localized descriptions** for slash commands.

| Language | Code | Status |
|---|---|---|
| English | `en` | ✅ Complete |
| Português (Brasil) | `pt-BR` | ✅ Complete |

**Important:** Localization affects **only the descriptions** of commands shown to the user. All framework artifacts (`.planning/`, `ROADMAP.md`, `REQUIREMENTS.md`, `CONTEXT.md`, `PLAN.md`, logs, session notes) **remain in English** regardless of the selected language. This ensures consistency across projects and prevents bilingual confusion.

### Switching Languages

```bash
# View current language and available options
horus-spec-driven language

# Switch to Portuguese
horus-spec-driven language pt-BR

# Switch back to English
horus-spec-driven language en
```

When switching languages, skills are **automatically rebuilt and reinstalled** with the new descriptions.

---

## Slash Commands

### 🎯 PO — Product Owner
> *Define WHAT gets built*

| Command | Subcommands | Maps from (original gsd-core) |
|---|---|---|
| `/hsd-po-discover` | explore, spike, sketch, map, capture | `explore`, `spike`, `sketch`, `capture`, `ns-ideate`, `map-codebase` |
| `/hsd-po-new` | project, milestone | `new-project`, `new-milestone` |
| `/hsd-po-define` | discuss, spec, mvp | `discuss-phase`, `spec-phase`, `mvp-phase` |
| `/hsd-po-inbox` | — | `inbox` |

### 📋 PM — Project Manager
> *Manage HOW it gets built*

| Command | Subcommands | Maps from |
|---|---|---|
| `/hsd-pm-plan` | phase, ultra, ai | `plan-phase`, `ultraplan-phase`, `ai-integration-phase` |
| `/hsd-pm-exec` | run, auto, quick, fast | `execute-phase`, `autonomous`, `quick`, `fast` |
| `/hsd-pm-track` | progress, streams, graph, stats, phase, workspace | `progress`, `workstreams`, `graphify`, `stats`, `phase`, `workspace`, `thread`, `ns-*` |
| `/hsd-pm-config` | set, get, model, profile | `config`, `settings`, `profile-user` |
| `/hsd-pm-ship` | release, complete, summary, rollback, update | `ship`, `pr-branch`, `complete-milestone`, `milestone-summary`, `undo`, `update` |
| `/hsd-pm-manage` | dashboard, pause, resume, toggle, help | `manager`, `surface`, `pause-work`, `resume-work`, `help` |

### 🎨 FRONT — Frontend
> *Build the UI*

| Command | Subcommands | Maps from |
|---|---|---|
| `/hsd-front-ui` | spec, review | `ui-phase`, `ui-review` |

### ⚙️ BACK — Backend
> *Build the logic & infrastructure*

| Command | Subcommands | Maps from |
|---|---|---|
| `/hsd-back-debug` | trace, forensics | `debug`, `forensics` |
| `/hsd-back-maintain` | docs, learn, ingest, import, clean | `docs-update`, `extract-learnings`, `ingest-docs`, `import`, `cleanup` |
| `/hsd-back-context` | — | `ns-context` |

### ✅ QA — Quality
> *Verify everything*

| Command | Subcommands | Maps from |
|---|---|---|
| `/hsd-qa-validate` | phase, verify, health, tests | `validate-phase`, `verify-work`, `health`, `add-tests` |
| `/hsd-qa-audit` | fix, milestone, uat | `audit-fix`, `audit-milestone`, `audit-uat` |
| `/hsd-qa-review` | code, peer, backlog, security, convergence | `code-review`, `eval-review`, `review`, `review-backlog`, `plan-review-convergence`, `ns-review`, `secure-phase` |

### ⚙️ Config — System
> *Configure preferences and language*

| Command | Description |
|---|---|
| `/hsd-config` | Configure language, models, and HSD preferences |

---

## Platform Support

| Platform | Status | Install Path | Notes |
|---|---|---|---|
| **Hermes Agent** | ✅ Complete | `~/.hermes/skills/hsd/` | 18 skills (17 + adapter). Content converter + frontmatter + horus-sdk-adapter. Full graphify (Python + file). |
| **Claude Code** | ✅ Complete | `~/.claude/skills/` | Content + frontmatter converters. Subagent neutralization. |
| **OpenAI Codex** | ✅ Complete | `~/.codex/prompts/` | Content converter (template vars, slash→skill). |
| **Google Gemini** | ✅ Complete | `~/.gemini/commands/hsd/` | Content converter (TOML format). |
| **GitHub Copilot** | ⏸️ Disabled | `.github/prompts/` | Content converter. Disabled by default — enable in `horus-spec-driven.json`. |

### Coming Soon

| Platform | Status |
|---|---|
| **Amazon Q Developer** | 📋 Planned |
| **JetBrains AI** | 📋 Planned |
| **Cursor** | 📋 Planned |

---

## Quick Start

```bash
git clone https://github.com/giovannimnz/horus-spec-driven.git
cd horus-spec-driven

# Install for all detected runtimes
node bin/install.js install --all --global

# Or for a specific runtime
node bin/install.js install --runtime=hermes --global
node bin/install.js install --runtime=claude --global
```

### Verify

```bash
node bin/install.js detect
# → hermes claude codex gemini
```

### Daily Sync

```bash
# Manual
node bin/install.js sync --all --global

# Auto (PM2)
pm2 start ecosystem.daily-sync.cron.json
pm2 save
```

---

## Requirements

| Dependency | Required? | Notes |
|---|---|---|
| Node.js ≥ 22 | ✅ Required | Core engine |
| Python 3.8+ | ✅ Recommended | For code-aware graphify (auto-installs if missing) |
| Git | ✅ Required | For vendor pull |
| PM2 | ⏸️ Optional | For daily sync cron |

---

## Project Identity

- **Name:** Horus Spec Driven
- **Acronym:** HSD
- **Repo:** [giovannimnz/horus-spec-driven](https://github.com/giovannimnz/horus-spec-driven)
- **Upstream:** [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) (MIT)
- **License:** MIT
- **Version:** 3.0.0

<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   Specs drive. Roles guide. Code follows.                    ║
║                                                              ║
║   /hsd-po-discover → /hsd-po-define → /hsd-pm-plan           ║
║   → /hsd-pm-exec → /hsd-qa-validate → /hsd-pm-ship           ║
║                                                              ║
║   That's the Horus way.                                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

</div>
