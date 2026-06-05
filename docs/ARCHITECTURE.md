# Architecture — Horus Spec Driven

Design do wrapper, submodules, rebrand, e pipeline de install/sync.

## Visão geral

```
┌──────────────────────────────────────────────────────────────────────┐
│  horus-spec-driven  (este repo, MIT)                                │
│                                                                      │
│  modules/ (git submodules — versionados)                            │
│  ├── gsd-core/     → open-gsd/gsd-core (upstream GSD)              │
│  ├── caveman/      → juliusbrussee/caveman (compressão ultra)       │
│  └── impeccable/   → pbakaus/impeccable (design language)           │
│                                                                      │
│  bin/install.js ──┐                                                  │
│  bin/sync.js ─────┤                                                  │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  Stage 1: Pull (git submodule update --remote)             │      │
│  │    modules/gsd-core/ → open-gsd/gsd-core (latest)          │      │
│  └────────────────────────────────────────────────────────────┘      │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  Stage 2: Wordlist                                          │      │
│  │    scan modules/gsd-core/commands/gsd/*.md                  │      │
│  │    build unified map: gsd-X → hsd-{role}-Y                  │      │
│  │    output: modules/unified-wordlist.json                    │      │
│  └────────────────────────────────────────────────────────────┘      │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  Stage 3: Unified Skills                                    │      │
│  │    build-unified-skills.cjs gera 18 SKILL.md                │      │
│  │    17 role-based + 1 hsd-config                             │      │
│  │    i18n: locale en/pt selecionável                          │      │
│  └────────────────────────────────────────────────────────────┘      │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  Stage 4: Content Converters (por runtime)                  │      │
│  │    ┌──────────┬───────────────────┬──────────────────┐      │      │
│  │    │ Runtime  │ Content Conv      │ Frontmatter Conv │      │      │
│  │    ├──────────┼───────────────────┼──────────────────┤      │      │
│  │    │ Hermes   │ CLAUDE.md→HERMES  │ SKILL.md +version│      │      │
│  │    │ Claude   │ Subagent neutro   │ SKILL.md         │      │      │
│  │    │ Codex    │ $ARG→{{GSD_ARGS}} │ prompt.md        │      │      │
│  │    │ Gemini   │ .claude→.gemini   │ TOML             │      │      │
│  │    │ Copilot  │ Tool name mapping │ copilot-instructions│    │      │
│  │    └──────────┴───────────────────┴──────────────────┘      │      │
│  └────────────────────────────────────────────────────────────┘      │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  Stage 5: Install                                           │      │
│  │    Runtime:          Destino:           Format:             │      │
│  │    Hermes Agent     skills/hsd/       SKILL.md (nested)    │      │
│  │    Claude Code      skills/           SKILL.md (flat)     │      │
│  │    OpenAI Codex     prompts/          prompt.md            │      │
│  │    Google Gemini    commands/hsd/     .toml                │      │
│  │    GitHub Copilot   .github/prompts/  copilot-instructions │      │
│  ├── + horus-sdk-adapter (skill extra, só Hermes)             │      │
│  └────────────────────────────────────────────────────────────┘      │
│                                                                      │
│  Output: 18 skills × N runtimes                                     │
│                                                                      │
│  PM2 cron: ecosystem.daily-sync.cron.json (08:00 UTC)               │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Componentes

### 1. Submódulos (`modules/`)

Em vez de `git clone --depth 1` (shallow, não versionado), usamos **git submodules**:

| Submódulo | URL | Propósito |
|---|---|---|
| `modules/gsd-core` | open-gsd/gsd-core | Framework GSD upstream (67 comandos) |
| `modules/caveman` | juliusbrussee/caveman | Comunicação ultra-comprimida |
| `modules/impeccable` | pbakaus/impeccable | Design language system |

Atualização: `git submodule update --init --remote --depth 1 modules/<name>`

### 2. Wordlist (`bin/rebrand.js`)

Mapeia 67 comandos do gsd-core em 17 comandos unificados por role:

```
gsd-new-project     → hsd-po-new        (PO)
gsd-execute-phase   → hsd-pm-exec       (PM)
gsd-validate-phase  → hsd-qa-validate   (QA)
gsd-ui-phase        → hsd-front-ui      (FRONT)
gsd-debug           → hsd-back-debug    (BACK)
```

157 regras + agentes + marcas históricas.
Output: `modules/unified-wordlist.json` (gitignored, gerado).

### 3. Unified Skills (`bin/build-unified-skills.cjs`)

Gera 18 SKILL.md a partir do wordlist + comandos vendor:
- 17 skills com role (po/pm/front/back/qa)
- 1 skill de configuração (`hsd-config`)
- Suporte a i18n (locale `--locale pt` ou `en`)
- Frontmatter YAML + tabela de subcomandos + exemplos

### 4. Content Converters (`bin/lib/content-converters/`)

Cada runtime converte o conteúdo do SKILL.md para o formato nativo:

| Runtime | Arquivo | Transformações |
|---|---|---|
| **Hermes** | `hermes.js` | CLAUDE.md→HERMES.md, .claude/→.hermes/, horus-sdk-adapter injection |
| **Claude** | `claude.js` | Subagent neutralization, colon→hyphen |
| **Codex** | `codex.js` | $ARGUMENTS→{{GSD_ARGS}}, slash→skill mentions |
| **Gemini** | `gemini.js` | .claude→.gemini, CLAUDE.md→GEMINI.md |
| **Copilot** | `copilot.js` | Tool name mapping, AGENTS.md→copilot-instructions.md |

### 5. Frontmatter Converters (`bin/lib/frontmatter-converters/`)

Cada runtime tem seu formato de frontmatter:
- **Hermes**: SKILL.md com YAML completo + version
- **Claude**: SKILL.md com YAML (reuso do Hermes)
- **Codex**: prompt.md com template vars
- **Gemini**: TOML
- **Copilot**: copilot-instructions.md

### 6. horus-sdk-adapter (`bin/lib/horus-sdk-adapter/`)

Reimplementação completa do `gsd-tools.cjs` para Hermes. 13 módulos, 31 verbos:

```
state.cjs     (16 subcomandos)    — load, init, snapshot, summary, history
config.cjs    (6 subcomandos)     — get, set, model-profile, new-project
commit.cjs    (3 subcomandos)     — commit, subrepo, check
frontmatter.cjs (4 subcomandos)  — get, set, merge, validate
roadmap.cjs   (13 subcomandos)   — get-phase, analyze, add, insert
validate.cjs  (7 subcomandos)    — consistency, health, audit-uat
workstream.cjs (6 subcomandos)   — create, list, set, complete
scaffold.cjs  (5 subcomandos)    — context, uat, verification
milestone.cjs (2 subcomandos)    — complete, requirements
misc.cjs      (13 subcomandos)   — list-todos, gap-analysis, learnings
resolve.cjs   (5 subcomandos)    — progress, resolve-model, granularity
graphify.cjs  (5 subcomandos)    — build, query, status, diff (JS fallback)
graphifyy.py  (460 linhas)       — Python code-aware scanner
index.cjs     (dispatch CLI)     — 31 verbos
```

### 7. graphifyy.py

Scanner de código em Python stdlib, zero dependências:

- **Python**: AST parser — classes, funções, imports
- **JS/TS**: Regex — exports, imports, requires, rotas
- **SQL**: Regex — CREATE TABLE
- **Genérico**: Go, Rust, Java, etc.

3 tiers de armazenamento (auto-detect):
1. Python (code-aware) — melhor
2. File JSON (`.planning/graphs/graph.json`) — fallback
3. PostgreSQL (`postgres_fact_store`) — se disponível

### 8. i18n (`locales/`)

Alternância de idioma via `horus-spec-driven language <code>`:
- `en` → English
- `pt` → Português

Apenas descrições dos comandos são traduzidas. Artefatos `.planning/` permanecem em inglês.

---

## Fluxo de Instalação

```bash
# 1. Clonar com submodules
git clone --recurse-submodules https://github.com/giovannimnz/horus-spec-driven.git

# 2. Pull latest upstream
git submodule update --init --remote --depth 1 modules/gsd-core

# 3. Build wordlist
node bin/rebrand.js modules/unified-wordlist.json

# 4. Build unified skills (com locale)
node bin/build-unified-skills.cjs --locale pt

# 5. Install
node bin/install.js install --runtime=hermes --global --no-pull

# 6. (Opcional) Sync diário automático
pm2 start ecosystem.daily-sync.cron.json
pm2 save
```

---

## Fluxo de Sync (Diário)

08:00 UTC via PM2 (config em `ecosystem.daily-sync.cron.json`):

```
1. git submodule update --remote modules/gsd-core
2. node bin/rebrand.js modules/unified-wordlist.json
3. node bin/build-unified-skills.cjs
4. node bin/install.js install --all --global --no-pull
```

---

## Estrutura do Repositório

```
horus-spec-driven/
├── bin/
│   ├── install.js                  Pipeline completo (pull → rebrand → build → install)
│   ├── rebrand.js                  Wordlist builder (157 regras, 67→17)
│   ├── build-unified-skills.cjs    Gera 18 SKILL.md com i18n
│   ├── sync.js                     Convenience wrapper (install --no-pull)
│   └── lib/
│       ├── horus-sdk-adapter/      Reimplementation do gsd-tools.cjs (31 verbos)
│       ├── content-converters/     5 conversores de conteúdo (hermes, claude, codex, gemini, copilot)
│       ├── frontmatter-converters/ 5 conversores de frontmatter
│       ├── subagent-adapter/       Neutralização de Agent() calls
│       ├── layout.js               Layout kind-driven por runtime
│       └── runtime-paths.js        Resolução de home por runtime
├── modules/ (+ .gitmodules)        Submódulos versionados
│   ├── gsd-core/                   open-gsd/gsd-core (upstream)
│   ├── caveman/                    juliusbrussee/caveman
│   └── impeccable/                 pbakaus/impeccable
├── unified-skills/                 18 SKILL.md gerados (gitignored? verificar)
├── locales/                        Traduções (en.json, pt.json)
├── runtimes/                       Specs de cada CLI
├── docs/                           Documentação
│   ├── ARCHITECTURE.md             Este arquivo
│   ├── COMPATIBILITY.md            Matriz de compatibilidade cross-CLI
│   ├── CONVERTERS.md               Content & frontmatter converters
│   ├── HORUS-SDK-MAPPING.md        Mapeamento gsd-tools → horus-sdk
│   ├── REBRAND.md                  Rebrand engine
│   └── RUNTIMES.md                 Per-platform specs
├── README.md / README-en.md        Documentação principal (pt/en)
├── SETUP.md                        Quick setup
├── CHANGELOG.md                    Histórico de versões
├── horus-spec-driven.json          Config principal
└── ecosystem.daily-sync.cron.json  PM2 cron
```

---

## Decision Log

| Decisão | Detalhes | Arquivo |
|---|---|---|
| D-01 | Unificação por role (67→17) | vault 21.01 |
| D-02 | Storage-agnostic graphify | vault 21.01 |
| D-03 | Prefixo hsd (Horus Spec Driven) | vault 21.01 |
| D-04 | Subcomandos via $ARGUMENTS[0] | vault 21.01 |
| D-05 | Layout skills/hsd/ como namespace raiz | vault 21.01 |
| D-06 | Reimplementação total do gsd-tools.cjs | vault 21.03 |
| D-07 | graphifyy.py em Python stdlib | vault 21.03 |
| D-08 | <horus_sdk_adapter> injection | vault 21.03 |
| D-09 | agent-skills via skill_view() | vault 21.03 |
| D-10 | Localização apenas nas descrições | vault 21.04 |
| D-11 | Persistência e rebuild automático | vault 21.04 |
| D-12 | /hsd-config para configurar idioma | vault 21.04 |
