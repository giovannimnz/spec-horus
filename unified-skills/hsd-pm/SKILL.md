---
name: hsd-pm
description: "📋 Gerente de Projeto: Criar projetos, acompanhar progresso, entregar releases, gerenciar configuração"
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
    tags: ["hsd", "pm", "pt"]
    category: "pm"
    agent: "hsd-pm-agent"
    subcommands: ["new", "track", "ship", "config", "manage"]
---

# 📋 hsd-pm

**Função:** Gerente de Projeto
**Subcomandos:** 5

> Criar projetos, acompanhar progresso, entregar releases, gerenciar configuração

---


## Detecção Automática

Se não houver .planning/ no diretório atual, este comando automaticamente:
1. Executa map-codebase para mapear o código existente
2. Cria a estrutura .planning/ com ROADMAP.md, REQUIREMENTS.md, STATE.md
3. Inicia o milestone inicial e a primeira fase
4. Prossegue com o subcomando solicitado

> Isso garante que o projeto sempre tenha contexto antes de qualquer operação.


---

## Exemplo Rápido

```
//hsd-pm new
```

---

## Subcomandos

| Subcommand | Mapeia de | Descrição |
|---|---|---|
| `new` | new-project, new-milestone | Criar novo projeto ou milestone |
| `track` | progress, workstreams, thread, phase, workspace, graphify, stats, ns-project, ns-workflow, ns-manage | Acompanhar progresso, workstreams e métricas |
| `ship` | ship, pr-branch, complete-milestone, milestone-summary, undo, update | Entregar, fazer deploy, completar milestones |
| `config` | config, settings, profile-user | Configurar modelos, ajustes e perfis |
| `manage` | manager, surface, pause-work, resume-work, help, inbox | Dashboard, pausar/retomar, triar backlog |



## Agente

**hsd-pm — Agente Gerente de Projeto**

Especializado em criação de projetos, acompanhamento de progresso, releases e configuração. Usa new-project, progress, graphify e ship como ferramentas principais.

**Ferramentas:** read_file, write_file, terminal, search_files, delegate_task

Este agente é ativado automaticamente ao usar `/hsd-pm`.


---

## Uso

```
/hsd-pm <subcommand> [args]
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
