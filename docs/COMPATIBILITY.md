# HSD — Compatibility Matrix per Runtime

**67 upstream commands → 3 roles + config. Runtime adapts the layout.**

---

## Unified Roles (4)

| Role | Prefix | Subcommands | Maps from |
|---|---|---|---|
| **DEV** | `hsd-dev` | discover, define, plan, build, debug, maintain, ui | 27 commands |
| **PM** | `hsd-pm` | new, track, ship, config, manage | 27 commands |
| **QA** | `hsd-qa` | validate, audit, review | 13 commands |
| **CONFIG** | `hsd-config` | language | — |

---

## Actual Slash Commands per Platform

| Role | Subcommand | Hermes | Claude Code | Codex | Gemini CLI | Copilot |
|---|---|---|---|---|---|---|
| DEV | discover | `/hsd-dev` (via `$ARGUMENTS[0]`) | `/hsd-dev` (flat SKILL.md) | `hsd-dev.md` | `/hsd-dev:discover` (.toml) | `hsd-dev.md` |
| DEV | define | mesmo | mesmo | hsd-dev.md | `/hsd-dev:define` | hsd-dev.md |
| DEV | plan | mesmo | mesmo | hsd-dev.md | `/hsd-dev:plan` | hsd-dev.md |
| DEV | build | mesmo | mesmo | hsd-dev.md | `/hsd-dev:build` | hsd-dev.md |
| DEV | debug | mesmo | mesmo | hsd-dev.md | `/hsd-dev:debug` | hsd-dev.md |
| DEV | maintain | mesmo | mesmo | hsd-dev.md | `/hsd-dev:maintain` | hsd-dev.md |
| DEV | ui | mesmo | mesmo | hsd-dev.md | `/hsd-dev:ui` | hsd-dev.md |
| PM | new | `/hsd-pm` | `/hsd-pm` | hsd-pm.md | `/hsd-pm:new` | hsd-pm.md |
| PM | track | mesmo | mesmo | hsd-pm.md | `/hsd-pm:track` | hsd-pm.md |
| PM | ship | mesmo | mesmo | hsd-pm.md | `/hsd-pm:ship` | hsd-pm.md |
| PM | config | mesmo | mesmo | hsd-pm.md | `/hsd-pm:config` | hsd-pm.md |
| PM | manage | mesmo | mesmo | hsd-pm.md | `/hsd-pm:manage` | hsd-pm.md |
| QA | validate | `/hsd-qa` | `/hsd-qa` | hsd-qa.md | `/hsd-qa:validate` | hsd-qa.md |
| QA | audit | mesmo | mesmo | hsd-qa.md | `/hsd-qa:audit` | hsd-qa.md |
| QA | review | mesmo | mesmo | hsd-qa.md | `/hsd-qa:review` | hsd-qa.md |
| CONFIG | language | `/hsd-config` | `/hsd-config` | hsd-config.md | `/hsd-config:language` | hsd-config.md |

---

## Layout por Runtime

| Runtime | Files | Slash Commands | Formato | Roteamento |
|---|---|---|---|---|
| **Hermes** | 4 SKILL.md (nested) | 4 | YAML frontmatter | `$ARGUMENTS[0]` dentro do body |
| **Claude Code** | 4 SKILL.md (flat) | 4 | YAML frontmatter | `$ARGUMENTS[0]` dentro do body |
| **Codex CLI** | 15 prompt.md + horus-sdk-codex | 15 + SDK | Template vars | Um arquivo por subcomando + SDK operacional |
| **Gemini CLI** | 15 .toml (flat) | 15 | TOML | Um arquivo por subcomando |
| **GitHub Copilot** | 15 .md (flat) | 15 | copilot-instructions.md | Um arquivo por subcomando |

---

## Status de Implementação por Runtime

| Camada | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|
| Content converter | ✅ | ✅ | ✅ | ✅ | ✅ |
| Frontmatter converter | ✅ | ✅ | ✅ | ✅ | ✅ |
| "Explode" subcomandos | — | — | ⬜ | ⬜ | ⬜ |
| Install funcional | ✅ | ✅ | ✅ | ⬜ | ⬜ |
| horus-sdk-<runtime> | ✅ horus-sdk-hermes | ❌ | ✅ horus-sdk-codex | ❌ | ❌ |
| graphify (Python) | ✅ | ❌ | ❌ | ❌ | ❌ |

**"Explode" subcomandos** é a fase que converte 1 SKILL.md com N subcomandos em N arquivos planos (`.toml`, `prompt.md`, etc.). Implementado apenas para Hermes e Claude (que suportam `$ARGUMENTS[0]`). Codex, Gemini e Copilot precisam desse passo extra.

---

*Horus Spec Driven v4.0*
