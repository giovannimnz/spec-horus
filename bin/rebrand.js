#!/usr/bin/env node
'use strict';

/**
 * rebrand.js v3.0 — Unified role-based wordlist for Horus Spec Driven
 *
 * Maps 67 upstream gsd-core commands → 17 unified hsd commands.
 *
 * Categories:
 *   PO  (Product Owner): discover, new, define, inbox
 *   PM  (Project Manager): plan, exec, track, config, ship, manage
 *   FRONT (Frontend): ui
 *   BACK (Backend): debug, maintain, context
 *   QA  (Quality): validate, audit, review
 *
 * Output: JSON wordlist gsd-X → hsd-{role}-Y
 */

const fs = require('fs');
const path = require('path');

// ── Unified mapping: old gsd- name → new hsd-{role}- name ──────────────────

const UNIFIED_MAP = {
  // ── PO: Product Owner ──
  'new-project':            'hsd-po-new',
  'new-milestone':          'hsd-po-new',
  'explore':                'hsd-po-discover',
  'spike':                  'hsd-po-discover',
  'sketch':                 'hsd-po-discover',
  'capture':                'hsd-po-discover',
  'ns-ideate':              'hsd-po-discover',
  'map-codebase':           'hsd-po-discover',
  'ns-context':              'hsd-back-context',
  'discuss-phase':          'hsd-po-define',
  'spec-phase':             'hsd-po-define',
  'mvp-phase':              'hsd-po-define',
  'inbox':                  'hsd-po-inbox',

  // ── PM: Project Manager ──
  'plan-phase':             'hsd-pm-plan',
  'ultraplan-phase':        'hsd-pm-plan',
  'ai-integration-phase':   'hsd-pm-plan',
  'execute-phase':          'hsd-pm-exec',
  'autonomous':             'hsd-pm-exec',
  'quick':                  'hsd-pm-exec',
  'fast':                   'hsd-pm-exec',
  'progress':               'hsd-pm-track',
  'workstreams':            'hsd-pm-track',
  'thread':                 'hsd-pm-track',
  'phase':                  'hsd-pm-track',
  'workspace':              'hsd-pm-track',
  'stats':                  'hsd-pm-track',
  'graphify':               'hsd-pm-track',
  'ns-project':             'hsd-pm-track',
  'ns-workflow':            'hsd-pm-track',
  'ns-manage':              'hsd-pm-track',
  'config':                 'hsd-pm-config',
  'settings':               'hsd-pm-config',
  'profile-user':           'hsd-pm-config',
  'ship':                   'hsd-pm-ship',
  'pr-branch':              'hsd-pm-ship',
  'complete-milestone':     'hsd-pm-ship',
  'milestone-summary':      'hsd-pm-ship',
  'undo':                   'hsd-pm-ship',
  'update':                 'hsd-pm-ship',
  'manager':                'hsd-pm-manage',
  'surface':                'hsd-pm-manage',
  'pause-work':             'hsd-pm-manage',
  'resume-work':            'hsd-pm-manage',
  'help':                   'hsd-pm-manage',

  // ── FRONT: Frontend ──
  'ui-phase':               'hsd-front-ui',
  'ui-review':              'hsd-front-ui',

  // ── BACK: Backend ──
  'debug':                  'hsd-back-debug',
  'forensics':              'hsd-back-debug',
  'docs-update':            'hsd-back-maintain',
  'extract-learnings':      'hsd-back-maintain',
  'ingest-docs':            'hsd-back-maintain',
  'import':                 'hsd-back-maintain',
  'cleanup':                'hsd-back-maintain',

  // ── QA: Quality Assurance ──
  'validate-phase':         'hsd-qa-validate',
  'verify-work':            'hsd-qa-validate',
  'health':                 'hsd-qa-validate',
  'add-tests':              'hsd-qa-validate',
  'audit-fix':              'hsd-qa-audit',
  'audit-milestone':        'hsd-qa-audit',
  'audit-uat':              'hsd-qa-audit',
  'code-review':            'hsd-qa-review',
  'eval-review':            'hsd-qa-review',
  'review':                 'hsd-qa-review',
  'review-backlog':         'hsd-qa-review',
  'plan-review-convergence':'hsd-qa-review',
  'ns-review':              'hsd-qa-review',
  'secure-phase':           'hsd-qa-review',
};

// ── Agent remapping ──────────────────────────────────────────────────────

const AGENT_REMAP = {
  'gsd-executor':           'hsd-pm-exec',
  'gsd-planner':            'hsd-pm-plan',
  'gsd-researcher':         'hsd-po-discover',
  'gsd-plan-checker':       'hsd-qa-validate',
  'gsd-phase-researcher':   'hsd-po-discover',
  'gsd-pattern-mapper':     'hsd-po-discover',
  'gsd-auditor':            'hsd-qa-audit',
  'gsd-debugger':           'hsd-back-debug',
};

// ── Historical references in skill bodies ─────────────────────────────────

function buildWordlist(vendorCommandsDir) {
  const wordlist = new Map();

  // 1. Add unified map
  for (const [oldName, newName] of Object.entries(UNIFIED_MAP)) {
    wordlist.set(`gsd-${oldName}`, newName);
    wordlist.set(`gsd:${oldName}`, newName);
  }

  // 2. Add agent remaps
  for (const [oldAgent, newAgent] of Object.entries(AGENT_REMAP)) {
    wordlist.set(oldAgent, newAgent);
  }

  // 3. Scan vendor commands for any missing entries
  if (vendorCommandsDir && fs.existsSync(vendorCommandsDir)) {
    for (const file of fs.readdirSync(vendorCommandsDir)) {
      const name = file.replace(/\.md$/, '');
      if (!UNIFIED_MAP[name]) {
        // Unknown command — map to PM by default
        wordlist.set(`gsd-${name}`, `hsd-pm-manage`);
        wordlist.set(`gsd:${name}`, `hsd-pm-manage`);
      }
    }
  }

  // 4. Add historical/branding references
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
  for (const [old, nu] of historical) {
    wordlist.set(old, nu);
  }

  return wordlist;
}

function writeWordlist(wordlist, outputPath) {
  const obj = {};
  for (const [k, v] of wordlist) {
    obj[k] = v;
  }
  fs.writeFileSync(outputPath, JSON.stringify(obj, null, 2), 'utf8');
  return Object.keys(obj).length;
}

// ── CLI ───────────────────────────────────────────────────────────────────

if (require.main === module) {
  const vendorDir = path.join(__dirname, '..', 'modules', 'gsd-core', 'commands', 'gsd');
  const wl = buildWordlist(vendorDir);
  const out = process.argv[2] || path.join(__dirname, '..', 'modules', 'unified-wordlist.json');
  const count = writeWordlist(wl, out);
  console.log(`Unified wordlist: ${count} entries → ${out}`);
  console.log('');
  console.log('Categories:');
  const cats = {};
  for (const [k, v] of wl) {
    if (!k.startsWith('gsd-')) continue;
    const cat = v.replace(/^hsd-/, '').split('-')[0];
    cats[cat] = (cats[cat] || 0) + 1;
  }
  for (const [cat, count] of Object.entries(cats)) {
    console.log(`  ${cat}: ${count} commands`);
  }
}

module.exports = { buildWordlist, writeWordlist, UNIFIED_MAP, AGENT_REMAP };
