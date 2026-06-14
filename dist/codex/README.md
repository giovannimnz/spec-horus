# Horus Spec Driven — OpenAI Codex

**Package:** dist/codex/
**Version:** 5.0.0
**Commands:** 15 (hsd-pm-new ... hsd-qa-review)
**Format:** prompt.md + horus-sdk-codex
**Install to:** ~/.codex/prompts/ + ~/.codex/skills/horus-sdk-codex/

## Slash Commands

| Comando | Subcomandos |
|---|---|
| `/hsd-pm` | new, track, ship, config, manage |
| `/hsd-dev` | discover, define, plan, build, debug, maintain, ui |
| `/hsd-qa` | validate, audit, review |
| `/hsd-config` | language, compression, agents |

## Agentes

| Agente | Ferramentas |
|---|---|
| hsd-pm-agent | read, write, terminal, search, delegate |
| hsd-dev-agent | read, write, terminal, search, delegate |
| hsd-qa-agent | read, write, terminal, search, delegate |

## Adapter

horus-sdk-codex incluído — SDK Codex-native para operações GSD/HSD com .planning/.

`node ~/.codex/skills/horus-sdk-codex/index.cjs <verb> [args] --cwd .`
## Install

```bash
chmod +x dist/codex/install.sh
./dist/codex/install.sh
```

---

*Horus Spec Driven v5.0 — OpenAI Codex*
