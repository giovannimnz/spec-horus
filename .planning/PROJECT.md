# Project: horus-spec-driven

**Type:** Multi-CLI wrapper (brownfield, v4.1.0 + v5.0.0)
**Repo:** https://github.com/giovannimnz/horus-spec-driven
**Stack:** Node.js 18+ (CJS), no npm deps at runtime
**Upstream:** open-gsd/gsd-core (vendored via `modules/`)

## What This Is

Wrapper around `@opengsd/gsd-core` (67 gsd-* commands) that unifies everything
into 3 roles + config (4 SKILL.md for Hermes/Claude, 16 flat commands for
Codex/Gemini/Copilot). Dist/ is generated per-runtime by `bin/builder.js`.

## Core Value

- **One source, five runtimes** — write spec-driven workflow once, ship to
  Hermes Agent, Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot
- **Compact namespace** — 67 commands unified into 4 slash commands (or 16
  flat for CLIs that don't support `$ARGUMENTS[0]` routing)
- **Zero runtime deps** — pure Node.js + Python stdlib; no npm install needed
  for the wrapper itself (only for upstream `gsd-core` if vendored)

## Requirements

- Node.js ≥ 18 (engine: `>=18.0.0`)
- Python 3.8+ (for `graphifyy.py` code-aware scanner)
- Git (vendoring gsd-core as submodule)
- Optional: PM2 (auto-sync cron)

## Current state (as of 2026-06-05)

- v4.1.0 package + v5.0.0 CHANGELOG (commit 1593cc5, pushed)
- `dist/{hermes,claude,codex,gemini,copilot}/` generated (93 files)
- `bin/lib/horus-sdk-hermes/` (31 verbs + graphifyy.py) — Hermes SDK
- Unified skills in `unified-skills/` (4 files: hsd-pm, hsd-dev, hsd-qa, hsd-config)
- Vault docs: 21.01–21.06 in `~/GitHub/obsidian-vault/ideaverse/20-PROJETOS/21-PROJETOS-ATIVOS/horus-spec-driven/`

## Constraints

- **Runtime:** Node.js ≥ 18
- **Deps:** zero runtime deps (Python stdlib only for graphifyy.py)
- **No npm registry required:** gsd-core, caveman, impeccable are git submodules
- **Push policy:** "livre APÓS audit" — never auto-push
- **Git author:** giovannimnz <munizgiovanni@hotmail.com>

## Active milestone

→ v5.1.0 — Documentation & Vault Alignment (✅ COMPLETE 2026-06-06, 6/6 phases)
→ Next: v5.2.0 (TBD) or feature work

## Out of Scope

- Implementing `modules/skills/<name>/` hook v5.1 in this legacy repo
  (lives in `giovannimnz/omni-spec-driven`)
- Rebrand to `omni-spec-driven` (D-1.1: separate repos)
