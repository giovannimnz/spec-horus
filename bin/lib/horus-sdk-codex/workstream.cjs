'use strict';
const fs = require('fs');
const path = require('path');

function wsDir(cwd) { return path.join(cwd, '.planning', 'workstreams'); }

function handle(args, cwd) {
  const sub = args[0];
  const dir = wsDir(cwd);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (sub === 'create') {
    const name = args[1];
    if (!name) return { error: 'name required' };
    const d = path.join(dir, name);
    if (fs.existsSync(d)) return { error: 'already exists' };
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, 'state.json'), JSON.stringify({ name, status: 'active', created: new Date().toISOString(), plans: [] }, null, 2));
    return { created: true, name };
  }
  if (sub === 'list') return fs.readdirSync(dir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name);
  if (sub === 'set') {
    const name = args[1];
    fs.writeFileSync(path.join(dir, '.current'), name);
    return { set: true, name };
  }
  if (sub === 'complete') {
    const name = args[1];
    const sf = path.join(dir, name, 'state.json');
    if (!fs.existsSync(sf)) return { error: 'not found' };
    const state = JSON.parse(fs.readFileSync(sf, 'utf8'));
    state.status = 'completed';
    state.completedAt = new Date().toISOString();
    fs.writeFileSync(sf, JSON.stringify(state, null, 2));
    return { completed: true, name };
  }
  if (sub === 'progress') {
    const name = args[1];
    const sf = path.join(dir, name, 'state.json');
    if (!fs.existsSync(sf)) return { error: 'not found' };
    const state = JSON.parse(fs.readFileSync(sf, 'utf8'));
    return { name, status: state.status, plans_total: state.plans?.length || 0 };
  }
  if (sub === 'status') {
    const name = args[1];
    const sf = path.join(dir, name, 'state.json');
    if (!fs.existsSync(sf)) return { error: 'not found' };
    return JSON.parse(fs.readFileSync(sf, 'utf8'));
  }
  return { error: `unknown workstream subcommand: ${sub}` };
}

module.exports = { handle };
