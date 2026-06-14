# DIST Architecture — Horus Spec Driven v5.0

## Visão Geral

Cada CLI tem sua própria pasta em `dist/` com **tudo personalizado**: skills no formato nativo, agentes especializados, SDK/adapter, instalador e documentação.

```
modules/gsd-core/  (upstream, submodule)
         │
         ▼
   bin/builder.js   ← Motor de build único
         │
         ├── 1. Rebrand (wordlist: gsd-X → hsd-{role})
         ├── 2. Content converters (por runtime)
         ├── 3. Frontmatter converters
         ├── 4. Subagent adapter
         │
         ▼
   dist/
   ├── hermes/      ← Hermes Agent
   │   ├── skills/hsd/          4 SKILL.md (nested, $ARGUMENTS[0])
   │   ├── agents/              hsd-*-agent.md (3)
   │   ├── adapter/             horus-sdk-hermes (31 verbos + graphifyy.py)
   │   ├── install.sh           Instalador self-contained
   │   └── README.md            Documentação específica
   ├── claude/      ← Claude Code
   │   ├── skills/hsd/          4 SKILL.md (flat, $ARGUMENTS[0])
   │   ├── agents/              hsd-*-agent.md (3)
   │   ├── install.sh
   │   └── README.md
   ├── codex/       ← OpenAI Codex
   │   ├── prompts/             15 prompt.md (1 por subcomando)
   │   ├── agents/              hsd-*-agent.md (3)
   │   ├── install.sh
   │   └── README.md
   ├── gemini/      ← Google Gemini CLI
   │   ├── commands/hsd/        15 .toml (1 por subcomando)
   │   ├── agents/              hsd-*-agent.toml (3)
   │   ├── install.sh
   │   └── README.md
   └── copilot/     ← GitHub Copilot
       ├── prompts/             15 copilot-instructions.md
       ├── agents/              hsd-*-agent.md (3)
       ├── install.sh
       └── README.md
```

## Como Funciona

### 1. Builder (`bin/builder.js`)

Motor único que gera todos os 5 runtimes. Lê `modules/unified-wordlist.json` e aplica as transformações específicas de cada runtime.

**Comandos:**
```bash
node bin/builder.js --all              # Todos os 5 runtimes
node bin/builder.js --runtime=hermes   # Só Hermes
node bin/builder.js --runtime=gemini   # Só Gemini
```

### 2. Skills por Runtime

| Runtime | Quantidade | Formato | Roteamento |
|---|---|---|---|
| **Hermes** | 4 SKILL.md | YAML frontmatter + nested dirs | `$ARGUMENTS[0]` dentro do body |
| **Claude Code** | 4 SKILL.md | YAML frontmatter + flat dirs | `$ARGUMENTS[0]` dentro do body |
| **Codex CLI** | 15 prompt.md + horus-sdk-codex | Template vars (`{{GSD_ARGS}}`) | 1 arquivo por subcomando |
| **Gemini CLI** | 15 .toml | TOML key=value | 1 arquivo por subcomando |
| **GitHub Copilot** | 15 .md | copilot-instructions.md | 1 arquivo por subcomando |

**Por que 4 no Hermes/Claude e 15 nos outros?**
- Hermes e Claude Code suportam `$ARGUMENTS[0]` — o skill recebe o subcomando como argumento e faz roteamento interno
- Codex, Gemini e Copilot **não** suportam esse mecanismo — precisam de 1 arquivo físico por subcomando

### 3. Agentes por Runtime

Cada runtime recebe 3 agentes especializados:
- `hsd-pm-agent` — Gerente de Projeto (new, track, ship, config, manage)
- `hsd-dev-agent` — Desenvolvedor (discover, define, plan, build, debug, maintain, ui)
- `hsd-qa-agent` — QA (validate, audit, review)

**Ferramentas (idênticas para todos):** read_file, write_file, terminal, search_files, delegate_task

### 4. SDK Adapter por runtime

Hermes recebe `horus-sdk-hermes` e Codex recebe `horus-sdk-codex`. Cada SDK fica em `dist/<runtime>/adapter/` e é instalado no home do runtime (`~/.hermes/skills/hsd/horus-sdk-hermes/` ou `~/.codex/skills/horus-sdk-codex/`). Claude/Gemini/Copilot continuam sem SDK dedicado nesta milestone.

### 5. Content Converters

Cada runtime tem seu próprio converter em `bin/lib/content-converters/`:

| Runtime | Arquivo | Transformações |
|---|---|---|
| Hermes | `hermes.js` | CLAUDE.md→HERMES.md, paths, horus-sdk-hermes |
| Claude | `claude.js` | Subagent neutralization |
| Codex | `codex.js` | $ARGUMENTS→{{GSD_ARGS}}, slash→skill |
| Gemini | `gemini.js` | .claude→.gemini, TOML format |
| Copilot | `copilot.js` | Tool name mapping |

### 6. Frontmatter Converters

Cada runtime tem seu próprio converter em `bin/lib/frontmatter-converters/`:

| Runtime | Formato |
|---|---|
| Hermes | YAML + `version:` |
| Claude | YAML |
| Codex | prompt.md (template vars) |
| Gemini | TOML |
| Copilot | copilot-instructions.md |

## Instalação por Runtime

Cada `dist/<runtime>/install.sh` é **self-contained** — detecta seu próprio diretório via `SCRIPT_DIR` e instala sem depender de caminhos absolutos.

```bash
# Hermes
bash dist/hermes/install.sh

# Claude Code
bash dist/claude/install.sh

# Codex CLI
bash dist/codex/install.sh

# Gemini CLI
bash dist/gemini/install.sh

# GitHub Copilot
bash dist/copilot/install.sh
```

## Sync Diário (Fork-Sync)

O fork-sync executa este pipeline diariamente às 08:00 UTC:

```bash
# 1. Update upstream submodule
git submodule update --init --remote --depth 1 modules/gsd-core

# 2. Build wordlist
node bin/rebrand.js modules/unified-wordlist.json

# 3. Build all dist/
node bin/builder.js --all

# 4. Install (Hermes, global)
bash dist/hermes/install.sh
```

## Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────┐
│  modules/gsd-core/  (upstream, git submodule)       │
│  ├── commands/gsd/*.md  (67 comandos)               │
│  ├── agents/*.md         (33 agentes)               │
│  ├── skills/             (skills)                   │
│  ├── workflows/          (workflows)                │
│  ├── templates/          (templates)                │
│  └── references/         (referências)              │
└─────────────────────────────────────────────────────┘
         │
         ▼  bin/rebrand.js
  ┌──────────────────────────────────────────┐
  │  modules/unified-wordlist.json           │
  │  157 entries: gsd-X → hsd-{role}         │
  │  + upstream filter (remove > ultra)      │
  └──────────────────────────────────────────┘
         │
         ▼  bin/builder.js
  ┌──────────────────────────────────────────┐
  │  Para cada runtime (×5):                 │
  │  1. Build skills (format-specific)       │
  │  2. Build agents (3 per role)            │
  │  3. Copy adapter (Hermes only)           │
  │  4. Generate install.sh                  │
  │  5. Generate README.md                   │
  └──────────────────────────────────────────┘
         │
         ▼
  ┌──────────────────────────────────────────┐
  │  dist/{hermes,claude,codex,gemini,copilot}│
  │  108 arquivos no total, 5 pacotes        │
  └──────────────────────────────────────────┘
         │
         ▼  dist/<runtime>/install.sh
  ┌──────────────────────────────────────────┐
  │  Instalação no CLI do usuário            │
  │  Hermes: ~/.hermes/skills/hsd/           │
  │  Claude: ~/.claude/skills/               │
  │  Codex:  ~/.codex/prompts/               │
  │  Gemini: ~/.gemini/commands/hsd/         │
  │  Copilot: .github/prompts/               │
  └──────────────────────────────────────────┘
```

## Decisões Arquiteturais

| Decisão | Detalhe |
|---|---|
| **Builder único** | Um script gera todos os 5 runtimes — evita duplicação de lógica |
| **Dist/ imutável** | Gerado pelo builder, nunca editado manualmente |
| **Self-contained** | Cada `install.sh` detecta seu próprio diretório via `SCRIPT_DIR` |
| **Upstream filter** | Comandos com níveis > ultra (wenyan-*, extreme-*) são removidos automaticamente |
| **Agentes por role** | 3 agentes com mesmo toolset, especialidades diferentes |
| **SDK por runtime** | Hermes usa horus-sdk-hermes; Codex usa horus-sdk-codex; evitar adapter genérico |

---

*Horus Spec Driven v5.0 — dist/ architecture*
