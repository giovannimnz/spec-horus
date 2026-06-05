---
name: hsd-back-context
description: "⚙️ Backend: context — Build the logic — debug, maintain, context"
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
    subcommands: ["ns-context"]
---

# ⚙️ hsd-back-context 

**Role:** Backend  
**Verb:** context  
**Maps from:** 1 upstream commands  
**Description:** Build the logic — debug, maintain, context



---

## Quick Example

```
/hsd-back-context
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `ns-context` | codebase intelligence | map graphify docs learnings |

---

## Usage
```
/hsd-back-context <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
