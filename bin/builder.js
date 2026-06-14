#!/usr/bin/env node
'use strict';

/**
 * bin/builder.js v5.0 — Build dist/<runtime>/ for all 5 platforms
 *
 * Reads from modules/gsd-core (upstream submodule), applies:
 *   1. Rebrand (wordlist: gsd-X → hsd-{role})
 *   2. Content converters (per runtime)
 *   3. Frontmatter converters (per runtime)
 *   4. Subagent adapter
 *
 * Outputs to dist/<runtime>/:
 *   skills/   — runtime-native skill files
 *   agents/   — agent definition files
 *   adapter/  — horus-sdk-<runtime> (Hermes and Codex)
 *   install.sh — runtime-specific installer
 *   README.md — runtime-specific documentation
 *
 * Usage:
 *   node bin/builder.js --all              Build all 5 runtimes
 *   node bin/builder.js --runtime=hermes   Build one runtime
 *   node bin/builder.js --runtime=gemini   Build Gemini only
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MODULES_GS = path.join(ROOT, 'modules', 'gsd-core');
const DIST = path.join(ROOT, 'dist');
const WORDLIST_PATH = path.join(ROOT, 'modules', 'unified-wordlist.json');
const CONFIG_PATH = path.join(ROOT, 'horus-spec-driven.json');
const LOCALES_DIR = path.join(ROOT, 'locales');
const ADAPTER_SOURCES = {
  hermes: path.join(ROOT, 'bin', 'lib', 'horus-sdk-hermes'),
  codex: path.join(ROOT, 'bin', 'lib', 'horus-sdk-codex'),
};

// ─── Load config ───────────────────────────────────────────────────────────

let localeCode = 'en';
try { const c = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); localeCode = c.locale?.code || 'en'; } catch (_) {}
let localeData;
try { localeData = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, localeCode + '.json'), 'utf8')); } catch (_) {
  localeData = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en.json'), 'utf8'));
}
const pt = localeCode === 'pt';
let wordlist;
try { wordlist = JSON.parse(fs.readFileSync(WORDLIST_PATH, 'utf8')); } catch (_) {
  console.error('Wordlist not found. Run: node bin/rebrand.js modules/unified-wordlist.json');
  process.exit(1);
}

// ─── Content converters ────────────────────────────────────────────────────

const { convertHermesMarkdown } = require('./lib/content-converters/hermes.js');
const { convertClaudeMarkdown } = require('./lib/content-converters/claude.js');
const { convertCodexMarkdown } = require('./lib/content-converters/codex.js');
const { convertGeminiMarkdown } = require('./lib/content-converters/gemini.js');
const { convertCopilotContent } = require('./lib/content-converters/copilot.js');

// ─── Role definitions ──────────────────────────────────────────────────────

const ROLES = {
  dev: { icon: '⚡', name: pt ? 'Desenvolvedor' : 'Developer', desc: pt ? 'Ciclo completo de desenvolvimento' : 'Full dev cycle' },
  pm:  { icon: '📋', name: pt ? 'Gerente de Projeto' : 'Project Manager', desc: pt ? 'Gestão de projetos e releases' : 'Project & release management' },
  qa:  { icon: '✅', name: 'QA', desc: pt ? 'Validação, auditoria e revisão' : 'Validation, audit & review' },
};

const SUBS = {
  dev: [
    { cmd: 'discover', maps: 'explore, spike, sketch, capture, ns-ideate, map-codebase, ns-context', fn: 'discovery' },
    { cmd: 'define', maps: 'discuss-phase, spec-phase, mvp-phase', fn: 'scope' },
    { cmd: 'plan', maps: 'plan-phase, ultraplan-phase, ai-integration-phase', fn: 'planning' },
    { cmd: 'build', maps: 'execute-phase, autonomous, quick, fast', fn: 'execution' },
    { cmd: 'debug', maps: 'debug, forensics', fn: 'debugging' },
    { cmd: 'maintain', maps: 'docs-update, extract-learnings, ingest-docs, import, cleanup', fn: 'maintenance' },
    { cmd: 'ui', maps: 'ui-phase, ui-review', fn: 'design' },
  ],
  pm: [
    { cmd: 'new', maps: 'new-project, new-milestone', fn: 'creation' },
    { cmd: 'track', maps: 'progress, workstreams, thread, phase, workspace, graphify, stats, ns-project, ns-workflow, ns-manage', fn: 'tracking' },
    { cmd: 'ship', maps: 'ship, pr-branch, complete-milestone, milestone-summary, undo, update', fn: 'release' },
    { cmd: 'config', maps: 'config, settings, profile-user', fn: 'configuration' },
    { cmd: 'manage', maps: 'manager, surface, pause-work, resume-work, help, inbox', fn: 'management' },
  ],
  qa: [
    { cmd: 'validate', maps: 'validate-phase, verify-work, health, add-tests', fn: 'validation' },
    { cmd: 'audit', maps: 'audit-fix, audit-milestone, audit-uat', fn: 'audit' },
    { cmd: 'review', maps: 'code-review, eval-review, review, review-backlog, plan-review-convergence, ns-review, secure-phase', fn: 'review' },
  ],
};

// ─── Unified SKILL.md (Hermes/Claude — 4 files with $ARGUMENTS[0] routing) ──

function buildUnifiedSkill(role) {
  const subs = SUBS[role];
  const sc = subs.map(s => `"${s.cmd}"`).join(', ');
  const example = `/${role === 'pm' ? 'hsd-pm' : role === 'dev' ? 'hsd-dev' : 'hsd-qa'} ${subs[0].cmd}`;

  let subTable = '';
  for (const s of subs) subTable += `| \`${s.cmd}\` | ${s.maps} | ${pt ? 'Agrupa operações de' : 'Groups'} ${s.fn} |\n`;

  const autoBlock = role === 'pm' ? `\n## ${pt ? '🚀 Detecção Automática' : '🚀 Auto-Detection'}\n\n${pt ? 'Se não houver .planning/ no diretório atual, este comando automaticamente:' : 'If no .planning/ exists in the current directory, this command automatically:'}\n1. ${pt ? 'Executa map-codebase para mapear o código existente' : 'Runs map-codebase to scan existing code'}\n2. ${pt ? 'Cria a estrutura .planning/ completa' : 'Creates the full .planning/ structure'}\n3. ${pt ? 'Inicia o primeiro milestone e fase' : 'Initializes the first milestone and phase'}\n4. ${pt ? 'Prossegue com o subcomando solicitado' : 'Proceeds with the requested subcommand'}\n` : '';

  const roleName = ROLES[role].name;

  return `---
name: hsd-${role}
description: "${ROLES[role].icon} ${roleName}: ${ROLES[role].desc}"
version: "5.0.0"
author: "Horus Spec Driven"
license: "MIT"
locale: "${localeCode}"
platforms:
  - hermes
  - claude-code
  - codex
  - gemini
  - copilot
metadata:
  hermes:
    tags: ["hsd", "${role}", "${localeCode}"]
    category: "${role}"
    agent: "hsd-${role}-agent"
    subcommands: [${sc}]
---

# ${ROLES[role].icon} /hsd-${role}

**${pt ? 'Papel' : 'Role'}:** ${roleName}  |  **${pt ? 'Subcomandos' : 'Subcommands'}:** ${subs.length}

> ${ROLES[role].desc}
${autoBlock}
---

## ${pt ? 'Exemplo Rápido' : 'Quick Example'}

\`\`\`
/${example}
\`\`\`

---

## ${pt ? 'Subcomandos' : 'Subcommands'}

| Subcommand | ${pt ? 'Mapeia de (gsd-core)' : 'Maps from (gsd-core)'} | ${pt ? 'Função' : 'Function'} |
|---|---|---|
${subTable}

---

## ${pt ? 'Agente Especializado' : 'Specialized Agent'}

${pt ? 'Este comando ativa automaticamente o agente' : 'This command automatically activates the'} \`hsd-${role}-agent\`.

${pt ? '**Ferramentas:**' : '**Tools:**'} read_file, write_file, terminal, search_files, delegate_task

---

## ${pt ? 'Uso' : 'Usage'}

\`\`\`
/hsd-${role} <subcommand> [args]
\`\`\`

\`$ARGUMENTS[0]\` ${pt ? 'seleciona o subcomando.' : 'selects the subcommand.'}

---

<horus_sdk_adapter runtime="hermes">
${pt ? '**horus-sdk-hermes** gerencia todas as operações internas.' : '**horus-sdk-hermes** handles all internal operations.'}
\`node ~/.hermes/skills/hsd/horus-sdk-hermes/index.cjs <verb> [args] --cwd .\`
</horus_sdk_adapter>

---

*Horus Spec Driven v5.0 — dist/${role === 'pm' ? 'pm' : role === 'dev' ? 'dev' : 'qa'}*
`;
}

// ─── Flat skill (Codex/Gemini/Copilot — 1 file per subcommand) ────────────

function buildFlatSkill(role, sub, runtime) {
  const roleName = ROLES[role].name;
  const unifiedName = `hsd-${role}-${sub.cmd}`;
  const mapsList = sub.maps.split(', ').slice(0, 4).join(', ');

  // Gemini: TOML format
  if (runtime === 'gemini') {
    return `name = "${unifiedName}"
description = "${ROLES[role].icon} ${roleName}: ${sub.cmd} — ${pt ? sub.maps : 'groups ' + sub.maps.split(', ').length + ' commands'}"
version = "5.0.0"
author = "Horus Spec Driven"
license = "MIT"
locale = "${localeCode}"
agent = "hsd-${role}-agent"

[metadata.hermes]
tags = ["hsd", "${role}", "${unifiedName}"]
category = "${role}"

# ${ROLES[role].icon} ${unifiedName}

**${pt ? 'Papel' : 'Role'}:** ${roleName}  |  **${pt ? 'Subcomando' : 'Subcommand'}:** ${sub.cmd}

> ${pt ? 'Mapeia de (gsd-core):' : 'Maps from (gsd-core):'} ${mapsList}...

${pt ? '**Uso:**' : '**Usage:**'} \`/${unifiedName} [args]\`

---

*Horus Spec Driven v5.0 — dist/gemini*
`;
  }

  // Codex/Copilot: markdown
  const adapterBlock = runtime === 'codex' ? `
---

<horus_sdk_adapter runtime="codex">
${pt ? '**horus-sdk-codex** gerencia operações GSD/HSD internas no Codex.' : '**horus-sdk-codex** handles internal GSD/HSD operations in Codex.'}
\`node ~/.codex/skills/horus-sdk-codex/index.cjs <verb> [args] --cwd .\`

${pt ? 'Use este SDK antes de improvisar chamadas ao gsd-tools.cjs, Hermes ou Claude.' : 'Use this SDK before improvising gsd-tools.cjs, Hermes, or Claude calls.'}
</horus_sdk_adapter>

---` : '---';

  return `---
name: ${unifiedName}
description: "${ROLES[role].icon} ${roleName}: ${sub.cmd}"
version: "5.0.0"
author: "Horus Spec Driven"
license: "MIT"
locale: "${localeCode}"
agent: "hsd-${role}-agent"
---

# ${ROLES[role].icon} ${unifiedName}

**${pt ? 'Papel' : 'Role'}:** ${roleName}
**${pt ? 'Subcomando' : 'Subcommand'}:** ${sub.cmd}

${pt ? 'Mapeia de (gsd-core):' : 'Maps from (gsd-core):'} ${mapsList}...

---

## ${pt ? 'Uso' : 'Usage'}

\`\`\`
/${unifiedName} [args]
\`\`\`

${adapterBlock}

*Horus Spec Driven v5.0 — dist/${runtime}*
`;
}

// ─── Agent definition ──────────────────────────────────────────────────────

function buildAgentMd(role, runtime) {
  const subs = SUBS[role];
  const agentTools = ['read_file', 'write_file', 'terminal', 'search_files', 'delegate_task'];
  const roleName = ROLES[role].name;

  let subTable = '';
  for (const s of subs) subTable += `| \`${s.cmd}\` | ${s.maps.split(', ').slice(0, 3).join(', ')}... |\n`;

  const body = `---
name: hsd-${role}-agent
type: agent
role: "${role}"
version: "5.0.0"
author: "Horus Spec Driven"
tools:
${agentTools.map(t => '  - ' + t).join('\n')}
---

# hsd-${role}-agent — ${roleName}

${pt ? 'Agente especializado para o papel de' : 'Specialized agent for the'} **${roleName}** (${ROLES[role].desc}).

## ${pt ? 'Comandos Associados' : 'Associated Commands'}

| Subcomando | ${pt ? 'Mapeia de' : 'Maps from'} |
|---|---|
${subTable}

## ${pt ? 'Comportamento' : 'Behavior'}

${pt ? 'Ao ser invocado pelo comando correspondente, este agente:' : 'When invoked by the corresponding command, this agent:'}
1. ${pt ? 'Lê o contexto do projeto' : 'Reads project context'} (.planning/)
2. ${pt ? 'Executa o subcomando solicitado' : 'Executes the requested subcommand'}
3. ${pt ? 'Reporta o resultado' : 'Reports the result'}

*Horus Spec Driven v5.0 — dist/${runtime}*
`;

  if (runtime === 'gemini') return body.replace(/^---\n/, '').replace(/\n---\n/, '\n'); // TOML-like
  return body;
}

// ─── Config skill (Hermes/Claude) ──────────────────────────────────────────

function buildConfigSkill() {
  return `---
name: hsd-config
description: "⚙️ ${pt ? 'Configuração do HSD — idioma, compressão, subagentes' : 'HSD Config — language, compression, subagents'}"
version: "5.0.0"
author: "Horus Spec Driven"
license: "MIT"
locale: "${localeCode}"
platforms:
  - hermes
metadata:
  hermes:
    tags: ["hsd", "config", "${localeCode}"]
    category: "config"
---

# ⚙️ /hsd-config

## ${pt ? 'Idioma' : 'Language'}

\`\`\`
/hsd-config language pt      → ${pt ? 'Português' : 'Portuguese'}
/hsd-config language en      → English
\`\`\`

**${pt ? 'Atual' : 'Current'}:** ${localeData.locale.name} (${localeCode})

---

## ${pt ? 'Compressão de Fala' : 'Speech Compression'}

| ${pt ? 'Nível' : 'Level'} | ${pt ? 'Nome' : 'Name'} | ${pt ? 'Descrição' : 'Description'} |
|---|---|---|
| \`lite\` | Lite | ${pt ? 'Redução leve, mantém fluidez' : 'Light reduction, keeps fluency'} |
| \`full\` | Full | ${pt ? 'Compressão padrão, ~75% de redução' : 'Default compression, ~75% reduction'} |
| \`ultra\` | Ultra | ${pt ? 'Compressão máxima, estilo telegráfico' : 'Maximum compression, telegraphic style'} |

\`\`\`
/hsd-config compression lite
/hsd-config compression full
/hsd-config compression ultra
\`\`\`

---

## ${pt ? 'Subagentes (Cavecrew)' : 'Subagents (Cavecrew)'}

| ${pt ? 'Atalho' : 'Shortcut'} | ${pt ? 'Agente' : 'Agent'} | ${pt ? 'Função' : 'Function'} |
|---|---|---|
| \`investigator\` | cavecrew-investigator | ${pt ? 'Localiza código (output comprimido)' : 'Locate code (compressed output)'} |
| \`builder\` | cavecrew-builder | ${pt ? 'Edita 1-2 arquivos (output comprimido)' : 'Edit 1-2 files (compressed output)'} |
| \`reviewer\` | cavecrew-reviewer | ${pt ? 'Revisa diffs (output comprimido)' : 'Review diffs (compressed output)'} |

\`\`\`
/hsd-config agents investigator
/hsd-config agents builder
/hsd-config agents reviewer
/hsd-config agents off
\`\`\`

---

*Horus Spec Driven v5.0 — dist/hermes*
`;
}

// ─── Runtime install scripts ───────────────────────────────────────────────

function buildInstallScript(runtime) {
  const hermesHome = '${HERMES_HOME:-$HOME/.hermes}';
  const claudeHome = '${CLAUDE_CONFIG_DIR:-$HOME/.claude}';
  const codexHome = '${CODEX_HOME:-$HOME/.codex}';
  const geminiHome = '${GEMINI_CONFIG_DIR:-$HOME/.gemini}';
  const copilotDir = '${PWD}/.github';
  const scriptDir = 'SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"';

  const scripts = {
    hermes: `#!/usr/bin/env bash
# Horus Spec Driven — Hermes Agent Installer v5.0
set -euo pipefail
${scriptDir}
HD=${hermesHome}/skills/hsd
AD=${hermesHome}/agents
echo "Installing HSD v5.0 for Hermes Agent..."
mkdir -p "$HD" "$AD" "$HD/horus-sdk-hermes"
cp -r "$SCRIPT_DIR"/skills/hsd/* "$HD/"
cp "$SCRIPT_DIR"/agents/*.md "$AD/" 2>/dev/null || true
cp -r "$SCRIPT_DIR"/adapter/* "$HD/horus-sdk-hermes/" 2>/dev/null || true
echo "✓ $(find "$HD" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l) skills + agents installed"
echo "  Restart Hermes or run /reload_skills"
`,
    claude: `#!/usr/bin/env bash
# Horus Spec Driven — Claude Code Installer v5.0
set -euo pipefail
${scriptDir}
SD=${claudeHome}/skills
AD=${claudeHome}/agents
echo "Installing HSD v5.0 for Claude Code..."
mkdir -p "$SD" "$AD"
cp -r "$SCRIPT_DIR"/skills/hsd/* "$SD/"
cp "$SCRIPT_DIR"/agents/*.md "$AD/" 2>/dev/null || true
echo "✓ $(find "$SCRIPT_DIR"/skills/hsd -mindepth 1 -maxdepth 1 -type d | wc -l) skills installed"
`,
    codex: `#!/usr/bin/env bash
# Horus Spec Driven — Codex CLI Installer v5.0
set -euo pipefail
${scriptDir}
PD=${codexHome}/prompts
AD=${codexHome}/agents
SD=${codexHome}/skills/horus-sdk-codex
echo "Installing HSD v5.0 for Codex CLI..."
mkdir -p "$PD" "$AD" "$SD"
cp "$SCRIPT_DIR"/prompts/*.md "$PD/"
cp "$SCRIPT_DIR"/agents/*.md "$AD/" 2>/dev/null || true
cp -r "$SCRIPT_DIR"/adapter/* "$SD/"
echo "✓ $(ls "$SCRIPT_DIR"/prompts/ | wc -l) prompts + $(ls "$SCRIPT_DIR"/agents/ | wc -l) agents + horus-sdk-codex installed"
`,
    gemini: `#!/usr/bin/env bash
# Horus Spec Driven — Gemini CLI Installer v5.0
set -euo pipefail
${scriptDir}
CD=${geminiHome}/commands/hsd
AD=${geminiHome}/agents
echo "Installing HSD v5.0 for Gemini CLI..."
mkdir -p "$CD" "$AD"
cp "$SCRIPT_DIR"/commands/hsd/*.toml "$CD/"
cp "$SCRIPT_DIR"/agents/*.toml "$AD/" 2>/dev/null || true
echo "✓ $(ls "$SCRIPT_DIR"/commands/hsd/ | wc -l) commands installed"
`,
    copilot: `#!/usr/bin/env bash
# Horus Spec Driven — GitHub Copilot Installer v5.0
set -euo pipefail
${scriptDir}
PD=${copilotDir}/prompts
AD=${copilotDir}/agents
echo "Installing HSD v5.0 for GitHub Copilot..."
mkdir -p "$PD" "$AD"
cp "$SCRIPT_DIR"/prompts/*.md "$PD/"
cp "$SCRIPT_DIR"/agents/*.md "$AD/" 2>/dev/null || true
echo "✓ $(ls "$SCRIPT_DIR"/prompts/ | wc -l) prompts installed"
`,
  };
  return scripts[runtime] || scripts.hermes;
}

// ─── Runtime README ────────────────────────────────────────────────────────

function buildRuntimeReadme(runtime) {
  const rt = {
    hermes: { name: 'Hermes Agent', dest: '~/.hermes/skills/hsd/', format: 'SKILL.md (nested)', count: '4', cmds: '/hsd-pm, /hsd-dev, /hsd-qa, /hsd-config' },
    claude: { name: 'Claude Code', dest: '~/.claude/skills/', format: 'SKILL.md (nested dirs under skills/hsd/)', count: '4', cmds: '/hsd-pm, /hsd-dev, /hsd-qa, /hsd-config' },
    codex: { name: 'OpenAI Codex', dest: '~/.codex/prompts/ + ~/.codex/skills/horus-sdk-codex/', format: 'prompt.md + horus-sdk-codex', count: '15', cmds: 'hsd-pm-new ... hsd-qa-review' },
    gemini: { name: 'Google Gemini CLI', dest: '~/.gemini/commands/hsd/', format: '.toml', count: '15', cmds: '/hsd-pm:new ... /hsd-qa:review' },
    copilot: { name: 'GitHub Copilot', dest: '.github/prompts/', format: 'prompt.md', count: '15', cmds: 'hsd-pm-new ... hsd-qa-review' },
  }[runtime] || { name: runtime, dest: '—', format: '—', count: '0', cmds: '' };

  const extraNotes = runtime === 'hermes'
    ? `\n## Adapter\n\nhorus-sdk-hermes incluído — 31 verbos, graphifyy.py (Python code-aware scanning).\n\n\`node ~/.hermes/skills/hsd/horus-sdk-hermes/index.cjs <verb> [args] --cwd .\``
    : runtime === 'codex'
      ? `\n## Adapter\n\nhorus-sdk-codex incluído — SDK Codex-native para operações GSD/HSD com .planning/.\n\n\`node ~/.codex/skills/horus-sdk-codex/index.cjs <verb> [args] --cwd .\``
      : '';

  return `# Horus Spec Driven — ${rt.name}

**Package:** dist/${runtime}/
**Version:** 5.0.0
**Commands:** ${rt.count} (${rt.cmds})
**Format:** ${rt.format}
**Install to:** ${rt.dest}

## Slash Commands

| Comando | Subcomandos |
|---|---|
| \`/hsd-pm\` | new, track, ship, config, manage |
| \`/hsd-dev\` | discover, define, plan, build, debug, maintain, ui |
| \`/hsd-qa\` | validate, audit, review |
| \`/hsd-config\` | language, compression, agents |

## Agentes

| Agente | Ferramentas |
|---|---|
| hsd-pm-agent | read, write, terminal, search, delegate |
| hsd-dev-agent | read, write, terminal, search, delegate |
| hsd-qa-agent | read, write, terminal, search, delegate |
${extraNotes}
## Install

\`\`\`bash
chmod +x dist/${runtime}/install.sh
./dist/${runtime}/install.sh
\`\`\`

---

*Horus Spec Driven v5.0 — ${rt.name}*
`;
}

// ─── MAIN BUILD ────────────────────────────────────────────────────────────

function dir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function buildRuntime(runtime) {
  const distDir = path.join(DIST, runtime);
  dir(distDir);

  // ── Skills ─────────────────────────────────────────────────────────────
  if (runtime === 'hermes' || runtime === 'claude') {
    // 4 unified skills with $ARGUMENTS[0] routing
    const skillsDir = path.join(distDir, 'skills', 'hsd');
    dir(skillsDir);
    for (const role of ['pm', 'dev', 'qa']) {
      const skillDir = path.join(skillsDir, 'hsd-' + role);
      dir(skillDir);
      let content = buildUnifiedSkill(role);
      // Apply runtime-specific content converter
      if (runtime === 'hermes') content = convertHermesMarkdown(content, []);
      else content = convertClaudeMarkdown(content, []);
      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content, 'utf8');
    }
    // Config skill
    const cfgDir = path.join(skillsDir, 'hsd-config');
    dir(cfgDir);
    fs.writeFileSync(path.join(cfgDir, 'SKILL.md'), buildConfigSkill(), 'utf8');
  } else {
    // Flat skills: 1 file per subcommand
    let skillsDir;
    if (runtime === 'gemini') {
      skillsDir = path.join(distDir, 'commands', 'hsd');
      dir(skillsDir);
    } else {
      skillsDir = path.join(distDir, 'prompts');
      dir(skillsDir);
    }
    for (const role of ['pm', 'dev', 'qa']) {
      for (const sub of SUBS[role]) {
        const ext = runtime === 'gemini' ? '.toml' : '.md';
        const filename = `hsd-${role}-${sub.cmd}${ext}`;
        let content = buildFlatSkill(role, sub, runtime);
        if (runtime === 'codex') content = convertCodexMarkdown(content, []);
        else if (runtime === 'copilot') content = convertCopilotContent(content, []);
        else if (runtime === 'gemini') content = convertGeminiMarkdown(content, []);
        fs.writeFileSync(path.join(skillsDir, filename), content, 'utf8');
      }
    }
  }

  // ── Agents ─────────────────────────────────────────────────────────────
  const agentsDir = path.join(distDir, 'agents');
  dir(agentsDir);
  for (const role of ['pm', 'dev', 'qa']) {
    const ext = runtime === 'gemini' ? '.toml' : '.md';
    fs.writeFileSync(path.join(agentsDir, `hsd-${role}-agent${ext}`), buildAgentMd(role, runtime), 'utf8');
  }

  // ── Runtime SDK adapter ────────────────────────────────────────────────
  const adapterSrc = ADAPTER_SOURCES[runtime];
  if (adapterSrc && fs.existsSync(adapterSrc)) {
    const adapterDir = path.join(distDir, 'adapter');
    fs.cpSync(adapterSrc, adapterDir, { recursive: true });
  }

  // ── Install script ─────────────────────────────────────────────────────
  const installSh = path.join(distDir, 'install.sh');
  fs.writeFileSync(installSh, buildInstallScript(runtime), 'utf8');
  fs.chmodSync(installSh, 0o755);

  // ── README ─────────────────────────────────────────────────────────────
  fs.writeFileSync(path.join(distDir, 'README.md'), buildRuntimeReadme(runtime), 'utf8');
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const runtimes = [];

for (const a of args) {
  if (a === '--all') { runtimes.push('hermes', 'claude', 'codex', 'gemini', 'copilot'); break; }
  else if (a.startsWith('--runtime=')) runtimes.push(a.split('=')[1]);
}

if (runtimes.length === 0) runtimes.push('hermes', 'claude', 'codex', 'gemini', 'copilot');

console.log(`Horus Spec Driven v5.0 — Builder`);
console.log(`Locale: ${localeData.locale.name} (${localeCode})\n`);

let total = 0;
for (const rt of runtimes) {
  console.log(`Building dist/${rt}/ ...`);
  buildRuntime(rt);
  const count = countFiles(path.join(DIST, rt));
  console.log(`  ✓ ${count} files — dist/${rt}/`);
  total += count;
}

console.log(`\nDone. ${total} files across ${runtimes.length} runtime(s).`);
console.log(`dist/ ready for install.`);

function countFiles(dir) {
  let n = 0;
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(d, entry.name));
      else n++;
    }
  }
  if (fs.existsSync(dir)) walk(dir);
  return n;
}
