---
name: hsd-dev
description: "⚡ Desenvolvedor: Descobrir, definir, planejar, construir, depurar, manter, UI — o ciclo completo de dev"
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
    tags: ["hsd", "dev", "pt"]
    category: "dev"
    agent: "hsd-dev-agent"
    subcommands: ["discover", "define", "plan", "build", "debug", "maintain", "ui"]
---

# ⚡ hsd-dev

**Função:** Desenvolvedor
**Subcomandos:** 7

> Descobrir, definir, planejar, construir, depurar, manter, UI — o ciclo completo de dev

---


---

## Exemplo Rápido

```
//hsd-dev discover
```

---

## Subcomandos

| Subcommand | Mapeia de | Descrição |
|---|---|---|
| `discover` | explore, spike, sketch, capture, ns-ideate, map-codebase, ns-context | Descoberta e mapeamento — explorar, prototipar, pesquisar |
| `define` | discuss-phase, spec-phase, mvp-phase | Definir escopo, contexto e requisitos |
| `plan` | plan-phase, ultraplan-phase, ai-integration-phase | Criar planos detalhados de fase |
| `build` | execute-phase, autonomous, quick, fast | Executar planos e construir features |
| `debug` | debug, forensics | Debug sistemático e análise forense |
| `maintain` | docs-update, extract-learnings, ingest-docs, import, cleanup | Documentação, aprendizados, limpeza e importação |
| `ui` | ui-phase, ui-review | Contratos de design UI e revisão visual |



## Agente

**hsd-dev — Agente Desenvolvedor**

Especializado em descoberta, definição, planejamento e construção de software. Usa explore, spike, sketch, plan-phase e execute-phase como ferramentas principais.

**Ferramentas:** read_file, write_file, terminal, search_files, delegate_task

Este agente é ativado automaticamente ao usar `/hsd-dev`.


---

## Uso

```
/hsd-dev <subcommand> [args]
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
