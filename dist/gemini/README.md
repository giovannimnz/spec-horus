# Horus Spec Driven — Google Gemini CLI

**Package:** dist/gemini/
**Version:** 5.0.0
**Commands:** 15 (/hsd-pm:new ... /hsd-qa:review)
**Format:** .toml
**Install to:** ~/.gemini/commands/hsd/

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

## Install

```bash
chmod +x dist/gemini/install.sh
./dist/gemini/install.sh
```

---

*Horus Spec Driven v5.0 — Google Gemini CLI*
