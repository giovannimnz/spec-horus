---
name: hsd-back-debug
description: "⚙️ Backend: debug — Build the logic — debug, maintain, context"
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
    tags: ["hsd", "back", "unified", "en"]
    category: "back"
    subcommands: ["debug", "forensics", "debugger"]
---

# ⚙️ hsd-back-debug 

**Role:** Backend  
**Verb:** debug  
**Maps from:** 3 upstream commands  
**Description:** Build the logic — debug, maintain, context



---

## Quick Example

```
/hsd-back-debug trace --phase 1
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `debug` | Systematic debugging with persistent state across context resets |
| `forensics` | Post-mortem investigation for failed GSD workflows — diagnoses what went wrong. |
| `debugger` | debugger |

---

## Usage
```
/hsd-back-debug <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
