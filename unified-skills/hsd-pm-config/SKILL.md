---
name: hsd-pm-config
description: "📋 Project Manager: config — Manage HOW it gets built — plan, execute, track, ship"
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
    subcommands: ["config", "settings", "profile-user"]
---

# 📋 hsd-pm-config 

**Role:** Project Manager  
**Verb:** config  
**Maps from:** 3 upstream commands  
**Description:** Manage HOW it gets built — plan, execute, track, ship



---

## Quick Example

```
/hsd-pm-config set model_profile gpt-4
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `config` | Configure GSD settings — workflow toggles, advanced knobs, integrations, and model profile |
| `settings` | Configure GSD workflow toggles and model profile |
| `profile-user` | Generate developer behavioral profile and create Claude-discoverable artifacts |

---

## Usage
```
/hsd-pm-config <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
