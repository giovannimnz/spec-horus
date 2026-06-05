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
# → hermes claude codex gemini

ls ~/.hermes/skills/hsd/
# → hsd-po-discover  hsd-po-new  hsd-po-define  hsd-po-inbox
# → hsd-pm-plan      hsd-pm-exec hsd-pm-track   hsd-pm-config
# → hsd-pm-ship      hsd-pm-manage
# → hsd-front-ui
# → hsd-back-debug   hsd-back-maintain  hsd-back-context
# → hsd-qa-validate  hsd-qa-audit  hsd-qa-review
# → horus-sdk-adapter
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
# Test adapter
node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs state load --cwd /path/to/project

# Test graphify (code-aware knowledge graph)
node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs graphify build --cwd /path/to/project
node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs graphify query "function" --cwd /path/to/project
```

## Requirements

| Dependency | Why |
|---|---|
| **Node.js ≥ 22** | Core engine — install.js, rebrand.js, horus-sdk-adapter |
| **Python 3.8+** | graphifyy.py — code-aware scanning (auto-installs if missing) |
| **Git** | Vendor pull from open-gsd/gsd-core |
| **PM2** | Auto-sync cron (optional) |

## Layout

### Hermes
```
~/.hermes/skills/hsd/
├── hsd-po-discover/SKILL.md
├── hsd-po-new/SKILL.md
├── hsd-po-define/SKILL.md
├── hsd-po-inbox/SKILL.md
├── hsd-pm-plan/SKILL.md
├── hsd-pm-exec/SKILL.md
├── hsd-pm-track/SKILL.md
├── hsd-pm-config/SKILL.md
├── hsd-pm-ship/SKILL.md
├── hsd-pm-manage/SKILL.md
├── hsd-front-ui/SKILL.md
├── hsd-back-debug/SKILL.md
├── hsd-back-maintain/SKILL.md
├── hsd-back-context/SKILL.md
├── hsd-qa-validate/SKILL.md
├── hsd-qa-audit/SKILL.md
├── hsd-qa-review/SKILL.md
└── horus-sdk-adapter/
    ├── index.cjs
    ├── state.cjs
    ├── graphify.cjs
    ├── graphifyy.py
    └── ...
```

### Claude Code
```
~/.claude/skills/
├── hsd-po-discover/SKILL.md
├── hsd-pm-plan/SKILL.md
└── ...
```

### Codex
```
~/.codex/prompts/
├── hsd-po-discover.md
├── hsd-pm-plan.md
└── ...
```

### Gemini
```
~/.gemini/commands/hsd/
├── hsd-po-discover.toml
├── hsd-pm-plan.toml
└── ...
```

### Copilot
```
.github/prompts/
├── hsd-po-discover.md
├── hsd-pm-plan.md
└── ...
```
