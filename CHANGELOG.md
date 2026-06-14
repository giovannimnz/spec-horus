# Changelog

## Unreleased — 2026-06-13

### horus-sdk-codex

- Adicionado `bin/lib/horus-sdk-codex/` como SDK HSD específico para Codex.
- `bin/builder.js --runtime=codex` agora emite `dist/codex/adapter/`.
- `dist/codex/install.sh` instala prompts, agents e `~/.codex/skills/horus-sdk-codex/` usando `SCRIPT_DIR` self-contained.
- Smoke tests cobrem builder Codex, install com `CODEX_HOME` temporário e verbos críticos do SDK Codex.

## v5.0.0 — 2026-06-05

### dist/ por Runtime com Builder Único (BREAKING)

- Cada CLI recebe sua própria pasta em `dist/<runtime>/` com tudo self-contained:
  - `dist/hermes/` — 4 SKILL.md nested + agents/ + horus-sdk-hermes + install.sh (24 files)
  - `dist/claude/` — 4 SKILL.md flat + agents/ + install.sh (9 files)
  - `dist/codex/` — 15 prompts/ + agents/ + horus-sdk-codex + install.sh (35 files)
  - `dist/gemini/` — 15 commands .toml + agents/ + install.sh (20 files)
  - `dist/copilot/` — 15 prompts/ + agents/ + install.sh (20 files)
- **Total: 108 arquivos, 5 pacotes independentes** gerados por `node bin/builder.js --all`
- Builder único (`bin/builder.js`) aplica uma vez: rebrand → content converters → frontmatter converters → subagent adapter → i18n
- `dist/` é gerado, nunca editado manualmente — commitado no repo pra release
- Cada `dist/<runtime>/install.sh` é self-contained: `SCRIPT_DIR` resolve paths relativos, roda sem o repo inteiro
- Upstream filter no rebrand: remove comandos com nível > ultra (wenyan-*, extreme-*, insane-*, godmode-*)
- Decisões detalhadas em `21.06-Decisoes-v5` (D-16 → D-20) e no vault

## v4.1.0 — 2026-06-05

### Auto-Detect + Agents + Compression

- `/hsd-pm`: se `.planning/` não existir, faz `map-codebase` → `new-project` automaticamente
- `/hsd-config compression`: Lite, Full, Ultra (caveman mode) com descrições localizadas
- `/hsd-config agents`: cavecrew-investigator, builder, reviewer com toggle
- Agentes especializados por role: `hsd-pm-agent`, `hsd-dev-agent`, `hsd-qa-agent`
- Roteamento inteligente de agente baseado no comando/skill usado
- Filtro upstream automático: remove comandos com níveis > ultra (wenyan-*, extreme-*, etc.)
- Locale `pt.json` atualizado com todas as novas strings
- Exibição completa em português quando `locale=pt`
- Ordem lógica dos comandos na documentação: PM → DEV → QA → Config

## v4.0.0 — 2026-06-05

### Compactação Máxima: 67→3 (BREAKING)

- PO eliminado → atividades movidas para PM (new, track) e DEV (discover, define)
- Frontend + Backend eliminados → fundidos no DEV (ui, debug, maintain)
- 3 papéis + config: DEV (7 subcomandos), PM (5), QA (3)
- 4 arquivos (Hermes/Claude) vs 15 (Codex/Gemini/Copilot)
- rebrand.js: 67→3 mapping
- Gemini CLI: formato `role:subcommand` (/hsd-dev:discover, /hsd-pm:track)

## v3.0.0 — 2026-06-05

### Unified Slash Commands (BREAKING)
- **67 commands → 17 unified** with 5 role-based prefixes (PO, PM, FRONT, BACK, QA)
- `shd/shq/shp` prefix system replaced by `hsd-{role}-` + subcommands
- Each command uses `$ARGUMENTS[0]` as subcommand selector
- `build-unified-skills.cjs` generates 17 SKILL.md from vendor wordlist
- `install.js` auto-detects `unified-skills/` and uses them instead of flat commands

### Architecture Decisions
- D-01: Role-based unification (PO=what, PM=how, FRONT=UI, BACK=logic, QA=verify)
- D-02: Storage-agnostic graphify (Python → file → PostgreSQL, auto-detect)
- D-03: Prefix `hsd` (Horus Spec Driven) — consistent with project identity
- D-04: Subcommands via `$ARGUMENTS[0]` — 1 SKILL.md per command, not 67
- D-05: Layout `skills/hsd/` as root namespace (not inside openclaw-imports)

### Rebrand Engine
- Wordlist rebuilt: 157 rules covering 67 commands + 33 agents + 23 historical refs
- `gsd-X` → `hsd-{role}-Y` with role-aware routing
- Agent remap: `gsd-executor` → `hsd-pm-exec`, `gsd-planner` → `hsd-pm-plan`, etc.
- Historical refs: `CLAUDE.md`→`HERMES.md`, `get-shit-done`→`horus-spec-driven`

### Documentation
- README.md: full ASCII art header, tables, architecture diagram, platform matrix
- SETUP.md: quick start with per-platform layouts
- Vault: 5 docs (README + 2 decisões + session log + decisions)
- Fork-sync: sync.yaml + deploy.yaml + cron + manual

---

## v2.1.0 — 2026-06-05

### Rebrand
- `skills/gsd/` → `skills/hsd/`
- `gsd-sdk-adapter` → `horus-sdk-hermes`
- `gsd_sdk_adapter` → `horus_sdk_adapter`
- Fork-sync paths updated: `spec-horus` → `horus-spec-driven`

### graphifyy.py — Code-Aware Knowledge Graph
- Python stdlib scanner: 460 LOC, zero dependencies
- AST parser for Python, regex for JS/TS/SQL/Go/Rust
- Auto-install: apt/brew/dnf/pacman/apk/pip attempts
- 3-tier fallback: Python → file-based → PostgreSQL

### Agent Features
- agent-skills via `skill_view()` bridge
- websearch via `web_search()` instructions
- `<horus_sdk_adapter>` injection in 12 skills

---

## v2.0.0 — 2026-06-05

### Complete Rewrite
- Wrapper over open-gsd/gsd-core (no fork)
- 5 content converters: hermes, claude, codex, copilot, gemini
- 5 frontmatter converters: per-runtime format
- Subagent adapter: Agent() calls → neutral form
- Kind-driven layout: skills/agents/commands per runtime
- Rebrand engine: gsd → shd/shq/shp
- horus-sdk-hermes: 31 verbs, 13 modules

---

## v1.x — 2026-05 (Legacy)

- Fork of get-shit-done + caveman
- Prefix-based rebrand (gsd → shd)
- Claude Code-only
