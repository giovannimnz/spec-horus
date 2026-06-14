'use strict';

/**
 * state.js — Hermes-native state management (replaces gsd-tools.cjs state + init)
 *
 * All operations read/write .planning/ files directly. No gsd-core dependency.
 * Output is JSON matching the upstream gsd-tools.cjs schema so downstream
 * consumers (skill workflows) get the same init JSON they expect.
 */

const fs = require('fs');
const path = require('path');

// ─── helpers ──────────────────────────────────────────────────────────────

function safeRead(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch (_) { return null; }
}

function safeJson(p) {
  const raw = safeRead(p);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (_) { return null; }
}

function extractFrontmatter(content) {
  const m = (content || '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*?)\s*$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return fm;
}

function parseRoadmapPhase(roadmap, phaseNum) {
  // Extract a phase section from ROADMAP.md
  const re = new RegExp(`### Phase ${String(phaseNum).replace(/\./g, '\\.')}:?\\s*(.+?)\\n((?:.|\\n)*?)(?=### Phase |$)`);
  const m = (roadmap || '').match(re);
  if (!m) return null;
  return { name: (m[1] || '').trim(), section: m[0] };
}

function parseCheckboxes(content) {
  const c = (content || '').match(/^- \[([ x])\]\s+(.+)$/gm);
  if (!c) return [];
  return c.map(l => {
    const m = l.match(/^- \[([ x])\]\s+(.+)$/);
    return { done: m[1] === 'x', text: m[2].trim() };
  });
}

function findPhaseDirs(cwd) {
  const phasesDir = path.join(cwd, '.planning', 'phases');
  if (!fs.existsSync(phasesDir)) return [];
  return fs.readdirSync(phasesDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .sort();
}

function findPlanFiles(phaseDir) {
  if (!fs.existsSync(phaseDir)) return [];
  return fs.readdirSync(phaseDir)
    .filter(f => f.endsWith('-PLAN.md'))
    .sort();
}

function phaseNumberFromDir(dirName) {
  const m = dirName.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// ─── state ────────────────────────────────────────────────────────────────

function handle(args, cwd) {
  const sub = args[0];
  const cfg = safeJson(path.join(cwd, '.planning', 'config.json')) || {};
  const stateMd = safeRead(path.join(cwd, '.planning', 'STATE.md'));
  const roadmap = safeRead(path.join(cwd, '.planning', 'ROADMAP.md'));
  const fm = extractFrontmatter(stateMd);

  if (sub === 'json') return fm;
  if (sub === 'load') return {
    config: cfg,
    state: fm,
    milestone_version: cfg.currentMilestone || fm.milestone || 'M001',
    milestone_name: fm.milestone_name || 'milestone',
    phase_count: (roadmap || '').match(/^### Phase \d/gm)?.length || 0,
    completed_phases: parseCheckboxes(roadmap).filter(c => c.done).length,
    current_phase: cfg.currentPhase || fm.current_phase || null,
    phase_dirs: findPhaseDirs(cwd),
    planning_exists: fs.existsSync(path.join(cwd, '.planning', 'PROJECT.md')),
    roadmap_exists: !!roadmap,
    has_git: fs.existsSync(path.join(cwd, '.git')),
  };
  if (sub === 'update') {
    const [field, value] = [args[1], args.slice(2).join(' ')];
    updateStateField(cwd, field, value);
    return { updated: true, field, value };
  }
  if (sub === 'get') {
    const section = args[1];
    if (!section) return fm;
    // Extract section from STATE.md (## SectionName ...)
    const re = new RegExp(`## ${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n([\\s\\S]*?)(?=## |$)`);
    const m = (stateMd || '').match(re);
    return m ? m[1].trim() : null;
  }
  if (sub === 'patch') return updateStateFields(cwd, args);
  if (sub === 'begin-phase') return beginPhase(cwd, args);
  if (sub === 'signal-waiting') return createSignal(cwd, args);
  if (sub === 'signal-resume') return removeSignal(cwd);
  return { error: `unknown state subcommand: ${sub}` };
}

function updateStateField(cwd, field, value) {
  const p = path.join(cwd, '.planning', 'STATE.md');
  let content = safeRead(p) || '---\n---\n';
  const re = new RegExp(`^${field}:.*$`, 'm');
  if (content.match(re)) {
    content = content.replace(re, `${field}: ${value}`);
  } else {
    content = content.replace(/^---\n/, `---\n${field}: ${value}\n`);
  }
  fs.writeFileSync(p, content);
}

function updateStateFields(cwd, args) {
  // --field k val --field k2 val2 ...
  const updates = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--field' && i + 2 < args.length) {
      updates[args[i + 1]] = args[i + 2];
    }
  }
  for (const [k, v] of Object.entries(updates)) {
    updateStateField(cwd, k, v);
  }
  return { patched: Object.keys(updates).length };
}

function beginPhase(cwd, args) {
  const phaseIdx = args.indexOf('--phase');
  const nameIdx = args.indexOf('--name');
  const plansIdx = args.indexOf('--plans');
  const phase = phaseIdx !== -1 ? args[phaseIdx + 1] : null;
  const name = nameIdx !== -1 ? args[nameIdx + 1] : null;
  const plans = plansIdx !== -1 ? args[plansIdx + 1] : null;
  const updates = { current_phase: phase };
  if (name) updates.phase_name = name;
  for (const [k, v] of Object.entries(updates)) {
    updateStateField(cwd, k, v);
  }
  return { begin_phase: true, phase, name, plans };
}

function createSignal(cwd, args) {
  const data = {
    type: args.includes('--type') ? args[args.indexOf('--type') + 1] : 'waiting',
    question: args.includes('--question') ? args[args.indexOf('--question') + 1] : '',
    options: args.includes('--options') ? args[args.indexOf('--options') + 1] : '',
    phase: args.includes('--phase') ? args[args.indexOf('--phase') + 1] : null,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(cwd, '.planning', 'WAITING.json'), JSON.stringify(data, null, 2));
  return { signal_created: true };
}

function removeSignal(cwd) {
  const p = path.join(cwd, '.planning', 'WAITING.json');
  if (fs.existsSync(p)) fs.unlinkSync(p);
  return { signal_removed: true };
}

// ─── init ──────────────────────────────────────────────────────────────────

function handleInit(args, cwd) {
  const workflow = args[0]; // 'new-project', 'plan-phase', 'execute-phase', 'phase-op', 'milestone-op', 'manager', 'quick'

  const cfg = safeJson(path.join(cwd, '.planning', 'config.json')) || {};
  const roadmap = safeRead(path.join(cwd, '.planning', 'ROADMAP.md'));
  const stateMd = safeRead(path.join(cwd, '.planning', 'STATE.md'));
  const fm = extractFrontmatter(stateMd);
  const projectExists = fs.existsSync(path.join(cwd, '.planning', 'PROJECT.md'));

  const base = {
    project_exists: projectExists,
    planning_exists: fs.existsSync(path.join(cwd, '.planning')),
    roadmap_exists: !!roadmap,
    has_git: fs.existsSync(path.join(cwd, '.git')),
    config: cfg,
    phase_dirs: findPhaseDirs(cwd),
    commit_docs: !!cfg.commit_docs,
    text_mode: !!cfg.text_mode,
    auto_advance: !!cfg.auto_advance,
    auto_chain_active: !!cfg._auto_chain_active,
    research_enabled: cfg.workflow?.research !== false,
    plan_checker_enabled: cfg.workflow?.plan_check !== false,
    nyquist_validation_enabled: !!cfg.workflow?.nyquist_validation,
    researcher_model: 'default',
    planner_model: 'default',
    checker_model: 'default',
    response_language: cfg.language || null,
  };

  // Per-workflow expansion
  const phaseNum = args[1];
  if (phaseNum && ['plan-phase', 'execute-phase', 'phase-op', 'quick'].includes(workflow)) {
    const phasePhase = parseRoadmapPhase(roadmap, phaseNum);
    const phaseDirName = findPhaseDirs(cwd).find(d => phaseNumberFromDir(d) === parseInt(phaseNum, 10));
    const phaseDir = phaseDirName ? path.join(cwd, '.planning', 'phases', phaseDirName) : null;
    const padded = String(phaseNum).padStart(2, '0');
    Object.assign(base, {
      phase_found: !!phasePhase,
      phase_number: phaseNum,
      phase_name: phasePhase?.name || '',
      phase_slug: phaseDirName || `${padded}-unknown`,
      padded_phase: padded,
      phase_dir: phaseDir,
      expected_phase_dir: phaseDir || path.join(cwd, '.planning', 'phases', `${padded}-fallback`),
      has_research: phaseDir ? fs.existsSync(path.join(phaseDir, `${padded}-RESEARCH.md`)) : false,
      has_context: phaseDir ? fs.existsSync(path.join(phaseDir, `${padded}-CONTEXT.md`)) : false,
      has_reviews: phaseDir ? fs.existsSync(path.join(phaseDir, `${padded}-REVIEWS.md`)) : false,
      has_plans: phaseDir ? findPlanFiles(phaseDir).length > 0 : false,
      plan_count: phaseDir ? findPlanFiles(phaseDir).length : 0,
      phase_status: fm.current_phase === phaseNum ? 'In Progress' : 'Pending',
      phase_req_ids: extractPhaseReqIds(roadmap, phaseNum),
      context_path: phaseDir ? path.join(phaseDir, `${padded}-CONTEXT.md`) : null,
      research_path: phaseDir ? path.join(phaseDir, `${padded}-RESEARCH.md`) : null,
      review_path: phaseDir ? path.join(phaseDir, `${padded}-REVIEWS.md`) : null,
      verification_path: phaseDir ? path.join(phaseDir, `${padded}-VERIFICATION.md`) : null,
      uat_path: phaseDir ? path.join(phaseDir, `${padded}-UAT.md`) : null,
      state_path: path.join(cwd, '.planning', 'STATE.md'),
      roadmap_path: path.join(cwd, '.planning', 'ROADMAP.md'),
      requirements_path: path.join(cwd, '.planning', 'REQUIREMENTS.md'),
    });
  }

  return base;
}

function extractPhaseReqIds(roadmap, phaseNum) {
  const pp = parseRoadmapPhase(roadmap, phaseNum);
  if (!pp) return [];
  const m = pp.section.match(/REQ-(\d+)/g);
  return m ? [...new Set(m)] : [];
}

// ─── snapshot / summary / history ──────────────────────────────────────────

function cmdStateSnapshot(cwd) {
  const stateMd = safeRead(path.join(cwd, '.planning', 'STATE.md'));
  const fm = extractFrontmatter(stateMd);
  return { frontmatter: fm, sections: (stateMd || '').split(/^## /m).filter(Boolean).map(s => s.trim()) };
}

function cmdSummaryExtract(filePath, cwd) {
  const p = path.resolve(cwd, filePath || '.planning/latest-SUMMARY.md');
  const content = safeRead(p);
  if (!content) return { error: 'file not found', path: p };
  const fm = extractFrontmatter(content);
  const body = content.replace(/^---[\s\S]*?---\n?/, '');
  return { file: p, frontmatter: fm, body, phase: fm.phase, status: fm.status };
}

function cmdHistoryDigest(cwd) {
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const summaries = [];
  if (fs.existsSync(phasesDir)) {
    for (const d of fs.readdirSync(phasesDir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const files = fs.readdirSync(path.join(phasesDir, d.name));
      const summary = files.find(f => f.endsWith('-SUMMARY.md'));
      if (summary) {
        const content = safeRead(path.join(phasesDir, d.name, summary));
        summaries.push({
          phase_dir: d.name,
          summary_file: summary,
          frontmatter: extractFrontmatter(content),
        });
      }
    }
  }
  return { summaries, count: summaries.length };
}

// ─── exports ───────────────────────────────────────────────────────────────

module.exports = {
  handle,
  handleInit,
  cmdStateSnapshot,
  cmdSummaryExtract,
  cmdHistoryDigest,
};
