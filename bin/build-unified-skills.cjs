#!/usr/bin/env node
'use strict';

/**
 * build-unified-skills.cjs v4.1 — 4 SKILL.md + auto-detection + agentes + compressão
 *
 * /hsd-pm: se não tiver .planning/, faz map-codebase → new-project automaticamente
 * /hsd-config: compressão de fala (lite/full/ultra) + subagentes (cavecrew)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WORDLIST_PATH = path.join(ROOT, 'modules', 'unified-wordlist.json');
const OUT_DIR = path.join(ROOT, 'unified-skills');
const CONFIG_PATH = path.join(ROOT, 'horus-spec-driven.json');
const LOCALES_DIR = path.join(ROOT, 'locales');

const wordlist = JSON.parse(fs.readFileSync(WORDLIST_PATH, 'utf8'));

function getLocale() {
  const ci = process.argv.indexOf('--locale');
  if (ci !== -1 && process.argv[ci + 1]) return process.argv[ci + 1];
  try {
    const c = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    return (c.locale && c.locale.code) || 'en';
  } catch (e) { return 'en'; }
}

const localeCode = getLocale();
let localeData;
try {
  localeData = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, localeCode + '.json'), 'utf8'));
} catch (e) {
  localeData = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en.json'), 'utf8'));
}

const pt = localeCode === 'pt';
const T = pt ? {
  mapsFrom: 'Mapeia de',
  subcommands: 'Subcomandos',
  role: 'Função',
  autoDetect: 'Detecção Automática',
  noProject: 'Se não houver .planning/ no diretório atual, este comando automaticamente:',
  noProject1: '1. Executa map-codebase para mapear o código existente',
  noProject2: '2. Cria a estrutura .planning/ com ROADMAP.md, REQUIREMENTS.md, STATE.md',
  noProject3: '3. Inicia o milestone inicial e a primeira fase',
  noProject4: '4. Prossegue com o subcomando solicitado',
  compression: 'Compressão de Fala',
  compressionDesc: 'Define o estilo de compressão da fala do agente (caveman mode)',
  compressionLite: 'Lite — redução leve, mantém fluidez',
  compressionFull: 'Full — compressão padrão, ~75% de redução',
  compressionUltra: 'Ultra — compressão máxima, estilo telegráfico',
  currentCompression: 'Compressão atual',
  agents: 'Subagentes (Cavecrew)',
  agentsDesc: 'Ativa/desativa subagentes comprimidos para delegar tarefas',
  agentsInvestigator: 'cavecrew-investigator — localiza código (output comprimido)',
  agentsBuilder: 'cavecrew-builder — edita 1-2 arquivos (output comprimido)',
  agentsReviewer: 'cavecrew-reviewer — revisa diffs (output comprimido)',
  agentsEnabled: 'Subagentes ativos',
  usage: 'Uso',
  quickExample: 'Exemplo Rápido',
  runtimeNotes: 'Notas de Runtime',
  langNote: 'Este skill usa o **horus-sdk-adapter** para operações internas.',
  language: 'Idioma',
} : {
  mapsFrom: 'Maps from',
  subcommands: 'Subcommands',
  role: 'Role',
  autoDetect: 'Auto-Detection',
  noProject: 'If no .planning/ exists in the current directory, this command automatically:',
  noProject1: '1. Runs map-codebase to scan existing code',
  noProject2: '2. Creates .planning/ structure with ROADMAP.md, REQUIREMENTS.md, STATE.md',
  noProject3: '3. Initializes the first milestone and phase',
  noProject4: '4. Proceeds with the requested subcommand',
  compression: 'Speech Compression',
  compressionDesc: 'Sets the agent speech compression style (caveman mode)',
  compressionLite: 'Lite — light reduction, keeps fluency',
  compressionFull: 'Full — default compression, ~75% reduction',
  compressionUltra: 'Ultra — maximum compression, telegraphic style',
  currentCompression: 'Current compression',
  agents: 'Subagents (Cavecrew)',
  agentsDesc: 'Enable/disable compressed subagents for task delegation',
  agentsInvestigator: 'cavecrew-investigator — locate code (compressed output)',
  agentsBuilder: 'cavecrew-builder — edit 1-2 files (compressed output)',
  agentsReviewer: 'cavecrew-reviewer — review diffs (compressed output)',
  agentsEnabled: 'Active subagents',
  usage: 'Usage',
  quickExample: 'Quick Example',
  runtimeNotes: 'Runtime Notes',
  langNote: 'This skill uses **horus-sdk-adapter** for internal operations.',
  language: 'Language',
};

const ROLE_ICONS = { dev: '⚡', pm: '📋', qa: '✅' };

const SUBS = {
  dev: [
    { cmd: 'discover', maps: 'explore, spike, sketch, capture, ns-ideate, map-codebase, ns-context',
      desc: pt ? 'Descoberta e mapeamento — explorar, prototipar, pesquisar' : 'Discovery & mapping — explore, prototype, research' },
    { cmd: 'define', maps: 'discuss-phase, spec-phase, mvp-phase',
      desc: pt ? 'Definir escopo, contexto e requisitos' : 'Define scope, context, and requirements' },
    { cmd: 'plan', maps: 'plan-phase, ultraplan-phase, ai-integration-phase',
      desc: pt ? 'Criar planos detalhados de fase' : 'Create detailed phase plans' },
    { cmd: 'build', maps: 'execute-phase, autonomous, quick, fast',
      desc: pt ? 'Executar planos e construir features' : 'Execute plans and build features' },
    { cmd: 'debug', maps: 'debug, forensics',
      desc: pt ? 'Debug sistemático e análise forense' : 'Systematic debugging and forensics' },
    { cmd: 'maintain', maps: 'docs-update, extract-learnings, ingest-docs, import, cleanup',
      desc: pt ? 'Documentação, aprendizados, limpeza e importação' : 'Documentation, learnings, cleanup, and import' },
    { cmd: 'ui', maps: 'ui-phase, ui-review',
      desc: pt ? 'Contratos de design UI e revisão visual' : 'UI design contracts and visual review' },
  ],
  pm: [
    { cmd: 'new', maps: 'new-project, new-milestone',
      desc: pt ? 'Criar novo projeto ou milestone' : 'Create new project or milestone' },
    { cmd: 'track', maps: 'progress, workstreams, thread, phase, workspace, graphify, stats, ns-project, ns-workflow, ns-manage',
      desc: pt ? 'Acompanhar progresso, workstreams e métricas' : 'Track progress, workstreams, and metrics' },
    { cmd: 'ship', maps: 'ship, pr-branch, complete-milestone, milestone-summary, undo, update',
      desc: pt ? 'Entregar, fazer deploy, completar milestones' : 'Release, deploy, complete milestones' },
    { cmd: 'config', maps: 'config, settings, profile-user',
      desc: pt ? 'Configurar modelos, ajustes e perfis' : 'Configure models, settings, and profiles' },
    { cmd: 'manage', maps: 'manager, surface, pause-work, resume-work, help, inbox',
      desc: pt ? 'Dashboard, pausar/retomar, triar backlog' : 'Dashboard, pause/resume, triage inbox' },
  ],
  qa: [
    { cmd: 'validate', maps: 'validate-phase, verify-work, health, add-tests',
      desc: pt ? 'Validar fases, verificar implementações, health checks' : 'Validate phases, verify implementations, health checks' },
    { cmd: 'audit', maps: 'audit-fix, audit-milestone, audit-uat',
      desc: pt ? 'Auditar milestones, lacunas de UAT e correções' : 'Audit milestones, UAT gaps, and fixes' },
    { cmd: 'review', maps: 'code-review, eval-review, review, review-backlog, plan-review-convergence, ns-review, secure-phase',
      desc: pt ? 'Code review, peer review, security review' : 'Code review, peer review, security review' },
  ],
};

const ROLE_NAMES = {
  dev: pt ? 'Desenvolvedor' : 'Developer',
  pm: pt ? 'Gerente de Projeto' : 'Project Manager',
  qa: pt ? 'Qualidade' : 'QA',
};

const ROLE_DESCS = {
  dev: pt ? 'Descobrir, definir, planejar, construir, depurar, manter, UI — o ciclo completo de dev' : 'Discover, define, plan, build, debug, maintain, ui — the full dev cycle',
  pm: pt ? 'Criar projetos, acompanhar progresso, entregar releases, gerenciar configuração' : 'New projects, track progress, ship releases, manage config',
  qa: pt ? 'Validar, auditar, revisar — qualidade em cada etapa' : 'Validate, audit, review — quality at every stage',
};

// ── Agents per role ──────────────────────────────────────────────────────────

const ROLE_AGENTS = {
  dev: {
    name: pt ? 'hsd-dev — Agente Desenvolvedor' : 'hsd-dev — Developer Agent',
    desc: pt ? 'Especializado em descoberta, definição, planejamento e construção de software. Usa explore, spike, sketch, plan-phase e execute-phase como ferramentas principais.' : 'Specialized in discovery, definition, planning, and building software. Uses explore, spike, sketch, plan-phase, and execute-phase as primary tools.',
    tools: ['read_file', 'write_file', 'terminal', 'search_files', 'delegate_task'],
  },
  pm: {
    name: pt ? 'hsd-pm — Agente Gerente de Projeto' : 'hsd-pm — Project Manager Agent',
    desc: pt ? 'Especializado em criação de projetos, acompanhamento de progresso, releases e configuração. Usa new-project, progress, graphify e ship como ferramentas principais.' : 'Specialized in project creation, progress tracking, releases, and configuration. Uses new-project, progress, graphify, and ship as primary tools.',
    tools: ['read_file', 'write_file', 'terminal', 'search_files', 'delegate_task'],
  },
  qa: {
    name: pt ? 'hsd-qa — Agente de Qualidade' : 'hsd-qa — QA Agent',
    desc: pt ? 'Especializado em validação, auditoria e revisão de código e fases. Usa validate-phase, audit-fix, code-review e secure-phase como ferramentas principais.' : 'Specialized in validation, audit, and code/phase review. Uses validate-phase, audit-fix, code-review, and secure-phase as primary tools.',
    tools: ['read_file', 'write_file', 'terminal', 'search_files', 'delegate_task'],
  },
};

// ── Build role skill ─────────────────────────────────────────────────────────

function buildRoleSkill(role) {
  const subs = SUBS[role] || [];
  const sc = subs.map(function(s) { return '"' + s.cmd + '"'; }).join(', ');
  const example = subs.length > 0 ? `/${role === 'dev' ? 'hsd-dev' : role === 'pm' ? 'hsd-pm' : 'hsd-qa'} ${subs[0].cmd}` : '';

  let subTable = '';
  for (const s of subs) {
    subTable += `| \`${s.cmd}\` | ${s.maps} | ${s.desc} |\n`;
  }

  // PM auto-detection block
  const autoBlock = role === 'pm' ? `
## ${T.autoDetect}

${T.noProject}
${T.noProject1}
${T.noProject2}
${T.noProject3}
${T.noProject4}

> ${pt ? 'Isso garante que o projeto sempre tenha contexto antes de qualquer operação.' : 'This ensures the project always has context before any operation.'}

` : '';

  // Agent block
  const agent = ROLE_AGENTS[role];
  const agentBlock = `
## ${pt ? 'Agente' : 'Agent'}

**${agent.name}**

${agent.desc}

${pt ? '**Ferramentas:**' : '**Tools:**'} ${agent.tools.join(', ')}

${pt ? 'Este agente é ativado automaticamente ao usar' : 'This agent is activated automatically when using'} \`/hsd-${role}\`.

`;

  return `---
name: hsd-${role}
description: "${ROLE_ICONS[role]} ${ROLE_NAMES[role]}: ${ROLE_DESCS[role]}"
version: "4.1.0"
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

# ${ROLE_ICONS[role]} hsd-${role}

**${T.role}:** ${ROLE_NAMES[role]}
**${T.subcommands}:** ${subs.length}

> ${ROLE_DESCS[role]}

---

${autoBlock}
---

## ${T.quickExample}

\`\`\`
/${example}
\`\`\`

---

## ${T.subcommands}

| Subcommand | ${T.mapsFrom} | ${pt ? 'Descrição' : 'Description'} |
|---|---|---|
${subTable}

${agentBlock}
---

## ${T.usage}

\`\`\`
/hsd-${role} <subcommand> [args]
\`\`\`
\`$ARGUMENTS[0]\` ${pt ? 'seleciona o subcomando' : 'selects the subcommand'}.

---

## ${T.runtimeNotes}

<horus_sdk_adapter runtime="hermes">
${T.langNote}

\`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .\`
</horus_sdk_adapter>

---

*Horus Spec Driven v4.1 — ${localeData.locale.name}*
`;
}

// ── Build config skill ────────────────────────────────────────────────────

function buildConfigSkill() {
  const compLevels = [
    { val: 'lite', label: pt ? 'Lite' : 'Lite', desc: T.compressionLite },
    { val: 'full', label: pt ? 'Full' : 'Full', desc: T.compressionFull },
    { val: 'ultra', label: pt ? 'Ultra' : 'Ultra', desc: T.compressionUltra },
  ];

  let compTable = '';
  for (const l of compLevels) {
    compTable += `| \`${l.val}\` | ${l.label} | ${l.desc} |\n`;
  }

  const agents = [
    { val: 'investigator', label: 'cavecrew-investigator', desc: T.agentsInvestigator },
    { val: 'builder', label: 'cavecrew-builder', desc: T.agentsBuilder },
    { val: 'reviewer', label: 'cavecrew-reviewer', desc: T.agentsReviewer },
  ];

  let agentTable = '';
  for (const a of agents) {
    agentTable += `| \`${a.val}\` | ${a.label} | ${a.desc} |\n`;
  }

  return `---
name: hsd-config
description: "⚙️ ${pt ? 'Configuração do HSD' : 'HSD Configuration'} — ${pt ? 'idioma, compressão e subagentes' : 'language, compression, and subagents'}"
version: "4.1.0"
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

# ⚙️ hsd-config

---

## ${T.language}

\`\`\`
/hsd-config language pt     → ${pt ? 'Português' : 'Portuguese'}
/hsd-config language en     → English
\`\`\`

**${T.language}:** ${localeData.locale.name} (${localeCode})

---

## ${T.compression}

${T.compressionDesc}

| Nível | ${pt ? 'Nome' : 'Name'} | ${pt ? 'Descrição' : 'Description'} |
|---|---|---|
${compTable}

\`\`\`
/hsd-config compression lite
/hsd-config compression full
/hsd-config compression ultra
\`\`\`

**${T.currentCompression}:** \`full\` (${pt ? 'padrão' : 'default'})

---

## ${T.agents}

${T.agentsDesc}

| Atalho | ${pt ? 'Agente' : 'Agent'} | ${pt ? 'Descrição' : 'Description'} |
|---|---|---|
${agentTable}

\`\`\`
/hsd-config agents investigator   → ${pt ? 'Ativar investigator' : 'Enable investigator'}
/hsd-config agents builder        → ${pt ? 'Ativar builder' : 'Enable builder'}
/hsd-config agents reviewer       → ${pt ? 'Ativar reviewer' : 'Enable reviewer'}
/hsd-config agents off            → ${pt ? 'Desativar todos' : 'Disable all'}
\`\`\`

---

*Horus Spec Driven v4.1 — ${localeData.locale.name}*
`;
}

// ── Build agent files ───────────────────────────────────────────────────────

function buildAgentMd(role) {
  const agent = ROLE_AGENTS[role];
  return `---
name: hsd-${role}-agent
type: agent
role: ${role}
version: "4.1.0"
author: "Horus Spec Driven"
tools:
${agent.tools.map(function(t) { return '  - ' + t; }).join('\n')}
---

# ${agent.name}

${agent.desc}

## ${pt ? 'Comandos Associados' : 'Associated Commands'}

Este agente é usado automaticamente por \`/hsd-${role}\`.

| Subcomando | ${pt ? 'Descrição' : 'Description'} |
|---|---|
${SUBS[role].map(function(s) { return '| `' + s.cmd + '` | ' + s.desc + ' |'; }).join('\n')}

## ${pt ? 'Comportamento' : 'Behavior'}

${pt ? 'Ao ser invocado via' : 'When invoked via'} \`/hsd-${role}\`, ${pt ? 'este agente:' : 'this agent:'}

1. ${pt ? 'Lê o contexto do projeto' : 'Reads the project context'} (${pt ? 'se existir' : 'if exists'}: \`.planning/CONTEXT.md\`)
2. ${pt ? 'Executa o subcomando solicitado' : 'Executes the requested subcommand'} (\`$ARGUMENTS[0]\`)
3. ${pt ? 'Reporta o resultado' : 'Reports the result'}

*Horus Spec Driven v4.1*
`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let total = 0;

for (const role of ['dev', 'pm', 'qa']) {
  const d = path.join(OUT_DIR, 'hsd-' + role);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'SKILL.md'), buildRoleSkill(role), 'utf8');
  total++;

  // Agent file
  const ad = path.join(OUT_DIR, 'hsd-' + role + '-agent');
  if (!fs.existsSync(ad)) fs.mkdirSync(ad, { recursive: true });
  fs.writeFileSync(path.join(ad, 'SKILL.md'), buildAgentMd(role), 'utf8');
}

const cd = path.join(OUT_DIR, 'hsd-config');
if (!fs.existsSync(cd)) fs.mkdirSync(cd, { recursive: true });
fs.writeFileSync(path.join(cd, 'SKILL.md'), buildConfigSkill(), 'utf8');
total += 2; // config + 3 agents already counted

console.log('Generated ' + total + ' files (locale: ' + localeData.locale.name + ') → ' + OUT_DIR + '/');
console.log('  3 role skills + 3 agent skills + 1 config');
