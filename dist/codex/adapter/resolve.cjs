'use strict';
const fs = require('fs');
const path = require('path');

function safeJson(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (_) { return {}; } }

function model(agentType, cwd) {
  const cfg = safeJson(path.join(cwd, '.planning', 'config.json'));
  const profile = cfg.model_profile || 'balanced';
  const tiers = cfg.model_tiers || { researcher: 'medium', planner: 'medium', checker: 'medium', executor: 'medium' };
  const tier = tiers[agentType] || 'medium';
  return { agent_type: agentType, model_profile: profile, tier };
}

function granularity(cwd) {
  const cfg = safeJson(path.join(cwd, '.planning', 'config.json'));
  return { granularity: cfg.granularity || 'standard' };
}

function execution(cwd) {
  const cfg = safeJson(path.join(cwd, '.planning', 'config.json'));
  return { parallelization: cfg.parallelization !== false };
}

function progress(format, cwd) {
  const roadmapPd = path.join(cwd, '.planning', 'ROADMAP.md');
  if (!fs.existsSync(roadmapPd)) return { error: 'ROADMAP.md not found' };
  const content = fs.readFileSync(roadmapPd, 'utf8');
  const total = (content.match(/^- \[[ x]\]/gm) || []).length;
  const done = (content.match(/^- \[x\]/gm) || []).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  if (format === 'bar') return `${pct}% [${'#' .repeat(Math.round(pct / 10))}${' ' .repeat(10 - Math.round(pct / 10))}] ${done}/${total}`;
  return { progress: pct, done, total, phases_completed: done, phases_total: total };
}

module.exports = { model, granularity, execution, progress };
