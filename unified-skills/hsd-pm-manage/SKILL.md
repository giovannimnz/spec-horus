---
name: hsd-pm-manage
description: "📋 Project Manager: manage — Manage HOW it gets built — plan, execute, track, ship"
version: "3.0.0"
author: "Horus Spec Driven"
license: "MIT"
locale: "en"
platforms:
  - hermes
  - claude-code
  - codex
  - gemini
  - copilot
metadata:
  hermes:
    tags: ["hsd", "pm", "unified", "en"]
    category: "pm"
    subcommands: ["manager", "surface", "pause-work", "resume-work", "help"]
---

# 📋 hsd-pm-manage 

**Role:** Project Manager  
**Verb:** manage  
**Maps from:** 5 upstream commands  
**Description:** Manage HOW it gets built — plan, execute, track, ship



---

## Quick Example

```
/hsd-pm-manage dashboard
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `manager` | Interactive command center for managing multiple phases from one terminal |
| `surface` | Toggle which skills are surfaced — apply a profile, list, or disable a cluster without reinstall |
| `pause-work` | Create context handoff when pausing work mid-phase |
| `resume-work` | Resume work from previous session with full context restoration |
| `help` | Show available GSD commands and usage guide |

---

## Usage
```
/hsd-pm-manage <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
