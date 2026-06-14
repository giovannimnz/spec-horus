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

**67 upstream commands → 3 roles + config. 4 files (Hermes/Claude), 15 (Codex/Gemini/Copilot).**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![version](https://img.shields.io/badge/version-4.1.0-7c3aed)](package.json)
[![en](https://img.shields.io/badge/lang-en-blue)](README-en.md)
[![pt](https://img.shields.io/badge/lang-pt--BR-green)](README.md)

</div>

---

## Slash Commands

### 📋 `/hsd-pm` — Project Manager (5 subcommands)

> *Creates projects, tracks progress, manages releases.*

| Subcommand | Maps from (gsd-core) |
|---|---|
| `new` | new-project, new-milestone |
| `track` | progress, workstreams, thread, phase, workspace, graphify, stats |
| `ship` | ship, pr-branch, complete-milestone, milestone-summary, undo, update |
| `config` | config, settings, profile-user |
| `manage` | manager, surface, pause-work, resume-work, help, inbox |

**🚀 Smart Auto-Detect:** if no `.planning/` exists, `/hsd-pm` automatically runs `map-codebase` → `new-project` before proceeding.

### ⚡ `/hsd-dev` — Developer (7 subcommands)

> *Discover, define, plan, build, debug, maintain, ui — the full dev cycle.*

| Subcommand | Maps from |
|---|---|
| `discover` | explore, spike, sketch, capture, ns-ideate, map-codebase, ns-context |
| `define` | discuss-phase, spec-phase, mvp-phase |
| `plan` | plan-phase, ultraplan-phase, ai-integration-phase |
| `build` | execute-phase, autonomous, quick, fast |
| `debug` | debug, forensics |
| `maintain` | docs-update, extract-learnings, ingest-docs, import, cleanup |
| `ui` | ui-phase, ui-review |

### ✅ `/hsd-qa` — Quality (3 subcommands)

> *Validate, audit, review — quality at every stage.*

| Subcommand | Maps from |
|---|---|
| `validate` | validate-phase, verify-work, health, add-tests |
| `audit` | audit-fix, audit-milestone, audit-uat |
| `review` | code-review, eval-review, review, review-backlog, plan-review-convergence, secure-phase |

### ⚙️ `/hsd-config` — Configuration

| Setting | Values | Description |
|---|---|---|
| `language` | `pt`, `en` | Switch display language |
| `compression` | `lite`, `full`, `ultra` | Speech compression (caveman mode) |
| `agents` | `investigator`, `builder`, `reviewer`, `off` | Cavecrew subagents |

---

## Specialized Agents

| Agent | Role | Tools |
|---|---|---|
| `hsd-pm-agent` | PM | read, write, terminal, search, delegate |
| `hsd-dev-agent` | DEV | read, write, terminal, search, delegate |
| `hsd-qa-agent` | QA | read, write, terminal, search, delegate |

---

## Platform Layout

| Runtime | Commands | Format | Routing |
|---|---|---|---|
| **Hermes** | `/hsd-pm` `/hsd-dev` `/hsd-qa` `/hsd-config` (4) | SKILL.md nested | `$ARGUMENTS[0]` |
| **Claude Code** | `/hsd-pm` `/hsd-dev` `/hsd-qa` `/hsd-config` (4) | SKILL.md flat | `$ARGUMENTS[0]` |
| **Codex CLI** | `hsd-pm-new` ... `hsd-qa-review` (15) + SDK | prompt.md + horus-sdk-codex | 1 file/subcommand |
| **Gemini CLI** | `/hsd-pm:new` ... `/hsd-qa:review` (15) | .toml | 1 file/subcommand |
| **GitHub Copilot** | `hsd-pm-new` ... `hsd-qa-review` (15) | .md | 1 file/subcommand |

---

## Install

```bash
git clone --recurse-submodules https://github.com/giovannimnz/horus-spec-driven.git
cd horus-spec-driven
node bin/install.js install --runtime=hermes --global
```

---

## Documentation

| Doc | Content |
|---|---|
| [README.md](README.md) | Portuguese version |
| [COMPATIBILITY.md](docs/COMPATIBILITY.md) | Cross-CLI compatibility matrix |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Full system architecture |
| [modules/README.md](modules/README.md) | Submodules (gsd-core, caveman, impeccable) |

---

```
╔══════════════════════════════════════════════════════════════╗
║   📋 PM creates. ⚡ DEV builds. ✅ QA verifies.            ║
║   /hsd-pm new → /hsd-dev plan → /hsd-dev build              ║
║   → /hsd-qa validate → /hsd-pm ship                         ║
║   4 commands. 5 platforms. Full cycle.                      ║
╚══════════════════════════════════════════════════════════════╝
```

**Horus Spec Driven v4.1**
