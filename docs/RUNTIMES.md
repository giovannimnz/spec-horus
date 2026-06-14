# Runtimes — Paths e Formato

Matriz de onde Spec-Horus instala, em qual formato, pra cada CLI.

## Sumário

| Runtime | Global | Local | Skills dir | Commands dir | Agents dir | Skill format | Command format | Agent format |
|---|---|---|---|---|---|---|---|---|
| **Hermes Agent** | `~/.hermes/` | — | `skills/` | (via skills) | `agents/` | `SKILL.md` | — | `<name>.md` |
| **Claude Code** | `~/.claude/` | `./.claude/` | `skills/<name>/` | `commands/` | `agents/` | `SKILL.md` | `<name>.md` | `<name>.md` |
| **Codex CLI** | `~/.codex/` | `./.codex/` | `skills/horus-sdk-codex/` | `prompts/` | `agents/` | SDK `SKILL.md` | `<name>.md` | `<name>.md` |
| **Gemini CLI** | `~/.gemini/` | `./.gemini/` | `skills/<name>/` | `commands/` | — | `SKILL.md` | `<name>.toml` (TBD) | — |
| **GitHub Copilot** | — | `./.github/` | — | `prompts/` | `agents/` | — | `<name>.prompt.md` | `<name>.agent.md` |

## Detalhes por runtime

### Hermes Agent

```yaml
home:    ~/.hermes (env HERMES_HOME)
local:   não suportado
detection: test -f ~/.hermes/config.yaml
invocation: /<name> em TUI; skill_view(name=...) em CLI; invoke_skill(name=...) programaticamente
```

**Skills**: `<home>/skills/<name>/SKILL.md` — frontmatter YAML + body
markdown. Spec-Horus cria `<name>` como nome do comando (ex:
`shd-new-project`).

**Agents**: `<home>/agents/<name>.md` — frontmatter YAML + body markdown.
Spec-Horus copia direto do upstream `gsd-core/agents/`.

**Sem commands/ separado**: Hermes usa skills pra tudo que envolve
invocação por slash. O install converte commands/*.md em
skills/<name>/SKILL.md.

### Claude Code

```yaml
home:    ~/.claude (env CLAUDE_CONFIG_DIR)
local:   ./.claude (relativo ao projeto)
detection: test -d ~/.claude || test -d ./.claude
invocation: /<name> em CLI
```

**Skills**: `<base>/skills/<name>/SKILL.md` — frontmatter + body.

**Commands**: `<base>/commands/<name>.md` — slash command. O
frontmatter `name:` ou o filename dita o nome do comando.

**Agents**: `<base>/agents/<name>.md` — frontmatter + body.

### Codex CLI

```yaml
home:    ~/.codex (env CODEX_HOME)
local:   ./.codex
detection: test -d ~/.codex || test -d ./.codex
invocation: /<name> em CLI
```

**Prompts**: `<base>/prompts/<name>.md` — slash command. AGENTS.md no
project root é o project instructions file.

**Agents**: `<base>/agents/<name>.md` — agent definitions. O Codex usa
TOML pra agents, mas o upstream gsd-core gera `.md`. Spec-Horus copia
como `.md` por enquanto e warns sobre conversão manual.

**Skills/SDK**: Spec-Horus instala `horus-sdk-codex` em `<base>/skills/horus-sdk-codex/`. Os comandos de usuário continuam em `<base>/prompts/<name>.md`; o SDK é a camada operacional para ler/escrever `.planning/` via Node.

### Gemini CLI

```yaml
home:    ~/.gemini (env GEMINI_CONFIG_DIR)
local:   ./.gemini
detection: test -d ~/.gemini || test -d ./.gemini
invocation: /<name> em CLI
```

**Commands**: `<base>/commands/<name>.toml` — **TOML, não markdown**.
Schema Gemini:

```toml
[command]
name = "shd-new-project"
description = "Inicia novo projeto"
prompt = """
# O comando real vai aqui. Pode referenciar ${args} ou texto do usuário.
"""
```

**Skills**: `<base>/skills/<name>/SKILL.md` — frontmatter + body
markdown.

**Agents**: Gemini não tem diretório `agents/` convencional. Subagents
são configurados via flag `--agents` ou extension manifests. Spec-Horus
**não instala agents no Gemini** (avisamos no install).

**TBD**: TOML converter pra Gemini. Roadmap em
[`ARCHITECTURE.md`](../ARCHITECTURE.md).

### GitHub Copilot

```yaml
home:    não tem
local:   ./.github (relativo ao projeto)
detection: test -d ./.github
invocation: /<name> no chat do Copilot (VS Code)
```

**Prompts**: `./.github/prompts/<name>.prompt.md` — frontmatter YAML +
body markdown. **Extensão `.prompt.md`, não `.md`**.

**Agents**: `./.github/agents/<name>.agent.md` — agent definitions.
**Extensão `.agent.md`**.

**Skills**: Copilot não tem convention `skills/`. Spec-Horus converte
commands/*.md em prompts/<name>.prompt.md.

**Sempre local**: Copilot não tem global home. Install é sempre
`--local`.

## Mapeamento Spec-Horus → Runtime

| Spec-Horus artifact | Hermes | Claude | Codex | Gemini | Copilot |
|---|---|---|---|---|---|
| `commands/gsd-foo.md` | `skills/shd-foo/SKILL.md` | `commands/shd-foo.md` | `prompts/shd-foo.md` | `commands/shd-foo.toml` ⚠ | `prompts/shd-foo.prompt.md` |
| `agents/gsd-bar.md` | `agents/gsd-bar.md` | `agents/gsd-bar.md` | `agents/gsd-bar.md` ⚠ | (skip) | `agents/gsd-bar.agent.md` |
| `bin/lib/horus-sdk-codex/` | — | — | `skills/horus-sdk-codex/` | — | — |

⚠ = requer conversão manual no momento. Roadmap: TOML converter.

## WSL e paths

Em WSL, `os.homedir()` retorna path Linux (`/home/ubuntu`) se você roda
Node dentro do WSL. Se você roda Node Windows-native mas arquivos
acessíveis via WSL, paths podem misturar. Mitigation:

```bash
# Use as env vars que cada runtime respeita
export HERMES_HOME=/home/ubuntu/.hermes
export CLAUDE_CONFIG_DIR=/home/ubuntu/.claude
export CODEX_HOME=/home/ubuntu/.codex
export GEMINI_CONFIG_DIR=/home/ubuntu/.gemini
```

Ou flags equivalentes:

```bash
node bin/install.js install --hermes-config=/home/ubuntu/.hermes --all
```

## Adicionando um novo runtime

1. Criar `runtimes/<id>.json` com os campos acima
2. Adicionar entry em `bin/lib/runtime-paths.js` (`RUNTIMES` object)
3. Adicionar detecção em `bin/lib/cli-detect.js` (se aplicável)
4. Documentar nesta página
5. Testar com `node bin/install.js install --runtime=<id> --dry-run`

Exemplo: adicionar Kilo (suportado pelo gsd-core upstream):

```js
// bin/lib/runtime-paths.js
kilo: {
  id: 'kilo',
  label: 'Kilo Code',
  home: () => resolveEnvOrHome('KILO_CONFIG_DIR', '~/.kilo'),
  local: () => '.kilo',
  skills: () => 'skills',
  agents: () => 'agents',
  commands: () => 'commands',
  format: 'skill',
  detect: () => fs.existsSync(resolveEnvOrHome('KILO_CONFIG_DIR', '~/.kilo')),
  env: 'KILO_CONFIG_DIR',
},
```

```json
// runtimes/kilo.json
{
  "id": "kilo",
  "label": "Kilo Code",
  "home": "~/.kilo",
  "homeEnv": "KILO_CONFIG_DIR",
  "local": ".kilo",
  "skills": "skills",
  "agents": "agents",
  "commands": "commands",
  "skillFormat": "SKILL.md",
  "agentFormat": "{name}.md",
  "commandFormat": "{name}.md",
  "installModes": ["global", "local"],
  "notes": "Kilo Code is an open-source Claude Code alternative."
}
```
