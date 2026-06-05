---
name: hsd-back-maintain
description: "⚙️ Backend: maintain — Build the logic — debug, maintain, context"
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
    subcommands: ["docs-update", "extract-learnings", "ingest-docs", "import", "cleanup"]
---

# ⚙️ hsd-back-maintain 

**Role:** Backend  
**Verb:** maintain  
**Maps from:** 5 upstream commands  
**Description:** Build the logic — debug, maintain, context



---

## Quick Example

```
/hsd-back-maintain docs
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `docs-update` | Generate or update project documentation verified against the codebase |
| `extract-learnings` | Extract decisions, lessons, patterns, and surprises from completed phase artifacts |
| `ingest-docs` | Bootstrap or merge a .planning/ setup from existing ADRs, PRDs, SPECs, and docs in a repo. |
| `import` | Ingest external plans with conflict detection against project decisions before writing anything. |
| `cleanup` | Archive accumulated phase directories from completed milestones |

---

## Usage
```
/hsd-back-maintain <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
