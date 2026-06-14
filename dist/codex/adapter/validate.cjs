'use strict';
const fs = require('fs');
const path = require('path');

function safeRead(p) { try { return fs.readFileSync(p, 'utf8'); } catch (_) { return null; } }

function handle(args, cwd) {
  const sub = args[0];
  if (sub === 'consistency') {
    const roadmap = safeRead(path.join(cwd, '.planning', 'ROADMAP.md'));
    const phasesDir = path.join(cwd, '.planning', 'phases');
    const dirPhases = fs.existsSync(phasesDir) ? fs.readdirSync(phasesDir, { withFileTypes: true }).filter(e => e.isDirectory()).length : 0;
    const roadmapPhases = (roadmap?.match(/^### Phase \d/gm) || []).length;
    return { consistent: dirPhases >= roadmapPhases, disk_phases: dirPhases, roadmap_phases: roadmapPhases };
  }
  if (sub === 'health') {
    const planDir = path.join(cwd, '.planning');
    const issues = [];
    if (!fs.existsSync(path.join(planDir, 'config.json'))) issues.push('missing config.json');
    if (!fs.existsSync(path.join(planDir, 'ROADMAP.md'))) issues.push('missing ROADMAP.md');
    return { healthy: issues.length === 0, issues, repair: args.includes('--repair') };
  }
  if (sub === 'agents') return { agents_installed: false };
  if (sub === 'context') return { tokens_used: 0, context_window: 200000, percent: 0 };
  return { error: `unknown validate subcommand: ${sub}` };
}

function auditUat(cwd) {
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const unresolved = [];
  if (fs.existsSync(phasesDir)) {
    for (const d of fs.readdirSync(phasesDir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const uat = path.join(phasesDir, d.name, `${d.name}-UAT.md`);
      if (fs.existsSync(uat)) {
        const content = safeRead(uat);
        if (content && content.includes('- [ ]')) unresolved.push(d.name);
      }
    }
  }
  return { unresolved, count: unresolved.length };
}

function auditOpen(cwd) {
  const planDir = path.join(cwd, '.planning');
  const unresolved = [];
  if (fs.existsSync(planDir)) {
    for (const f of fs.readdirSync(planDir, { recursive: true, withFileTypes: true })) {
      if (f.isFile() && f.name.endsWith('.md')) {
        const content = safeRead(path.join(f.parentPath || planDir, f.name));
        if (content && content.includes('- [ ]')) unresolved.push(f.name);
      }
    }
  }
  return { unresolved, count: unresolved.length };
}

module.exports = { handle, auditUat, auditOpen };
