'use strict';

const fs = require('fs');
const path = require('path');

function load(cwd) {
  const p = path.join(cwd, '.planning', 'config.json');
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function save(cwd, cfg) {
  const dir = path.join(cwd, '.planning');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'config.json'), JSON.stringify(cfg, null, 2) + '\n');
}

function get(key, defaultValue, cwd) {
  const cfg = load(cwd);
  const keys = key.split('.');
  let v = cfg;
  for (const k of keys) {
    if (v === null || typeof v !== 'object') return defaultValue ?? null;
    v = v[k];
  }
  return v !== undefined ? v : (defaultValue ?? null);
}

function set(key, value, cwd) {
  const cfg = load(cwd);
  const keys = key.split('.');
  let obj = cfg;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!obj[keys[i]] || typeof obj[keys[i]] !== 'object') obj[keys[i]] = {};
    obj = obj[keys[i]];
  }
  // Try to parse value as JSON if it looks like JSON
  let v = value;
  try { if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) v = JSON.parse(value); } catch (_) {}
  if (v === 'true') v = true;
  else if (v === 'false') v = false;
  obj[keys[keys.length - 1]] = v;
  save(cwd, cfg);
  return { set: true, key, value: v };
}

function setModelProfile(profile, cwd) {
  const cfg = load(cwd);
  cfg.model_profile = profile;
  // Also set model tier defaults
  const profileMap = {
    quality: { researcher: 'high', planner: 'high', checker: 'high', executor: 'medium' },
    balanced: { researcher: 'medium', planner: 'medium', checker: 'medium', executor: 'medium' },
    budget: { researcher: 'low', planner: 'low', checker: 'low', executor: 'low' },
    inherit: { researcher: 'inherit', planner: 'inherit', checker: 'inherit', executor: 'inherit' },
  };
  cfg.model_tiers = profileMap[profile] || profileMap.balanced;
  save(cwd, cfg);
  return { set: true, model_profile: profile };
}

function newProject(jsonStr, cwd) {
  let cfg;
  try { cfg = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr; } catch (_) { return { error: 'invalid JSON' }; }
  const dir = path.join(cwd, '.planning');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  save(cwd, cfg);
  return { created: true, path: path.join(dir, 'config.json') };
}

function ensureSection(cwd) {
  const cfg = load(cwd);
  if (!cfg.workflow) cfg.workflow = {};
  if (!cfg.milestones) cfg.milestones = {};
  save(cwd, cfg);
  return { ensured: true };
}

function configPath(cwd) {
  return { path: path.join(cwd, '.planning', 'config.json') };
}

module.exports = { get, set, setModelProfile, newProject, ensureSection, path: configPath };
