# HSD — CLI Compatibility Matrix

**Qual skill/comando funciona em qual CLI.**

O Horus Spec Driven é um wrapper multi-CLI. Cada runtime tem capacidades diferentes. Esta matriz documenta exatamente o que funciona onde.

---

## Slash Commands

| Comando | Hermes | Claude Code | Codex | Gemini CLI | Copilot | Notas |
|---|---|---|---|---|---|---|
| `/hsd-po-discover` | ✅ | ✅ | ✅ | ✅ | ✅ | Skills de descoberta — funciona em todos |
| `/hsd-po-new` | ✅ | ✅ | ✅ | ✅ | ✅ | Criação de projeto/milestone |
| `/hsd-po-define` | ✅ | ✅ | ✅ | ✅ | ✅ | Discussão e especificação |
| `/hsd-po-inbox` | ✅ | ✅ | ✅ | ✅ | ✅ | Triage de issues |
| `/hsd-pm-plan` | ✅ | ✅ | ✅ | ✅ | ✅ | Planejamento de fase |
| `/hsd-pm-exec` | ✅ | ✅ | ✅ | ✅ | ✅ | Execução de planos |
| `/hsd-pm-track` | ✅ | ✅ | ✅ | ✅ | ✅ | Tracking e progresso |
| `/hsd-pm-config` | ✅ | ✅ | ✅ | ✅ | ✅ | Configuração |
| `/hsd-pm-ship` | ✅ | ✅ | ✅ | ✅ | ✅ | Release e deploy |
| `/hsd-pm-manage` | ✅ | ✅ | ✅ | ✅ | ✅ | Gestão geral |
| `/hsd-front-ui` | ✅ | ✅ | ✅ | ✅ | ✅ | Design UI |
| `/hsd-back-debug` | ✅ | ✅ | ✅ | ✅ | ✅ | Debug |
| `/hsd-back-maintain` | ✅ | ✅ | ✅ | ✅ | ✅ | Manutenção |
| `/hsd-back-context` | ✅ | ✅ | ✅ | ✅ | ✅ | Contexto |
| `/hsd-qa-validate` | ✅ | ✅ | ✅ | ✅ | ✅ | Validação |
| `/hsd-qa-audit` | ✅ | ✅ | ✅ | ✅ | ✅ | Auditoria |
| `/hsd-qa-review` | ✅ | ✅ | ✅ | ✅ | ✅ | Revisão |
| `/hsd-config` | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | Config do HSD (lê horus-spec-driven.json) |

---

## Funcionalidades Avançadas

| Funcionalidade | Hermes | Claude Code | Codex | Gemini CLI | Copilot |
|---|---|---|---|---|---|
| **horus-sdk-adapter** (31 verbos) | ✅ Nativo | ❌ | ❌ | ❌ | ❌ |
| **graphify (Python code-aware)** | ✅ Nativo | ❌ | ❌ | ❌ | ❌ |
| **graphify (File-based fallback)** | ✅ Nativo | ⬜ Planejado | ⬜ Planejado | ⬜ Planejado | ⬜ |
| **agent-skills** | ✅ skill_view() | ✅ Agent() | ⬜ delegate | ❌ | ❌ |
| **websearch** | ✅ web_search() | ✅ Brave API | ❌ | ❌ | ❌ |

---

## Conversores de Conteúdo

| Runtime | Content Converter | Frontmatter Converter | Instala em |
|---|---|---|---|
| **Hermes** | Hermes → Hermes (CLAUDE.md→HERMES.md, paths) | Preserva YAML original + version | `~/.hermes/skills/hsd/` |
| **Claude Code** | Claude → Claude (subagent neutralization) | Claude SKILL format | `~/.claude/skills/` |
| **Codex** | Codex ($ARGUMENTS→{{GSD_ARGS}}) | Codex prompt.md | `~/.codex/prompts/` |
| **Gemini CLI** | Gemini (.claude→.gemini) | TOML format | `~/.gemini/commands/hsd/` |
| **GitHub Copilot** | Copilot (tool name mapping) | copilot-instructions.md | `.github/prompts/` |

---

## Funcionalidades Exclusivas do Hermes

As seguintes capacidades SÓ existem no Hermes porque dependem de ferramentas nativas que os outros CLIs não têm:

### horus-sdk-adapter (31 verbos)

Reimplementação completa do `gsd-tools.cjs` (1722 linhas) usando ferramentas nativas do Hermes:

| Verbo | Hermes-native | Descrição |
|---|---|---|
| `state` | `read_file`, `write_file` | Load, init, snapshot, summary, history |
| `config` | `read_file`, `write_file` | Get, set, model-profile, new-project |
| `commit` | `terminal(git...)` | Commit, subrepo, check |
| `frontmatter` | `read_file`, `write_file` | Get, set, merge, validate |
| `roadmap` | `read_file`, `search_files` | Get-phase, analyze, find, add |
| `validate` | `read_file`, `search_files` | Consistency, health, audit-uat |
| `workstream` | `read_file`, `write_file` | Create, list, set, complete |
| `scaffold` | `write_file`, `mkdir` | Context, uat, verification |
| `milestone` | `read_file`, `write_file` | Complete, requirements |
| `misc` | `read_file`, `terminal` | List-todos, gap-analysis, learnings |
| `resolve` | `read_file`, `search_files` | Progress, resolve-model |
| `graphify` | `execSync(python3...)` | Build, query, status, diff |
| `agent-skills` | `skill_view()` | Bridge para sub-agentes |
| `websearch` | `web_search()` | Busca com 4 backends |

### graphifyy.py

Scanner de código em Python puro (stdlib, zero dependências) que analisa:
- **Python** — AST parser (classes, funções, imports)
- **JavaScript/TypeScript** — Regex (exports, imports, rotas)
- **SQL** — Regex (CREATE TABLE)
- **Genérico** — Go, Rust, Java, etc.

Tiers de armazenamento:
1. **Python** (Tier 0) — análise de código completa, auto-instala se ausente
2. **File JSON** (Tier 1) — `.planning/graphs/graph.json`, zero config
3. **PostgreSQL** (Tier 2) — `postgres_fact_store` com tsvector

---

## Funcionalidades Exclusivas do Claude Code

| Funcionalidade | Descrição |
|---|---|
| `Agent(subagent_type="gsd-X")` | Spawn de subagentes nativos |
| `Skill(skill="gsd-X")` | Invocação de skills como ferramentas |
| Revisão cross-AI | `/gsd-review` com agentes externos |

---

## Funcionalidades Exclusivas do Codex

| Funcionalidade | Descrição |
|---|---|
| `delegate` | Delegation de tarefas |
| Template vars | `{{GSD_ARGS}}` nativo |

---

## Compatibilidade por Tipo de Arquivo

| Extensão | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|
| `SKILL.md` (frontmatter YAML) | ✅ | ✅ | ⚠️ prompt.md | ❌ | ❌ |
| `.md` (flat) | ✅ | ✅ | ✅ | ❌ | ✅ |
| `.toml` | ❌ | ❌ | ❌ | ✅ | ❌ |
| `copilot-instructions.md` | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Planos Futuros

| Plataforma | Previsão | Adaptação necessária |
|---|---|---|
| **Amazon Q Developer** | 📋 Planejado | Converter de SKILL.md para formato Q (.md) |
| **JetBrains AI** | 📋 Planejado | Converter para formato JetBrains (.md) |
| **Cursor** | 📋 Planejado | Cursor usa formato Claude Code — compatível |

---

*Horus Spec Driven v3.0.0 — Atualizado em 2026-06-05*
