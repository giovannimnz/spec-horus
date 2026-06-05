---
name: hsd-front-ui
description: "🎨 Frontend: ui — Build the UI — design contracts, visual review"
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
    tags: ["hsd", "front", "unified", "en"]
    category: "front"
    subcommands: ["ui-phase", "ui-review"]
---

# 🎨 hsd-front-ui 

**Role:** Frontend  
**Verb:** ui  
**Maps from:** 2 upstream commands  
**Description:** Build the UI — design contracts, visual review



---

## Quick Example

```
/hsd-front-ui spec --phase 2
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `ui-phase` | Generate UI design contract (UI-SPEC.md) for frontend phases |
| `ui-review` | Retroactive 6-pillar visual audit of implemented frontend code |

---

## Usage
```
/hsd-front-ui <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
