#!/usr/bin/env node
'use strict';

/**
 * horus-sdk-codex — Codex-native reimplementation of gsd-tools.cjs
 *
 * CLI entry. Usage:
 *   node gsd-adapter.js <verb> [args] --cwd <project-path>
 *
 * Verbs are the SAME as gsd-tools.cjs (no `query` wrapper, direct positional).
 * This adapter reads/writes .planning/ files using the filesystem directly,
 * with zero dependency on gsd-core or any npm package.
 *
 * Runtime: OpenAI Codex CLI (uses read_file, write_file, terminal via the
 * agent's toolset). When the agent invokes this adapter, it does so via
 * terminal() — the adapter reads stdin for commands or is called as a
 * subprocess.
 *
 * Output: JSON to stdout (--raw flag preserves single-field output).
 */

const path = require('path');
const state = require('./state.cjs');
const config = require('./config.cjs');
const commit = require('./commit.cjs');
const frontmatter = require('./frontmatter.cjs');
const roadmap = require('./roadmap.cjs');
const validate = require('./validate.cjs');
const workstream = require('./workstream.cjs');
const scaffold = require('./scaffold.cjs');
const milestone = require('./milestone.cjs');
const misc = require('./misc.cjs');
const resolve = require('./resolve.cjs');
const graphify = require('./graphify.cjs');

function parseArgs(argv) {
  const args = argv.slice(2);
  const cwdIdx = args.indexOf('--cwd');
  const cwd = cwdIdx !== -1 ? args[cwdIdx + 1] : process.cwd();
  const raw = args.includes('--raw');
  const stripped = args.filter((a, i) => a !== '--cwd' && (cwdIdx === -1 || i !== cwdIdx + 1) && a !== '--raw');
  return { verb: stripped[0], args: stripped.slice(1), cwd, raw };
}

function output(data, raw) {
  if (raw && typeof data === 'object' && data !== null && !Array.isArray(data)) {
    // --raw: emit first value only
    const v = Object.values(data)[0];
    process.stdout.write(String(v ?? ''));
  } else if (raw && typeof data === 'string') {
    process.stdout.write(data);
  } else {
    process.stdout.write(JSON.stringify(data));
  }
}

function main() {
  const { verb, args, cwd, raw } = parseArgs(process.argv);

  try {
    switch (verb) {
      case 'state': return output(state.handle(args, cwd, raw), raw);
      case 'init': return output(state.handleInit(args, cwd, raw), raw);
      case 'state-snapshot': return output(state.cmdStateSnapshot(cwd, raw), raw);
      case 'summary-extract': return output(state.cmdSummaryExtract(args[0], cwd, raw), raw);
      case 'history-digest': return output(state.cmdHistoryDigest(cwd, raw), raw);

      case 'config-get': return output(config.get(args[0], args.includes('--default') ? args[args.indexOf('--default') + 1] : undefined, cwd, raw), raw);
      case 'config-set': return output(config.set(args[0], args[1], cwd, raw), raw);
      case 'config-set-model-profile': return output(config.setModelProfile(args[0], cwd, raw), raw);
      case 'config-new-project': return output(config.newProject(args[0], cwd, raw), raw);
      case 'config-ensure-section': return output(config.ensureSection(cwd, raw), raw);
      case 'config-path': return output(config.path(cwd, raw), raw);

      case 'commit': return output(commit.handle(args, cwd, raw), raw);
      case 'commit-to-subrepo': return output(commit.subrepo(args, cwd, raw), raw);
      case 'check-commit': return output(commit.check(cwd, raw), raw);

      case 'frontmatter.get': return output(frontmatter.get(args[0], args.includes('--field') ? args[args.indexOf('--field') + 1] : null, cwd, raw), raw);
      case 'frontmatter.set': return output(frontmatter.set(args[0], args.includes('--field') ? args[args.indexOf('--field') + 1] : null, args.includes('--value') ? args[args.indexOf('--value') + 1] : null, cwd, raw), raw);
      case 'frontmatter.merge': return output(frontmatter.merge(args[0], args.includes('--data') ? args[args.indexOf('--data') + 1] : null, cwd, raw), raw);
      case 'frontmatter.validate': return output(frontmatter.validate(args[0], args.includes('--schema') ? args[args.indexOf('--schema') + 1] : null, cwd, raw), raw);

      case 'roadmap': return output(roadmap.handle(args, cwd, raw), raw);
      case 'phase': return output(roadmap.handlePhase(args, cwd, raw), raw);
      case 'phase-plan-index': return output(roadmap.phasePlanIndex(args[0], cwd, raw), raw);
      case 'phase.mvp-mode': return output(roadmap.phaseMvpMode(args[0], cwd, raw), raw);

      case 'validate': return output(validate.handle(args, cwd, raw), raw);
      case 'audit-uat': return output(validate.auditUat(cwd, raw), raw);
      case 'audit-open': return output(validate.auditOpen(cwd, raw), raw);

      case 'workstream': return output(workstream.handle(args, cwd, raw), raw);
      case 'scaffold': return output(scaffold.handle(args, cwd, raw), raw);
      case 'milestone': return output(milestone.handle(args, cwd, raw), raw);
      case 'requirements': return output(milestone.requirements(args, cwd, raw), raw);

      case 'resolve-model': return output(resolve.model(args[0], cwd, raw), raw);
      case 'resolve-granularity': return output(resolve.granularity(cwd, raw), raw);
      case 'resolve-execution': return output(resolve.execution(cwd, raw), raw);
      case 'progress': return output(resolve.progress(args[0] || 'json', cwd, raw), raw);

      case 'list-todos': return output(misc.listTodos(args[0], cwd, raw), raw);
      case 'verify-path-exists': return output(misc.pathExists(args[0], cwd, raw), raw);
      case 'verify-summary': return output(misc.verifySummary(args[0], cwd, raw), raw);
      case 'generate-slug': return output(misc.generateSlug(args[0], raw), raw);
      case 'current-timestamp': return output(misc.currentTimestamp(args[0], raw), raw);
      case 'websearch': return output(misc.websearch(args[0], raw), raw);
      case 'gap-analysis': return output(misc.gapAnalysis(args[0], cwd, raw), raw);
      case 'learnings': return output(misc.learnings(args, cwd, raw), raw);
      case 'prompt-budget': return output(misc.promptBudget(args[0], raw), raw);
      case 'update-context': return output(misc.updateContext(args[0], cwd, raw), raw);

      case 'graphify':
        return output(graphifyHandler(args, cwd, raw), raw);

      case 'agent-skills':
        return output(agentSkillsHandler(args[0], cwd, raw), raw);

      case 'skill-manifest':
        return output(skillManifestHandler(cwd, raw), raw);

      default:
        process.stderr.write(`Unknown verb: ${verb}\n`);
        process.exit(1);
    }
  } catch (e) {
    process.stderr.write(`ERROR: ${e.message}\n`);
    process.exit(1);
  }
}

// ─── graphify handler (Codex-native knowledge graph) ───────────────────

function graphifyHandler(args, cwd, raw) {
  const sub = args[0];
  if (sub === 'query') {
    const term = args[1];
    if (!term) return { error: 'Usage: graphify query <term>' };
    const budgetIdx = args.indexOf('--budget');
    const budget = budgetIdx !== -1 ? parseInt(args[budgetIdx + 1], 10) : null;
    return graphify.graphifyQuery(cwd, term, budget);
  }
  if (sub === 'status') return graphify.graphifyStatus(cwd);
  if (sub === 'diff') return graphify.graphifyDiff(cwd);
  if (sub === 'build') {
    if (args[1] === 'snapshot') return graphify.writeSnapshot(cwd);
    return graphify.graphifyBuild(cwd);
  }
  return { error: `Unknown graphify subcommand: ${sub}. Available: build, query, status, diff` };
}

// ─── agent-skills handler (skill_view bridge) ───────────────────────────

function agentSkillsHandler(agentType, cwd, raw) {
  const codexHome = process.env.CODEX_HOME || path.join(require('os').homedir(), '.codex');
  const agentsDir = path.join(codexHome, 'agents');
  const skillsDir = path.join(codexHome, 'skills');
  const candidates = [
    path.join(agentsDir, agentType + '.md'),
    path.join(agentsDir, agentType + '.toml'),
    path.join(skillsDir, agentType, 'SKILL.md'),
    path.join(skillsDir, agentType + '.md'),
  ];
  const file = candidates.find((p) => fs.existsSync(p)) || null;

  if (!file) {
    const available = [];
    if (fs.existsSync(agentsDir)) {
      available.push(...fs.readdirSync(agentsDir).filter((f) => /\.(md|toml)$/.test(f)).map((f) => f.replace(/\.(md|toml)$/, '')));
    }
    if (fs.existsSync(skillsDir)) {
      available.push(...fs.readdirSync(skillsDir).filter((f) => !f.startsWith('.')).slice(0, 50));
    }
    return {
      error: `Codex agent/skill not found: ${agentType}`,
      codex_instruction: `Reference ~/.codex/agents/${agentType}.md or ~/.codex/skills/${agentType}/SKILL.md in the Codex prompt.`,
      available: Array.from(new Set(available)).slice(0, 40),
    };
  }

  const content = safeRead(file);
  const fm = content ? (content.match(/^---\r?\n([\s\S]*?)\r?\n---/) || [])[1] : '';
  const description = fm ? (fm.match(/^description:\s*(.+)$/m) || [])[1] || '' : '';
  return {
    agent_type: agentType,
    description: (description || '').replace(/^["']|["']$/g, ''),
    path: file,
    codex_instruction: `Codex can read this file directly. Include it in the prompt or reference the path explicitly.`,
    content_preview: content ? content.slice(0, 800) : null,
  };
}

// ─── skill-manifest handler ─────────────────────────────────────────────

function skillManifestHandler(cwd, raw) {
  const codexHome = process.env.CODEX_HOME || path.join(require('os').homedir(), '.codex');
  const skillsDir = path.join(codexHome, 'skills');
  if (!fs.existsSync(skillsDir)) return { skills: [], count: 0, skills_dir: skillsDir };
  const skills = [];
  for (const dir of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (dir.name.startsWith('.')) continue;
    let file = null;
    if (dir.isDirectory()) {
      const skillMd = path.join(skillsDir, dir.name, 'SKILL.md');
      if (fs.existsSync(skillMd)) file = skillMd;
    } else if (dir.isFile() && dir.name.endsWith('.md')) {
      file = path.join(skillsDir, dir.name);
    }
    if (!file) continue;
    const content = safeRead(file);
    const fm = content ? (content.match(/^---\r?\n([\s\S]*?)\r?\n---/) || [])[1] : '';
    const name = fm ? (fm.match(/^name:\s*(.+)$/m) || [])[1] || dir.name.replace(/\.md$/, '') : dir.name.replace(/\.md$/, '');
    const desc = fm ? (fm.match(/^description:\s*(.+)$/m) || [])[1] || '' : '';
    skills.push({ name: name.replace(/^["']|["']$/g, ''), dir: dir.name, description: desc.replace(/^["']|["']$/g, ''), path: file });
  }
  return { skills, count: skills.length, skills_dir: skillsDir };
}

// ─── helpers ────────────────────────────────────────────────────────────

function safeRead(p) { try { return require('fs').readFileSync(p, 'utf8'); } catch (_) { return null; } }

const fs = require('fs');

main();
