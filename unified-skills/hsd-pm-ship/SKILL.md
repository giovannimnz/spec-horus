---
name: hsd-pm-ship
description: "📋 Project Manager: ship — Manage HOW it gets built — plan, execute, track, ship"
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
    subcommands: ["ship", "pr-branch", "complete-milestone", "milestone-summary", "undo", "update"]
---

# 📋 hsd-pm-ship 

**Role:** Project Manager  
**Verb:** ship  
**Maps from:** 6 upstream commands  
**Description:** Manage HOW it gets built — plan, execute, track, ship



---

## Quick Example

```
/hsd-pm-ship release
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `ship` | Create PR, run review, and prepare for merge after verification passes |
| `pr-branch` | Create a clean PR branch by filtering out .planning/ commits — ready for code review |
| `complete-milestone` | Archive completed milestone and prepare for next version |
| `milestone-summary` | Generate a comprehensive project summary from milestone artifacts for team onboarding and review |
| `undo` | Safe git revert. Roll back phase or plan commits using the phase manifest with dependency checks. |
| `update` | Update GSD to latest version with changelog display |

---

## Usage
```
/hsd-pm-ship <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
