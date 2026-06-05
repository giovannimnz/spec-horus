---
name: hsd-pm-exec
description: "📋 Project Manager: exec — Manage HOW it gets built — plan, execute, track, ship"
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
    subcommands: ["execute-phase", "autonomous", "quick", "fast", "executor"]
---

# 📋 hsd-pm-exec 

**Role:** Project Manager  
**Verb:** exec  
**Maps from:** 5 upstream commands  
**Description:** Manage HOW it gets built — plan, execute, track, ship



---

## Quick Example

```
/hsd-pm-exec run --phase 1
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `execute-phase` | Execute all plans in a phase with wave-based parallelization |
| `autonomous` | Run all remaining phases autonomously — discuss→plan→execute per phase |
| `quick` | Execute a quick task with GSD guarantees (atomic commits, state tracking) but skip optional agents |
| `fast` | Execute a trivial task inline — no subagents, no planning overhead |
| `executor` | executor |

---

## Usage
```
/hsd-pm-exec <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
