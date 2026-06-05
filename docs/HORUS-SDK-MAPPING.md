---
type: projeto-reference
projeto: horus-spec-driven
data: 2026-06-05
autor: filippo
status: authoritative
tags: [gsd, gsd-core, gsd-sdk, horus-spec-driven, multi-runtime, adapter]
---

# gsd-tools.cjs — Mapeamento Completo por Runtime

Fonte: `gsd-core/bin/gsd-tools.cjs` (1722 linhas, 60 subcomandos, v1.3.1-dev).
Este documento é a verdade canônica para o **Phase 3: gsd-sdk Adapter por
Runtime** do Spec-Horus.

## Método de leitura

Cada tabela mapeia um grupo de subcomandos. Colunas:
- **Upstream**: o que `gsd-tools.cjs <verb> [args]` faz
- **Nível**: A (inline no skill body), B (wrapper script), C (reimplementação)
- **Hermes**: equivalente usando `read_file`, `write_file`, `terminal`, `delegate_task`
- **Claude**: equivalente nativo (Read, Write, Bash, Task tool, etc.) ou "native" se direto
- **Codex**: equivalente
- **Gemini**: equivalente
- **Copilot**: equivalente

Símbolos:
- ✅ = funciona nativamente, sem adaptação
- 🔄 = precisa de adaptação (mapeado na tabela)
- ❌ = não suportado neste runtime
- ⚠️ = suporte parcial ou com ressalvas

---

## CATEGORIA 1: State Management (state, init, state-snapshot, summary-extract)

Usado por: health, execute-phase, discuss-phase, manager, autonomous, quick, code-review

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `state --cwd <path>` | Lê config.json + STATE.md, retorna JSON consolidado | A | `read_file(.planning/config.json)` + `read_file(.planning/STATE.md)` → parse inline | `Read` files → parse | `read` files → parse | `read_file` → parse | `read` → parse |
| `state json` | STATE.md frontmatter como JSON | A | `read_file(.planning/STATE.md)` → extrai `---` frontmatter | native | 🔄 | 🔄 | 🔄 |
| `state update <field> <value>` | Atualiza campo no STATE.md | A | `patch(.planning/STATE.md, old, new)` | `Edit` tool | `edit` tool | `replace` tool | `edit` tool |
| `state get [section]` | Lê seção do STATE.md | A | `read_file` + grep section | native | 🔄 | 🔄 | 🔄 |
| `state patch --field val` | Batch update STATE.md | A | `patch` múltiplos fields | `Edit` | `edit` | `replace` | `edit` |
| `state begin-phase --phase N` | Inicia nova fase no STATE.md | A | `patch` + `write_file` | native | 🔄 | 🔄 | 🔄 |
| `state signal-waiting` | Escreve WAITING.json signal | A | `write_file(.planning/WAITING.json, ...)` | `Write` | `edit` | `write_file` | `edit` |
| `state signal-resume` | Remove WAITING.json | A | `terminal(rm .planning/WAITING.json)` | `Bash(rm)` | `execute(rm)` | `run_shell_command(rm)` | `execute(rm)` |
| `init new-project` | Sonda estado do projeto: git, .planning/, agents, codebase map | A | `read_file` + `search_files` + `terminal(git rev-parse)` tudo inline | native (primeiro passo que todo skill faz) | 🔄 | 🔄 | 🔄 |
| `init execute-phase <N>` | Sonda estado da fase N para executor | A | `read_file(.planning/ROADMAP.md)` + `search_files(.planning/phases/N-*)` | native | 🔄 | 🔄 | 🔄 |
| `init plan-phase <N>` | Sonda estado da fase N para planner | A | idem execute-phase | native | 🔄 | 🔄 | 🔄 |
| `init phase-op <N>` | Sonda estado da fase para operações | A | idem | native | 🔄 | 🔄 | 🔄 |
| `init milestone-op` | Sonda milestone atual | A | `read_file(.planning/config.json)` → currentMilestone | native | 🔄 | 🔄 | 🔄 |
| `init manager` | Sonda estado para o manager dashboard | A | `read_file(.planning/ROADMAP.md)` + `search_files(.planning/phases/)` | native | 🔄 | 🔄 | 🔄 |
| `init quick` | Sonda estado para quick mode | A | idem init plan-phase | native | 🔄 | 🔄 | 🔄 |
| `state-snapshot` | Structured parse de STATE.md | A | parse YAML frontmatter inline | native | 🔄 | 🔄 | 🔄 |
| `summary-extract <path>` | Extrai dados estruturados de SUMMARY.md | A | `read_file` + parse frontmatter | native | 🔄 | 🔄 | 🔄 |

---

## CATEGORIA 2: Config Management (config-get, config-set, config-set-model-profile, config-new-project, config-ensure-section)

Usado por: config, health, graphify

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `config-get <key> [--default V]` | Lê valor do `.planning/config.json` | A | `read_file(.planning/config.json)` → `JSON.parse` → `cfg[key]` | `Read` + parse JSON | `read` + parse | `read_file` + parse | `read` + parse |
| `config-set <key> <value>` | Escreve valor no config.json | A | `read_file` + JSON.parse + modify + `write_file` | `Read` → `Edit` | `read` → `edit` | `read_file` → `write_file` | `read` → `edit` |
| `config-set-model-profile <name>` | Configura perfil de modelo (quality/balanced/budget) | A | `config-set workflow.model_profile` equivalente | native | 🔄 | 🔄 | 🔄 |
| `config-new-project <json>` | Cria `.planning/config.json` do zero | A | `write_file(.planning/config.json, JSON.stringify(cfg))` | `Write` | `edit` | `write_file` | `edit` |
| `config-ensure-section` | Garante que config.json tenha seções mínimas | A | `read_file` + validate + `write_file` | native | 🔄 | 🔄 | 🔄 |
| `config-path` | Retorna path do config.json | A | trivial (string conhecida) | trivial | trivial | trivial | trivial |

---

## CATEGORIA 3: Commit (commit, commit-to-subrepo)

Usado por: review-backlog, plan-phase (commit docs), execute-phase (commit após cada plan)

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `commit "<msg>" --files f1 f2` | `git add f1 f2 && git commit -m "<msg>"` | A | `terminal(git add f1 f2 && git commit -m "msg")` | `Bash(git add ... && git commit -m ...)` | `execute(git add ...)` | `run_shell_command(git ...)` | `execute(git ...)` |
| `commit-to-subrepo <msg> --files f1 f2` | Commit em sub-repo (multi-repo workspace) | A | `terminal(git -C subrepo add ... && git -C subrepo commit ...)` | `Bash` | `execute` | `run_shell_command` | `execute` |
| `check-commit` | Verifica se commit é seguro (git status) | A | `terminal(git status --porcelain)` | `Bash` | `execute` | `run_shell_command` | `execute` |

---

## CATEGORIA 4: Frontmatter (frontmatter.get, frontmatter.set, frontmatter.merge, frontmatter.validate)

Usado por: code-review, quick

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `frontmatter.get <file> [--field k]` | Extrai YAML frontmatter de .md | A | `read_file(file)` → regex `^---\n...\n---` → parse YAML | `Read` → parse | `read` → parse | `read_file` → parse | `read` → parse |
| `frontmatter.set <file> --field k --value v` | Atualiza campo no frontmatter | A | `read_file` + `patch` com old_string/new_string | `Edit` | `edit` | `replace` | `edit` |
| `frontmatter.merge <file> --data json` | Merge JSON no frontmatter existente | A | `read_file` + parse + merge + `write_file` | `Read` → `Edit` | `read` → `edit` | `read_file` → `write_file` | `read` → `edit` |
| `frontmatter.validate <file> --schema s` | Valida estrutura do frontmatter | A | parse + check required fields + check tipos | native | 🔄 | 🔄 | 🔄 |

---

## CATEGORIA 5: Roadmap & Phase (roadmap.get-phase, roadmap.analyze, phase.add, phase.next-decimal, phase complete)

Usado por: autonomous, graphify, review-backlog, plan-phase, execute-phase

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `roadmap get-phase <N> [--pick field]` | Extrai seção da fase N do ROADMAP.md | A | `read_file(.planning/ROADMAP.md)` → grep `### Phase N` → extrai bloco | `Read` → grep | `read` → grep | `read_file` → grep | `read` → grep |
| `roadmap analyze` | Full parse de ROADMAP.md + disk status | A | `read_file` + `search_files(pattern="*-PLAN.md")` → cruza info | native (Claude pode rodar gsd-tools direto) | 🔄 | 🔄 | 🔄 |
| `roadmap update-plan-progress <N>` | Atualiza tabela de progresso | A | `read_file(ROADMAP.md)` → `patch` | `Read` → `Edit` | `read` → `edit` | `read_file` → `replace` | `read` → `edit` |
| `roadmap annotate-dependencies <N>` | Adiciona wave dependency notes | A | `read_file` → `patch` + wave headers | `Read` → `Edit` | `read` → `edit` | `read_file` → `replace` | `read` → `edit` |
| `roadmap validate` | Valida convenção de phase ID | A | `read_file` → regex check | native | 🔄 | 🔄 | 🔄 |
| `roadmap upgrade --convention X` | Migra IDs de fase pra nova convenção | B | `read_file` + rewrite + `write_file` | `Read` → `Edit` | `read` → `edit` | `read_file` → `write_file` | `read` → `edit` |
| `phase add <desc> [--id ID]` | Adiciona nova fase ao roadmap | A | `read_file(ROADMAP.md)` → `patch` append | `Read` → `Edit` | `read` → `edit` | `read_file` → `write_file` | `read` → `edit` |
| `phase insert <after> <desc>` | Insere fase decimal após existente | A | `read_file` → `patch` | `Read` → `Edit` | `read` → `edit` | `read_file` → `write_file` | `read` → `edit` |
| `phase remove <N> [--force]` | Remove fase e renumera | B | script (bash) | `Bash` | `execute` | `run_shell_command` | `execute` |
| `phase complete <N>` | Marca fase done, atualiza STATE + ROADMAP | A | `read_file` → `patch` em STATE.md + ROADMAP.md | `Read` → `Edit` × 2 | `read` → `edit` × 2 | `read_file` → `write_file` × 2 | `read` → `edit` × 2 |
| `phase next-decimal <N>` | Calcula próxima fase decimal | A | parse ROADMAP → conta fases existentes → calcula | trivial | trivial | trivial | trivial |
| `phase mvp-mode <N>` | Resolve se fase é MVP mode | A | ler ROADMAP `**Mode:** mvp` + config + flag CLI | `Read` + parse | `read` + parse | `read_file` + parse | `read` + parse |
| `phase-plan-index <N>` | Indexa plans com waves e status | A | `search_files(pattern="*-PLAN.md")` + parse frontmatter | `Glob` + `Read` | `search` + `read` | `grep_search` + `read_file` | `search` + `read` |

---

## CATEGORIA 6: Validate & Audit (validate consistency, validate health, validate agents, validate context, audit-uat, audit-open)

Usado por: health, plan-phase (verification gate)

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `validate consistency` | Check phase numbering, disk/roadmap sync | A | comparar `search_files` contra `read_file(ROADMAP.md)` | native | 🔄 | 🔄 | 🔄 |
| `validate health [--repair]` | Check .planning/ integrity | A | `search_files(pattern="*")` + cross-check | native | 🔄 | 🔄 | 🔄 |
| `validate agents` | Check GSD agent installation | ❌ | N/A (Hermes usa skills, não agents) | native | native | ❌ | native |
| `validate context` | Verifica tokensUsed/contextWindow do modelo | C | ❌ (Hermes não expõe métricas de contexto) | ❌ | ❌ | ❌ | ❌ |
| `audit-uat` | Scan por UAT/verification não resolvidos | A | `search_files(pattern="UAT")` → grep por status | native | 🔄 | 🔄 | 🔄 |
| `audit-open` | Scan por artifact types não resolvidos | A | `search_files` + classify | native | 🔄 | 🔄 | 🔄 |
| `uat render-checkpoint --file <path>` | Renderiza checkpoint UAT | A | `read_file` + formata | native | 🔄 | 🔄 | 🔄 |

---

## CATEGORIA 7: Workstream (workstream create/list/set/complete/progress/status)

Usado por: workstreams (1 skill, 7 subcomandos)

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `workstream create <name>` | Cria workstream dir com state | B | `mkdir -p .planning/workstreams/<name>` + `write_file(state.json)` | `Bash(mkdir)` + `Write` | `execute(mkdir)` + `edit` | `run_shell_command` + `write_file` | `execute` + `edit` |
| `workstream list` | Lista todos workstreams | A | `search_files(pattern="**", path=".planning/workstreams/")` | `Glob` | `search` | `grep_search` | `search` |
| `workstream set <name>` | Seta workstream ativo | B | `write_file(.planning/.current-workstream, name)` | `Write` | `edit` | `write_file` | `edit` |
| `workstream complete <name>` | Marca workstream como completo | B | `read_file(state.json)` → modify → `write_file` | `Read` → `Edit` | `read` → `edit` | `read_file` → `write_file` | `read` → `edit` |
| `workstream progress <name>` | Mostra progresso do workstream | A | `read_file(state.json)` + parse | `Read` | `read` | `read_file` | `read` |
| `workstream status <name>` | Status detalhado | A | `read_file(state.json)` + format | `Read` | `read` | `read_file` | `read` |

---

## CATEGORIA 8: Graphify (graphify query/status/diff/build/snapshot)

Usado por: graphify (1 skill, 5 subcomandos, 11 referências no body)

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `graphify query <term> [--budget N]` | Query no knowledge graph | C | ❌ (sub-sistema complexo; aviso "não suportado") | native via `node gsd-tools.cjs` | ❌ | ❌ | ❌ |
| `graphify status` | Estado do knowledge graph | C | ❌ | native | ❌ | ❌ | ❌ |
| `graphify diff` | Diff do knowledge graph | C | ❌ | native | ❌ | ❌ | ❌ |
| `graphify build` | Build do knowledge graph | C | ❌ | native via `node gsd-tools.cjs graphify build` | ❌ | ❌ | ❌ |
| `graphify build snapshot` | Snapshot do conhecimento | C | ❌ | native | ❌ | ❌ | ❌ |

**Decisão arquitetural**: Graphify é um sub-sistema independente com seu próprio
engine de knowledge graph. Reimplementar em cada runtime é inviável
(work-estimate: 2-3 semanas). A skill shd-graphify deve ser marcada como
"Claude-only" ou receber um aviso no body: `⚠️ graphify requires gsd-tools.cjs —
only supported on Claude Code runtime.`

---

## CATEGORIA 9: Intel (intel query/status/update/diff/snapshot/patch-meta/validate/extract-exports/api-surface)

Usado por: health (indiretamente via context check)

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `intel query <term>` | Query nos arquivos de inteligência | B | `search_files(pattern=term, path=.planning/intel/)` → grep results | native | 🔄 | 🔄 | 🔄 |
| `intel status` | Mostra frescura dos arquivos intel | A | `terminal(find .planning/intel/ -name "*.md" -newer ...)` | `Bash` | `execute` | `run_shell_command` | `execute` |
| `intel update` | Dispara refresh de intel (retorna agent spawn hint) | B | `delegate_task(goal="refresh intel for ...")` | `Task(subagent_type=gsd-intel-updater)` | `delegate_task` | ❌ (inline) | `agent(name=gsd-intel-updater)` |

---

## CATEGORIA 10: Resolve & Progress (resolve-model, resolve-granularity, resolve-execution, progress, generate-slug, current-timestamp)

Usado por: plan-phase, execute-phase

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `resolve-model <agent-type>` | Mapeia agent type → model name baseado no profile | B | ler config.json → model_profile → lookup table | native | 🔄 | 🔄 | 🔄 |
| `resolve-granularity` | Resolve granularidade configurada | A | `read_file(.planning/config.json)` → granularity | native | 🔄 | 🔄 | 🔄 |
| `resolve-execution` | Resolve modo de execução (parallel/sequential) | A | `read_file(.planning/config.json)` → parallelization | native | 🔄 | 🔄 | 🔄 |
| `progress [json|table|bar]` | Renderiza progresso em formatos | A | `read_file(.planning/ROADMAP.md)` → contar checkboxes | `Read` → parse | `read` → parse | `read_file` → parse | `read` → parse |
| `generate-slug <text>` | Converte texto → URL-safe slug | A | `.toLowerCase().replace(/\s+/g, '-')...` | trivial | trivial | trivial | trivial |
| `current-timestamp [format]` | Timestamp formatado | A | `new Date().toISOString()` | trivial | trivial | trivial | trivial |

---

## CATEGORIA 11: Agent Skills (agent-skills, skill-manifest)

Usado por: plan-phase, execute-phase (para spawn de subagentes)

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `agent-skills <agent-type>` | Carrega SKILL.md do agente como prompt block | B | `skill_view(name="shd-<agent-type>")` (Hermes native) | `Task(subagent_type="gsd-<type>")` (native) | `delegate_task(subagent_type="gsd-<type>")` (native) | ❌ (inline via `read_file`) | `agent(name="gsd-<type>")` (native) |
| `skill-manifest` | Manifest de skills instalados | A | `search_files(pattern="SKILL.md", path="skills/")` → parse frontmatter | native | 🔄 | 🔄 | 🔄 |

---

## CATEGORIA 12: Scaffold & Templates (scaffold context/uat/verification/phase-dir, template, generate-claude-md)

Usado por: plan-phase, discuss-phase, new-project

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `scaffold context --phase N` | Cria CONTEXT.md template | A | `write_file(.planning/phases/NN-*/CONTEXT.md, template)` | `Write` | `edit` | `write_file` | `edit` |
| `scaffold uat --phase N` | Cria UAT.md template | A | `write_file` | `Write` | `edit` | `write_file` | `edit` |
| `scaffold verification --phase N` | Cria VERIFICATION.md template | A | `write_file` | `Write` | `edit` | `write_file` | `edit` |
| `scaffold phase-dir --phase N --name <name>` | Cria diretório da fase | A | `terminal(mkdir -p .planning/phases/NN-name)` | `Bash(mkdir)` | `execute(mkdir)` | `run_shell_command` | `execute(mkdir)` |
| `generate-claude-md` | Gera CLAUDE.md com GSD workflow pointers | A | `write_file(CLAUDE.md, template)` (não Claude-specific) | `Write` | `edit` | `write_file` | `edit` |

---

## CATEGORIA 13: Milestone & Requirements

Usado por: review-backlog, new-milestone

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `milestone complete <version> [--name N] [--archive-phases]` | Arquiva milestone, cria MILESTONES.md | B | `read_file(ROADMAP.md)` + `patch` + `write_file(MILESTONES.md)` + move dirs | `Bash` + `Read` + `Edit` | `execute` + `read` + `edit` | 🔄 (script shell) | 🔄 |
| `requirements mark-complete <ids>` | Marca REQ-IDs como completos | A | `read_file(REQUIREMENTS.md)` → `patch` (checkbox `[ ]` → `[x]`) | `Read` → `Edit` | `read` → `edit` | `read_file` → `replace` | `read` → `edit` |

---

## CATEGORIA 14: Misc (list-todos, verify-path-exists, verify-summary, history-digest, websearch, gap-analysis, docs-init, learnings, from-gsd2, prompt-budget, update-context, effort)

Usado por: vários (baixa frequência)

| Subcomando | Descrição | Nível | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|---|---|
| `list-todos [area]` | Conta e enumera TODOs pendentes | A | `search_files(pattern="- [ ]", path=".planning/")` | `Grep` | `search` | `grep_search` | `search` |
| `verify-path-exists <path>` | Check file/dir existence | A | `terminal(test -f/ -d <path>)` | `Bash(test)` | `execute(test)` | `run_shell_command` | `execute(test)` |
| `verify-summary <path>` | Verifica SUMMARY.md structure | A | `read_file` → parse frontmatter | `Read` | `read` | `read_file` | `read` |
| `history-digest` | Agrega todos SUMMARY.md | A | `search_files(pattern="SUMMARY.md")` → `read_file` → parse | native | 🔄 | 🔄 | 🔄 |
| `websearch <query>` | Busca web via Brave API | ⚠️ | Hermes tem `web_search` tool nativa; usa essa | `WebSearch` | `web` | ❌ (usa tool do Gemini) | `web` |
| `gap-analysis --phase-dir <path>` | Cross-check REQ-IDs + D-IDs contra plans | A | `read_file(REQUIREMENTS.md)` + `search_files(pattern="*-PLAN.md")` + cross-ref | native | 🔄 | 🔄 | 🔄 |
| `docs-init` | Inicializa documentação do projeto | A | `write_file` + mkdir estrutura docs/ | native | 🔄 | 🔄 | 🔄 |
| `learnings add/query/list` | CRUD de learnings (decisões, lições) | A | `read_file(LEARNINGS.md)` + `patch` append | `Read` → `Edit` | `read` → `edit` | `read_file` → `write_file` | `read` → `edit` |
| `from-gsd2` | Migra projeto de GSD-2 → GSD-1 | B | script de migração (raro) | `Bash` | `execute` | `run_shell_command` | `execute` |
| `prompt-budget` | Calcula budget de tokens para prompt | A | parse + count (aproximado) | native | 🔄 | 🔄 | 🔄 |
| `update-context` | Atualiza CONTEXT.md com estado atual | A | `read_file` + `patch` | `Read` → `Edit` | `read` → `edit` | `read_file` → `write_file` | `read` → `edit` |
| `effort resolve` | Resolve tier de esforço (light/standard/heavy) | A | ler config.json effort field | native | 🔄 | 🔄 | 🔄 |

---

## RESUMO ESTATÍSTICO

| Categoria | Subcomandos | Nível A | Nível B | Nível C | ❌/⚠️ |
|---|---|---|---|---|---|
| State Management | 16 | 16 | 0 | 0 | 0 |
| Config | 6 | 6 | 0 | 0 | 0 |
| Commit | 3 | 3 | 0 | 0 | 0 |
| Frontmatter | 4 | 4 | 0 | 0 | 0 |
| Roadmap & Phase | 13 | 12 | 1 | 0 | 0 |
| Validate & Audit | 7 | 6 | 0 | 0 | 1 (validate context) |
| Workstream | 6 | 2 | 4 | 0 | 0 |
| Graphify | 5 | 0 | 0 | 5 | 0 |
| Intel | 3 | 1 | 2 | 0 | 0 |
| Resolve & Progress | 5 | 5 | 0 | 0 | 0 |
| Agent Skills | 2 | 1 | 1 | 0 | 0 |
| Scaffold | 5 | 5 | 0 | 0 | 0 |
| Milestone & Reqs | 2 | 1 | 1 | 0 | 0 |
| Misc | 13 | 10 | 2 | 0 | 1 (websearch parcia) |
| **TOTAL** | **90** | **72** | **11** | **5** | **2** |

**80% dos subcomandos são Nível A** (inline no skill body, sem subagente externo).

**12% são Nível B** (wrapper script simples, sem lógica de negócio complexa).

**5.5% são Nível C** (graphify — 5 subcomandos que precisam do engine de
knowledge graph; não suportado em Hermes/Codex/Gemini/Copilot).

**2.2% são ❌/⚠️** (`validate context` depende de métricas internas do modelo;
`websearch` funciona em Hermes via `web_search` tool nativa).

## ESTRATÉGIA DE IMPLEMENTAÇÃO

### Fase 3a — Nível A (72 transformações)

Cada skill que referencia `gsd-tools <verb>` recebe uma **seção `<runtime_adapters>`**
no body do SKILL.md. Exemplo:

```markdown
<runtime_adapters>
**gsd-tools calls in this skill (horus-spec-driven native equivalents):**

| Call | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|
| `gsd-tools state --cwd .` | `read_file(.planning/config.json)` + `read_file(.planning/STATE.md)` → parse | native | `read` + parse | `read_file` + parse | `read` + parse |
| `gsd-tools commit "msg" --files a b` | `terminal(git add a b && git commit -m "msg")` | `Bash(git add a b && git commit -m "msg")` | `execute(git add a b && git commit -m "msg")` | `run_shell_command(git add a b && git commit -m "msg")` | `execute(git add a b && git commit -m "msg")` |
</runtime_adapters>
```

O content converter de cada runtime **remove as linhas que não são do seu
runtime** (ex: o Hermes converter corta colunas Claude/Codex/Gemini/Copilot,
deixando só a coluna Hermes + a descrição).

### Fase 3b — Nível B (11 wrapper scripts)

Criar `bin/gsd-adapter.js` — um CLI Node minimalista que traduz os 11
subcomandos de Nível B em chamadas de filesystem + git. Os skills chamam
`node $SPEC_HORUS_ROOT/modules/gsd-core/bin/gsd-tools.cjs equivalent <verb>`
ou, para Hermes, `terminal(node bin/gsd-adapter.js <verb> [args])`.

### Fase 3c — Nível C (5 graphify)

Marcar skill shd-graphify com aviso no body:
```markdown
<runtime_note severity="warning">
⚠️ shd-graphify requires the knowledge graph engine from gsd-tools.cjs.
Only supported on Claude Code runtime. In all other runtimes, this skill
will fail or return empty results. Consider using shd-map-codebase or
shd-stats as alternatives.
</runtime_note>
```

### Cronograma

| Fase | Subcomandos | Esforço | Dependência |
|---|---|---|---|
| 3a — Nível A inline | 72 | ~4h | content-converters existentes |
| 3b — Nível B wrapper | 11 | ~2h | gsd-adapter.js |
| 3c — Nível C graphify | 5 | ~30min | aviso no body |
| Teste integrado | — | ~2h | 3a+3b+3c |
| **Total** | **88** | **~8.5h** | |

## ARQUIVO DE IMPLEMENTAÇÃO

`bin/lib/horus-sdk-adapter/` — novo diretório no horus-spec-driven:

```
bin/lib/horus-sdk-adapter/
├── index.js          # CLI entry: node gsd-adapter.js <verb> [args]
├── state.js          # state/init/snapshot/summary-extract
├── config.js         # config-get/set/set-model-profile/new-project
├── commit.js         # commit/commit-to-subrepo/check-commit
├── frontmatter.js    # frontmatter.get/set/merge/validate
├── roadmap.js        # roadmap.get-phase/analyze + phase.*
├── validate.js       # validate consistency/health + audit-uat/open
├── workstream.js     # workstream create/list/set/complete/progress/status
├── scaffold.js       # scaffold context/uat/verification/phase-dir
├── milestone.js      # milestone complete + requirements mark-complete
├── misc.js           # list-todos, verify-path-exists, history-digest, etc.
└── adapter-map.json  # JSON registry: verb → module + function mapping
```

## TESTE DE VALIDAÇÃO

Para cada runtime, após o adapter ser aplicado:

1. Instalar horus-spec-driven: `node bin/install.js install --runtime=<rt> --global`
2. Pegar um skill que referencia gsd-tools (ex: `shd-health`)
3. Verificar que:
   - Zero referências a `gsd-tools` no body (substituídas por equivalentes
     nativos OU aviso de não-suporte)
   - `<runtime_adapters>` tem a coluna correta pro runtime
   - O skill pode ser executado sem dependência externa
4. Testar num projeto real: criar `.planning/`, rodar `shd-health`, verificar
   que a validação funciona (lê arquivos, produz output)
