# Horus Spec Driven — Claude Code

**Package:** dist/claude/
**Version:** 5.0.0
**Commands:** 4 (/hsd-pm, /hsd-dev, /hsd-qa, /hsd-config)
**Format:** SKILL.md (nested dirs under skills/hsd/)
**Install to:** ~/.claude/skills/

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
chmod +x dist/claude/install.sh
./dist/claude/install.sh
```

---

*Horus Spec Driven v5.0 — Claude Code*
