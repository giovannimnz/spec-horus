# Content Converters — Spec-Horus

Cada runtime tem um **content converter** que adapta o corpo do SKILL.md
para o formato nativo que o loader do runtime espera.

## Lista de converters

| Runtime | Arquivo | Função | Descrição |
|---|---|---|---|
| Hermes | `hermes.js` | `convertHermesMarkdown` | CLAUDE.md→HERMES.md, .claude/→.hermes/, gsd:→gsd-, horus-sdk-hermes injection |
| Claude | `claude.js` | `convertClaudeMarkdown` | Colon→hyphen, vendor paths neutralized, subagent neutralization |
| Codex | `codex.js` | `convertCodexMarkdown` | $ARGUMENTS→{{GSD_ARGS}}, /clear removal, .claude→.codex, .claudeignore→.codexignore, horus-sdk-codex block |
| Copilot | `copilot.js` | `convertCopilotContent` | Tool name mapping (Read→read, etc.), gsd:→gsd-, AGENTS.md→copilot-instructions.md |
| Gemini | `gemini.js` | `convertGeminiMarkdown` | .claude→.gemini, CLAUDE.md→GEMINI.md, gsd:→gsd- |

## Hermes converter (detalhado)

Ordem de transformação:
1. Branding: `CLAUDE.md` → `HERMES.md`, `Claude Code` → `Hermes Agent`
2. Vendor paths: `~/.claude/gsd-core/workflows/` → `~/.hermes/skills/gsd/`
3. Runtime paths: `~/.claude/` → `~/.hermes/`
4. Colon→hyphen: `/gsd:foo` → `/gsd-foo`
5. Subagent neutralization: `Agent(subagent_type=gsd-X)` → neutral form
6. **horus-sdk-hermes injection**: se o skill referencia `gsd-tools` ou `shd-tools`, injeta `<horus_sdk_adapter>` explicando como usar o adapter Hermes-native

## Codex converter (detalhado)

Ordem:
1. Branding: CLAUDE.md→AGENTS.md, Claude Code→Codex CLI
2. Slash→skill mentions: `/gsd:foo` → `~/.codex/skills/gsd-foo/SKILL.md`
3. Template vars: `$ARGUMENTS` → `{{GSD_ARGS}}`
4. `/clear` removal (Codex não tem este comando)
5. Vendor paths: `~/.claude/gsd-core/workflows/` → `~/.codex/skills/`
6. Runtime paths: `~/.claude/` → `~/.codex/`
7. `.claudeignore` → `.codexignore`
8. Prompts Codex gerados pelo builder recebem `<horus_sdk_adapter runtime="codex">` com o comando `node ~/.codex/skills/horus-sdk-codex/index.cjs <verb> [args] --cwd .`

## Copilot converter (detalhado)

Ordem:
1. Branding: CLAUDE.md→copilot-instructions.md, Claude Code→GitHub Copilot
2. Vendor paths: `~/.claude/gsd-core/` → `.github/skills/`
3. Runtime paths (global vs local): local uses `.github/`, global uses `~/.copilot/`
4. Colon→hyphen: `gsd:foo` → `gsd-foo`
5. Tool name mapping (in backticks only): `Read`→`read`, `Write`→`edit`, etc.

## Subagent neutralization (aplicado a todos)

Antes de cada content converter, o `subagent-adapter` aplica:
- `Agent(prompt=..., subagent_type="gsd-X")` → `<subagent name="gsd-X" goal="..." tools="..." />`
- `<available_agent_types>...</available_agent_types>` → `<available_skills>...</available_skills>`
- `subagent_type: gsd-X` (YAML) → `@agents/gsd-X.md#gsd-X`
