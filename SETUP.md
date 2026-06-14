# Horus Spec Driven — Quick Setup

## 1. Clone & Install

```bash
git clone https://github.com/giovannimnz/horus-spec-driven.git ~/GitHub/horus-spec-driven
cd ~/GitHub/horus-spec-driven

# Build unified skills
node bin/rebrand.js modules/unified-wordlist.json
node bin/build-unified-skills.cjs

# Install all runtimes
node bin/install.js install --all --global
```

## 2. Verify

```bash
node bin/install.js detect
# → hermes claude codex gemini copilot

ls ~/.hermes/skills/hsd/
# → hsd-pm      (5 subcomandos: new, track, ship, config, manage)
# → hsd-dev     (7 subcomandos: discover, define, plan, build, debug, maintain, ui)
# → hsd-qa      (3 subcomandos: validate, audit, review)
# → hsd-config  (language/compression/agents)
# → horus-sdk-hermes/
```

## 3. Daily Sync

```bash
# Manual
node bin/install.js sync --all --global

# Auto (PM2)
pm2 start ecosystem.daily-sync.cron.json
pm2 save
```

## 4. Test

```bash
# Test Hermes SDK
node ~/.hermes/skills/hsd/horus-sdk-hermes/index.cjs state load --cwd /path/to/project

# Test Codex SDK
node ~/.codex/skills/horus-sdk-codex/index.cjs roadmap analyze --cwd /path/to/project

# Test graphify (code-aware knowledge graph)
node ~/.hermes/skills/hsd/horus-sdk-hermes/index.cjs graphify build --cwd /path/to/project
node ~/.hermes/skills/hsd/horus-sdk-hermes/index.cjs graphify query "function" --cwd /path/to/project
```

## Requirements

| Dependency | Why |
|---|---|
| **Node.js ≥ 22** | Core engine — install.js, rebrand.js, horus-sdk-hermes |
| **Python 3.8+** | graphifyy.py — code-aware scanning (auto-installs if missing) |
| **Git** | Vendor pull from open-gsd/gsd-core |
| **PM2** | Auto-sync cron (optional) |

## Layout (v4.1+)

### Hermes

```
~/.hermes/skills/hsd/
├── hsd-pm/SKILL.md          (5 subcomandos: new, track, ship, config, manage)
├── hsd-dev/SKILL.md         (7 subcomandos: discover, define, plan, build, debug, maintain, ui)
├── hsd-qa/SKILL.md          (3 subcomandos: validate, audit, review)
├── hsd-config/SKILL.md      (language/compression/agents)
└── horus-sdk-hermes/
    ├── index.cjs
    ├── state.cjs
    ├── graphify.cjs
    ├── graphifyy.py
    └── ...
```

### Claude Code

```
~/.claude/skills/
├── hsd-pm/SKILL.md
├── hsd-dev/SKILL.md
├── hsd-qa/SKILL.md
└── hsd-config/SKILL.md
```

### Codex

```
~/.codex/
├── prompts/
│   ├── hsd-pm-new.md
│   ├── hsd-dev-discover.md
│   ├── hsd-qa-validate.md
│   └── ...  (15 total: 5 PM + 7 DEV + 3 QA)
├── agents/
│   └── hsd-dev-agent.md
└── skills/horus-sdk-codex/
    ├── index.cjs
    └── ...
```

### Gemini

```
~/.gemini/commands/hsd/
├── hsd-pm:new.toml
├── hsd-dev:discover.toml
├── hsd-qa:validate.toml
└── ...  (15 total)
```

### Copilot

```
.github/prompts/
├── hsd-pm-new.md
├── hsd-dev-discover.md
├── hsd-qa-validate.md
└── ...  (15 total)
```

## Local Skills (v5.1+, omni-spec-driven only)

**Esta seção refere-se ao projeto sucessor [`omni-spec-driven`](https://github.com/giovannimnz/omni-spec-driven), não a este repo legacy.**

A partir do v5.1, o `omni-spec-driven` introduziu um hook de auto-instalação de skills locais:

- Coloque `SKILL.md` em `modules/skills/<name>/SKILL.md` no repo
- O `bin/install.js` detecta e instala em `~/.hermes/skills/hsd/<name>/`
- Não é necessário mexer no wordlist ou rebrand

Este hook **não foi portado** para `horus-spec-driven` (decisão D-1.1 — legacy estável). Para usar skills locais, migre para o projeto sucessor ou aplique o hook manualmente.
