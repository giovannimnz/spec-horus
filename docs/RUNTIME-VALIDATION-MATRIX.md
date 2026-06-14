# Runtime Validation Matrix — v5.2.0 / Phase 10

| Runtime | Artifact format | Install target | Smoke result | Caveats |
|---|---|---|---|---|
| Hermes | nested SKILL.md + adapter + agents | `~/.hermes/skills/hsd/`, `~/.hermes/agents/` | ✅ PASS | Install script works with `HERMES_HOME=/tmp/...`; adapter path copied correctly |
| Claude Code | nested SKILL.md dirs + agents | `~/.claude/skills/` | ✅ PASS (after fix) | Builder outputs nested dirs, not flat `*.md`; install.sh had to change from `cp *.md` to `cp -r skills/hsd/*` |
| Codex CLI | flat `.md` prompts + agents + horus-sdk-codex | `~/.codex/prompts/`, `~/.codex/agents/`, `~/.codex/skills/horus-sdk-codex/` | ✅ PASS (install smoke) | Install script validated with temp `CODEX_HOME`; SDK smoke validates config/roadmap/error path |
| Gemini CLI | flat `.toml` commands + `.toml` agents | `~/.gemini/commands/hsd/` | ✅ PASS (layout smoke) | Install script not executed yet; filenames and extension shape valid |
| GitHub Copilot | flat `.md` prompts + agents | `.github/prompts/` | ✅ PASS (layout smoke) | Install target is repo-local (`$PWD/.github/prompts`) not HOME-based |

## Counts

- Hermes: 4 skills + 3 agents + adapter
- Claude: 4 skills + 3 agents
- Codex: 15 prompts + 3 agents + horus-sdk-codex
- Gemini: 15 commands + 3 agents
- Copilot: 15 prompts + 3 agents

## Key finding

`dist/claude/install.sh` was broken before this phase because it assumed flat files at `dist/claude/skills/*.md`. The builder actually emits nested skill dirs under `dist/claude/skills/hsd/hsd-*`. Phase 10 fixed the installer and aligned the README wording.

## Phase 12 update — horus-sdk-codex

- Codex install smoke agora executa `dist/codex/install.sh` em `CODEX_HOME` temporário.
- `dist/codex/adapter/index.cjs` é gerado pelo builder a partir de `bin/lib/horus-sdk-codex/`.
- Smoke tests cobrem `config-get`, `roadmap analyze` e erro de verb desconhecido no SDK Codex.
