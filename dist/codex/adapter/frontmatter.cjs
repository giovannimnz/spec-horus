'use strict';
const fs = require('fs');
const path = require('path');

function safeRead(p) { try { return fs.readFileSync(p, 'utf8'); } catch (_) { return null; } }

function get(file, field, cwd) {
  const p = path.resolve(cwd, file);
  const content = safeRead(p);
  if (!content) return { error: 'file not found', path: p };
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { error: 'no frontmatter', path: p };
  if (field) {
    const re = new RegExp(`^${field}:\\s*(.*?)$`, 'm');
    const fm = m[1].match(re);
    return fm ? fm[1].replace(/^["']|["']$/g, '').trim() : null;
  }
  // Return all frontmatter as key-value
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*?)\s*$/);
    if (kv) out[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

function set(file, field, value, cwd) {
  const p = path.resolve(cwd, file);
  let content = safeRead(p);
  if (!content) return { error: 'file not found', path: p };
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { error: 'no frontmatter', path: p };
  const re = new RegExp(`^${field}:.*$`, 'm');
  if (m[1].match(re)) {
    content = content.replace(re, `${field}: ${value}`);
  } else {
    content = content.replace(/^---\n/, `---\n${field}: ${value}\n`);
  }
  fs.writeFileSync(p, content);
  return { set: true, field, value };
}

function merge(file, dataStr, cwd) {
  const p = path.resolve(cwd, file);
  let content = safeRead(p);
  if (!content) return { error: 'file not found', path: p };
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { error: 'no frontmatter', path: p };
  let data;
  try { data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr; } catch (_) { return { error: 'invalid JSON data' }; }
  let fm = m[1];
  for (const [k, v] of Object.entries(data)) {
    if (fm.match(new RegExp(`^${k}:`, 'm'))) {
      fm = fm.replace(new RegExp(`^${k}:.*$`, 'm'), `${k}: ${v}`);
    } else {
      fm += `\n${k}: ${v}`;
    }
  }
  content = `---\n${fm}\n---` + content.slice(m[0].length);
  fs.writeFileSync(p, content);
  return { merged: Object.keys(data).length };
}

function validate(file, schema, cwd) {
  const p = path.resolve(cwd, file);
  const content = safeRead(p);
  if (!content) return { valid: false, reason: 'file not found' };
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { valid: false, reason: 'no frontmatter' };
  // Basic validation: required fields
  const fm = m[1];
  const reqFields = schema ? schema.split(',') : ['name', 'description'];
  const missing = reqFields.filter(f => !fm.match(new RegExp(`^${f}:`, 'm')));
  return { valid: missing.length === 0, missing, total: reqFields.length };
}

module.exports = { get, set, merge, validate };
