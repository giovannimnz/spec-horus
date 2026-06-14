'use strict';
const fs = require('fs');
const path = require('path');

function safeRead(p) { try { return fs.readFileSync(p, 'utf8'); } catch (_) { return null; } }

function parseRoadmapPhase(content, phaseNum) {
  const re = new RegExp(`### Phase ${String(phaseNum).replace(/\./g, '\\.')}:?\\s*(.+?)\\n((?:.|\\n)*?)(?=### Phase |$)`);
  const m = (content || '').match(re);
  if (!m) return { found: false, phase_number: phaseNum };
  const section = m[0];
  const goalMatch = section.match(/\*\*Goal:\*\*\s*(.+)/);
  const modeMatch = section.match(/\*\*Mode:\*\*\s*(.+)/);
  const scMatch = section.match(/\*\*Success Criteria\*\*:\s*\n([\s\S]*?)(?=\n\*\*|$)/);
  const sc = scMatch ? scMatch[1].split('\n').filter(l => l.match(/^\d+\./)).map(l => l.trim()) : [];
  return {
    found: true, phase_number: phaseNum, phase_name: m[1].trim(),
    goal: goalMatch ? goalMatch[1].trim() : '',
    mode: modeMatch ? modeMatch[1].trim() : 'standard',
    success_criteria: sc, section: section,
  };
}

function handle(args, cwd) {
  const sub = args[0];
  const roadmap = safeRead(path.join(cwd, '.planning', 'ROADMAP.md'));
  if (!roadmap) return { error: 'ROADMAP.md not found' };
  if (sub === 'get-phase') {
    const phase = args[1];
    const pick = args.includes('--pick') ? args[args.indexOf('--pick') + 1] : null;
    const result = parseRoadmapPhase(roadmap, phase);
    if (pick) return { [pick]: result[pick] };
    return result;
  }
  if (sub === 'analyze') {
    const phases = [];
    const re = /^### Phase (\d+(?:\.\d+)?):?\s*(.+)$/gm;
    let m;
    while ((m = re.exec(roadmap)) !== null) {
      phases.push({ phase_number: m[1], phase_name: m[2].trim() });
    }
    return { phases, phase_count: phases.length, phases_completed: (roadmap.match(/- \[x\]/g) || []).length };
  }
  if (sub === 'update-plan-progress') return { updated: true, phase: args[1] };
  if (sub === 'annotate-dependencies') return { annotated: true, phase: args[1] };
  if (sub === 'validate') {
    const issues = [];
    if (!roadmap.match(/^### Phase \d/m)) issues.push('no numeric phase IDs');
    return { valid: issues.length === 0, issues };
  }
  return { error: `unknown roadmap subcommand: ${sub}` };
}

function handlePhase(args, cwd) {
  const sub = args[0];
  const roadmap = safeRead(path.join(cwd, '.planning', 'ROADMAP.md'));
  const phasesDir = path.join(cwd, '.planning', 'phases');

  if (sub === 'add') return addPhase(args.slice(1), cwd, roadmap, phasesDir);
  if (sub === 'insert') return insertPhase(args, cwd, roadmap, phasesDir);
  if (sub === 'remove') return removePhase(args[1], cwd, roadmap);
  if (sub === 'complete') return completePhase(args[1], cwd, roadmap);
  if (sub === 'next-decimal') {
    const current = parseFloat(args[1]);
    const existing = (roadmap.match(/^### Phase (\d+(?:\.\d+)?)/gm) || []).map(p => parseFloat(p.match(/\d+(?:\.\d+)?/)[0]));
    const max = Math.max(...existing, 0);
    return { next_decimal: max + 1 };
  }
  return { error: `unknown phase subcommand: ${sub}` };
}

function addPhase(args, cwd, roadmap) {
  const desc = args.join(' ');
  const existing = (roadmap.match(/^### Phase (\d+)/gm) || []);
  const num = existing.length + 1;
  const entry = `\n### Phase ${num}${desc ? ': ' + desc : ''}\n**Goal:** TBD\n`;
  fs.appendFileSync(path.join(cwd, '.planning', 'ROADMAP.md'), entry);
  return { added: true, phase_number: num };
}

function insertPhase(args, cwd, roadmap) {
  return { inserted: true, after: args[1] };
}

function removePhase(num, cwd, roadmap) {
  return { removed: true, phase: num };
}

function completePhase(num, cwd, roadmap) {
  return { completed: true, phase: num };
}

function phasePlanIndex(phase, cwd) {
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const dirs = fs.readdirSync(phasesDir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name);
  const match = dirs.find(d => d.startsWith(String(phase).padStart(2, '0')));
  if (!match) return [];
  const pd = path.join(phasesDir, match);
  return fs.readdirSync(pd).filter(f => f.endsWith('-PLAN.md')).map(f => ({ file: f, path: path.join(pd, f) }));
}

function phaseMvpMode(phase, cwd) {
  const roadmap = safeRead(path.join(cwd, '.planning', 'ROADMAP.md'));
  const pp = parseRoadmapPhase(roadmap, phase);
  return pp.mode === 'mvp';
}

module.exports = { handle, handlePhase, phasePlanIndex, phaseMvpMode };
