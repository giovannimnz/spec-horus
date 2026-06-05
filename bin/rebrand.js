#!/usr/bin/env node
'use strict';

/**
 * rebrand.js v4.0 — Compact 3-role wordlist for Horus Spec Driven
 *
 * 67 upstream gsd-core commands → 3 roles (dev, pm, qa) + config
 * Each role has subcommands routed by $ARGUMENTS[0] in the SKILL.md
 *
 * Roles:
 *   DEV  (Developer): discover, define, plan, build, debug, maintain, ui
 *   PM   (Project Manager): new, track, ship, config, manage
 *   QA   (Quality): validate, audit, review
 *
 * Output: JSON wordlist gsd-X → hsd-{role}
 */

const fs = require('fs');
const path = require('path');

const UNIFIED_MAP = {
  // ── DEV: Developer (discovery + analysis + implementation + ui + backend) ──
  'explore':                'hsd-dev',
  'spike':                  'hsd-dev',
  'sketch':                 'hsd-dev',
  'capture':                'hsd-dev',
  'ns-ideate':              'hsd-dev',
  'map-codebase':           'hsd-dev',
  'ns-context':             'hsd-dev',
  'discuss-phase':          'hsd-dev',
  'spec-phase':             'hsd-dev',
  'mvp-phase':              'hsd-dev',
  'plan-phase':             'hsd-dev',
  'ultraplan-phase':        'hsd-dev',
  'ai-integration-phase':   'hsd-dev',
  'execute-phase':          'hsd-dev',
  'autonomous':             'hsd-dev',
  'quick':                  'hsd-dev',
  'fast':                   'hsd-dev',
  'debug':                  'hsd-dev',
  'forensics':              'hsd-dev',
  'docs-update':            'hsd-dev',
  'extract-learnings':      'hsd-dev',
  'ingest-docs':            'hsd-dev',
  'import':                 'hsd-dev',
  'cleanup':                'hsd-dev',
  'ui-phase':               'hsd-dev',
  'ui-review':              'hsd-dev',

  // ── PM: Project Manager ──
  'new-project':            'hsd-pm',
  'new-milestone':          'hsd-pm',
  'progress':               'hsd-pm',
  'workstreams':            'hsd-pm',
  'thread':                 'hsd-pm',
  'phase':                  'hsd-pm',
  'workspace':              'hsd-pm',
  'stats':                  'hsd-pm',
  'graphify':               'hsd-pm',
  'ns-project':             'hsd-pm',
  'ns-workflow':            'hsd-pm',
  'ns-manage':              'hsd-pm',
  'config':                 'hsd-pm',
  'settings':               'hsd-pm',
  'profile-user':           'hsd-pm',
  'ship':                   'hsd-pm',
  'pr-branch':              'hsd-pm',
  'complete-milestone':     'hsd-pm',
  'milestone-summary':      'hsd-pm',
  'undo':                   'hsd-pm',
  'update':                 'hsd-pm',
  'manager':                'hsd-pm',
  'surface':                'hsd-pm',
  'pause-work':             'hsd-pm',
  'resume-work':            'hsd-pm',
  'help':                   'hsd-pm',
  'inbox':                  'hsd-pm',

  // ── QA: Quality Assurance ──
  'validate-phase':         'hsd-qa',
  'verify-work':            'hsd-qa',
  'health':                 'hsd-qa',
  'add-tests':              'hsd-qa',
  'audit-fix':              'hsd-qa',
  'audit-milestone':        'hsd-qa',
  'audit-uat':              'hsd-qa',
  'code-review':            'hsd-qa',
  'eval-review':            'hsd-qa',
  'review':                 'hsd-qa',
  'review-backlog':         'hsd-qa',
  'plan-review-convergence': 'hsd-qa',
  'ns-review':              'hsd-qa',
  'secure-phase':           'hsd-qa',
};

const AGENT_REMAP = {
  'gsd-executor':           'hsd-dev',
  'gsd-planner':            'hsd-dev',
  'gsd-researcher':         'hsd-dev',
  'gsd-plan-checker':       'hsd-qa',
  'gsd-phase-researcher':   'hsd-dev',
  'gsd-pattern-mapper':     'hsd-dev',
  'gsd-auditor':            'hsd-qa',
  'gsd-debugger':           'hsd-dev',
};

function buildWordlist(vendorCommandsDir) {
  const wordlist = new Map();
  for (const [oldName, newName] of Object.entries(UNIFIED_MAP)) {
    wordlist.set(`gsd-${oldName}`, newName);
    wordlist.set(`gsd:${oldName}`, newName);
  }
  for (const [oldAgent, newAgent] of Object.entries(AGENT_REMAP)) {
    wordlist.set(oldAgent, newAgent);
  }
  if (vendorCommandsDir && fs.existsSync(vendorCommandsDir)) {
    for (const file of fs.readdirSync(vendorCommandsDir)) {
      const name = file.replace(/\.md$/, '');
      // FILTER: strip commands with levels beyond ultra (wenyan-*, extreme-*, etc.)
      const STRIP_PATTERNS = /wenyan|extreme|maximum|insane|godmode/i;
      if (STRIP_PATTERNS.test(name)) continue;
      if (!UNIFIED_MAP[name]) wordlist.set(`gsd-${name}`, 'hsd-pm');
    }
  }
  const historical = [
    ['gsd-core', 'hsd-core'],
    ['gsd-sdk', 'hsd-sdk'],
    ['gsd-tools', 'hsd-tools'],
    ['gsd-sdk-adapter', 'horus-sdk-adapter'],
    ['get-shit-done', 'horus-spec-driven'],
    ['GSD', 'HSD'],
    ['gsd.', 'hsd.'],
    ['/gsd-', '/hsd-'],
    ['~/.claude/get-shit-done/', '~/.hermes/skills/hsd/'],
    ['skills/gsd/', 'skills/hsd/'],
    ['commands/gsd/', 'commands/hsd/'],
    ['agents/gsd-', 'agents/hsd-'],
    ['.claude/skills/gsd-', '.hermes/skills/hsd-'],
    ['CLAUDE.md', 'HERMES.md'],
    ['Claude Code', 'Hermes Agent'],
  ];
  for (const [old, nu] of historical) wordlist.set(old, nu);
  return wordlist;
}

function writeWordlist(wordlist, outputPath) {
  const obj = {};
  for (const [k, v] of wordlist) obj[k] = v;
  fs.writeFileSync(outputPath, JSON.stringify(obj, null, 2), 'utf8');
  return Object.keys(obj).length;
}

if (require.main === module) {
  const vendorDir = path.join(__dirname, '..', 'modules', 'gsd-core', 'commands', 'gsd');
  const wl = buildWordlist(vendorDir);
  const out = process.argv[2] || path.join(__dirname, '..', 'modules', 'unified-wordlist.json');
  const count = writeWordlist(wl, out);
  console.log(`Unified wordlist: ${count} entries → ${out}`);
  const cats = {};
  for (const [k, v] of wl) {
    if (!k.startsWith('gsd-')) continue;
    cats[v] = (cats[v] || 0) + 1;
  }
  for (const [cat, count] of Object.entries(cats)) console.log(`  ${cat}: ${count} commands`);
}

module.exports = { buildWordlist, writeWordlist, UNIFIED_MAP, AGENT_REMAP };
