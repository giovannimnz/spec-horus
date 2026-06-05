#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const VENDOR_CMDS = path.join(ROOT, 'vendor', 'gsd-core', 'commands', 'gsd');
const WORDLIST_PATH = path.join(ROOT, 'vendor', 'unified-wordlist.json');
const OUT_DIR = path.join(ROOT, 'unified-skills');
const CONFIG_PATH = path.join(ROOT, 'horus-spec-driven.json');
const LOCALES_DIR = path.join(ROOT, 'locales');

const wordlist = JSON.parse(fs.readFileSync(WORDLIST_PATH, 'utf8'));

function getLocale() {
  const ci = process.argv.indexOf('--locale');
  if (ci !== -1 && process.argv[ci + 1]) return process.argv[ci + 1];
  try {
    const c = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    return (c.locale && c.locale.code) || 'en';
  } catch (e) { return 'en'; }
}

const localeCode = getLocale();
let localeData;
try {
  localeData = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, localeCode + '.json'), 'utf8'));
} catch (e) {
  localeData = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en.json'), 'utf8'));
}

const ROLE_ICONS = { po: '🎯', pm: '📋', front: '🎨', back: '⚙️', qa: '✅' };

function roleInfo(r) {
  const l = localeData.role[r] || {};
  return { name: l.name || r.toUpperCase(), icon: ROLE_ICONS[r] || '📌', desc: l.desc || '' };
}

function verbDesc(n) {
  const v = n.replace(/^hsd-/, '').replace(/^[a-z]+-/, '');
  return localeData.verbs[v] || v;
}

const groups = {};
for (const [ok, nn] of Object.entries(wordlist)) {
  if (!ok.startsWith('gsd-')) continue;
  const on = ok.replace(/^gsd-/, '');
  if (!groups[nn]) groups[nn] = [];
  if (!groups[nn].includes(on)) groups[nn].push(on);
}

const VALID_ROLES = ['po', 'pm', 'front', 'back', 'qa'];
for (const [n] of Object.entries(groups)) {
  const p = n.replace(/^hsd-/, '').split('-');
  if (!VALID_ROLES.includes(p[0])) delete groups[n];
}

function gd(c) {
  const f = path.join(VENDOR_CMDS, c + '.md');
  if (!fs.existsSync(f)) return c;
  const s = fs.readFileSync(f, 'utf8');
  const m = s.match(/^description:\s*"?(.+?)"?\s*$/m);
  return m ? m[1].replace(/"/g, '') : c;
}

const EX = {
  'hsd-po-discover': '/hsd-po-discover explore "auth system"',
  'hsd-po-new': '/hsd-po-new project "my-app"',
  'hsd-po-define': '/hsd-po-define discuss --phase 1',
  'hsd-po-inbox': '/hsd-po-inbox',
  'hsd-pm-plan': '/hsd-pm-plan phase 1',
  'hsd-pm-exec': '/hsd-pm-exec run --phase 1',
  'hsd-pm-track': '/hsd-pm-track progress',
  'hsd-pm-config': '/hsd-pm-config set model_profile gpt-4',
  'hsd-pm-ship': '/hsd-pm-ship release',
  'hsd-pm-manage': '/hsd-pm-manage dashboard',
  'hsd-front-ui': '/hsd-front-ui spec --phase 2',
  'hsd-back-debug': '/hsd-back-debug trace --phase 1',
  'hsd-back-maintain': '/hsd-back-maintain docs',
  'hsd-back-context': '/hsd-back-context',
  'hsd-qa-validate': '/hsd-qa-validate phase 1',
  'hsd-qa-audit': '/hsd-qa-audit milestone M001',
  'hsd-qa-review': '/hsd-qa-review code --phase 1',
};

function buildSkill(un, cmds) {
  const r = un.replace(/^hsd-/, '').split('-')[0];
  const inf = roleInfo(r);
  const vb = un.replace(/^hsd-/, '').replace(/^[a-z]+-/, '');
  const vd = verbDesc(un);
  const sc = cmds.map(function(c) { return '"' + c + '"'; }).join(', ');
  let ct = '';
  for (const c of cmds) ct += '| `' + c + '` | ' + gd(c) + ' |\n';
  const ex = EX[un] || '/' + un;
  const lc = localeCode !== 'en' ? '\n_i18n: ' + localeCode + '_\n' : '';
  const rn = localeCode !== 'en' ? '**Idioma:** ' + localeData.locale.name : '';
  return '---\n'
    + 'name: ' + un + '\n'
    + 'description: "' + inf.icon + ' ' + inf.name + ': ' + vb + ' — ' + inf.desc + '"\n'
    + 'version: "3.0.0"\n'
    + 'author: "Horus Spec Driven"\n'
    + 'license: "MIT"\n'
    + 'locale: "' + localeCode + '"\n'
    + 'platforms:\n  - hermes\n  - claude-code\n  - codex\n  - gemini\n  - copilot\n'
    + 'metadata:\n  hermes:\n    tags: ["hsd", "' + r + '", "unified", "' + localeCode + '"]\n'
    + '    category: "' + r + '"\n'
    + '    subcommands: [' + sc + ']\n'
    + '---\n\n'
    + '# ' + inf.icon + ' ' + un + ' ' + lc + '\n\n'
    + '**Role:** ' + inf.name + '  \n'
    + '**Verb:** ' + vb + '  \n'
    + '**Maps from:** ' + cmds.length + ' upstream commands  \n'
    + '**Description:** ' + inf.desc + '\n\n'
    + rn + '\n\n---\n\n'
    + '## Quick Example\n\n```\n' + ex + '\n```\n\n---\n\n'
    + '## Subcommands\n\n| Subcommand | Description |\n|---|--|\n'
    + ct
    + '\n---\n\n## Usage\n```\n/' + un + ' <subcommand> [args]\n```\n\n---\n\n'
    + '## Runtime Notes\n\n<horus_sdk_adapter runtime="hermes">\n\n'
    + '**horus-sdk-adapter** handles all internal operations.\n\n'
    + '`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`\n\n'
    + '---\n\n*Horus Spec Driven v3.0.0 — ' + localeData.locale.name + '*\n';
}

function buildConfigSkill() {
  const pt = localeCode === 'pt-BR';
  const lang = pt ? {
    name: 'Configura\u00e7\u00e3o',
    desc: 'Configurar prefer\u00eancias, idioma e modelos do Horus Spec Driven',
    change: 'Alterar idioma',
  } : {
    name: 'Configuration',
    desc: 'Configure Horus Spec Driven preferences, language, and models',
    change: 'Change language',
  };
  return '---\n'
    + 'name: hsd-config\n'
    + 'description: "\u2699\ufe0f ' + lang.name + ' — ' + lang.desc + '"\n'
    + 'version: "3.0.0"\n'
    + 'author: "Horus Spec Driven"\n'
    + 'license: "MIT"\n'
    + 'locale: "' + localeCode + '"\n'
    + 'platforms:\n  - hermes\n'
    + 'metadata:\n  hermes:\n    tags: ["hsd", "config", "' + localeCode + '"]\n    category: "config"\n'
    + '---\n\n'
    + '# \u2699\ufe0f hsd-config\n\n'
    + '**Role:** System  \n'
    + '**Description:** ' + lang.desc + '\n\n---\n\n'
    + '## Language\n\n'
    + (pt ? 'Alterne entre idiomas suportados. As descri\u00e7\u00f5es dos skills s\u00e3o traduzidas automaticamente.' : 'Switch between supported languages.')
    + '\n\n'
    + '**Current:** ' + localeData.locale.name + ' (' + localeCode + ')\n'
    + '**Available:** en (English), pt-BR (Portugu\u00eas)\n\n'
    + '**' + lang.change + ':**\n\n```\n/hsd-config language <code>\n```\n\n'
    + (pt ? 'Ao alterar o idioma, os skills ser\u00e3o reconstru\u00eddos e reinstalados automaticamente.' : 'Skills are rebuilt and reinstalled on language change.')
    + '\n\n---\n\n'
    + '*Horus Spec Driven v3.0.0 — ' + localeData.locale.name + '*\n';
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let total = 0;
for (const [un, cmds] of Object.entries(groups).sort()) {
  const d = path.join(OUT_DIR, un);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'SKILL.md'), buildSkill(un, cmds), 'utf8');
  total++;
}

const cd = path.join(OUT_DIR, 'hsd-config');
if (!fs.existsSync(cd)) fs.mkdirSync(cd, { recursive: true });
fs.writeFileSync(path.join(cd, 'SKILL.md'), buildConfigSkill(), 'utf8');
total++;

console.log('Generated ' + total + ' unified SKILL.md files (locale: ' + localeData.locale.name + ') -> ' + OUT_DIR + '/');
console.log('  ' + Object.keys(groups).length + ' role skills + hsd-config');
