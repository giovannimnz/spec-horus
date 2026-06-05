---
name: hsd-qa
description: "✅ Qualidade: Validar, auditar, revisar — qualidade em cada etapa"
version: "4.1.0"
author: "Horus Spec Driven"
license: "MIT"
locale: "pt"
platforms:
  - hermes
  - claude-code
  - codex
  - gemini
  - copilot
metadata:
  hermes:
    tags: ["hsd", "qa", "pt"]
    category: "qa"
    agent: "hsd-qa-agent"
    subcommands: ["validate", "audit", "review"]
---

# ✅ hsd-qa

**Função:** Qualidade
**Subcomandos:** 3

> Validar, auditar, revisar — qualidade em cada etapa

---


---

## Exemplo Rápido

```
//hsd-qa validate
```

---

## Subcomandos

| Subcommand | Mapeia de | Descrição |
|---|---|---|
| `validate` | validate-phase, verify-work, health, add-tests | Validar fases, verificar implementações, health checks |
| `audit` | audit-fix, audit-milestone, audit-uat | Auditar milestones, lacunas de UAT e correções |
| `review` | code-review, eval-review, review, review-backlog, plan-review-convergence, ns-review, secure-phase | Code review, peer review, security review |



## Agente

**hsd-qa — Agente de Qualidade**

Especializado em validação, auditoria e revisão de código e fases. Usa validate-phase, audit-fix, code-review e secure-phase como ferramentas principais.

**Ferramentas:** read_file, write_file, terminal, search_files, delegate_task

Este agente é ativado automaticamente ao usar `/hsd-qa`.


---

## Uso

```
/hsd-qa <subcommand> [args]
```
`$ARGUMENTS[0]` seleciona o subcomando.

---

## Notas de Runtime

<horus_sdk_adapter runtime="hermes">
Este skill usa o **horus-sdk-adapter** para operações internas.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`
</horus_sdk_adapter>

---

*Horus Spec Driven v4.1 — Português (Brasil)*
