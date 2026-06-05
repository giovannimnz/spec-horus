<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║   HORUS SPEC DRIVEN — v4.0                                     ║
║   67 commands → 3 unified roles + config                       ║
║   4 files on Hermes, up to 16 on other runtimes                ║
╚══════════════════════════════════════════════════════════════╝
```

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![en](https://img.shields.io/badge/lang-en-blue)](README-en.md)
[![pt](https://img.shields.io/badge/lang-pt-green)](README.md)

</div>

---

## Slash Commands

### ⚡ /hsd-dev — Developer (7 subcommands)

| Subcommand | Maps from (gsd-core) |
|---|---|
| `discover` | explore, spike, sketch, capture, ns-ideate, map-codebase, ns-context |
| `define` | discuss-phase, spec-phase, mvp-phase |
| `plan` | plan-phase, ultraplan-phase, ai-integration-phase |
| `build` | execute-phase, autonomous, quick, fast |
| `debug` | debug, forensics |
| `maintain` | docs-update, extract-learnings, ingest-docs, import, cleanup |
| `ui` | ui-phase, ui-review |

### 📋 /hsd-pm — Project Manager (5 subcommands)

| Subcommand | Maps from |
|---|---|
| `new` | new-project, new-milestone |
| `track` | progress, workstreams, thread, phase, workspace, graphify, stats |
| `ship` | ship, pr-branch, complete-milestone, milestone-summary, undo, update |
| `config` | config, settings, profile-user |
| `manage` | manager, surface, pause-work, resume-work, help, inbox |

### ✅ /hsd-qa — Quality (3 subcommands)

| Subcommand | Maps from |
|---|---|
| `validate` | validate-phase, verify-work, health, add-tests |
| `audit` | audit-fix, audit-milestone, audit-uat |
| `review` | code-review, eval-review, review, review-backlog, plan-review-convergence, secure-phase |

### ⚙️ /hsd-config — System

`/hsd-config language pt` — Portuguese  
`/hsd-config language en` — English

---

## Layout per Platform

The same 3 roles + config adapt to each runtime's format:

| Runtime | Slash Commands | Format | Routing |
|---|---|---|---|
| **Hermes** | `/hsd-dev` `/hsd-pm` `/hsd-qa` `/hsd-config` (4) | SKILL.md nested | `$ARGUMENTS[0]` in body |
| **Claude Code** | `/hsd-dev` `/hsd-pm` `/hsd-qa` `/hsd-config` (4) | SKILL.md flat | `$ARGUMENTS[0]` in body |
| **Codex CLI** | `hsd-dev-discover` ... `hsd-config` (16) | prompt.md | 1 file per subcommand |
| **Gemini CLI** | `/hsd-dev:discover` ... `/hsd-config:language` (16) | .toml | 1 file per subcommand |
| **GitHub Copilot** | `hsd-dev-discover` ... `hsd-config` (16) | copilot-instructions.md | 1 file per subcommand |

---

## Install

```bash
git clone --recurse-submodules https://github.com/giovannimnz/horus-spec-driven.git
cd horus-spec-driven
node bin/install.js install --runtime=hermes --global
```

---

**v4.0 — 3 roles, 4-16 commands per runtime, 5 platforms, 67 skills unified.**
