'use strict';
const fs = require('fs');
const path = require('path');

function handle(args, cwd) {
  const sub = args[0];
  const phaseIdx = args.indexOf('--phase');
  const phase = phaseIdx !== -1 ? args[phaseIdx + 1] : null;
  const nameIdx = args.indexOf('--name');
  const name = nameIdx !== -1 ? args[nameIdx + 1] : null;

  if (sub === 'context') {
    const dir = ensurePhaseDir(cwd, phase, name);
    const file = path.join(dir, `${String(phase).padStart(2, '0')}-CONTEXT.md`);
    fs.writeFileSync(file, `---\nphase: ${phase}\ngathered: ${new Date().toISOString().split('T')[0]}\n---\n\n# Phase ${phase}: ${name || ''} - Context\n\n## Phase Boundary\n\n## Implementation Decisions\n\n`);
    return { created: file };
  }
  if (sub === 'uat') {
    const dir = ensurePhaseDir(cwd, phase, name);
    const file = path.join(dir, `${String(phase).padStart(2, '0')}-UAT.md`);
    fs.writeFileSync(file, `# Phase ${phase}: UAT\n\n- [ ] acceptance criteria 1\n- [ ] acceptance criteria 2\n`);
    return { created: file };
  }
  if (sub === 'verification') {
    const dir = ensurePhaseDir(cwd, phase, name);
    const file = path.join(dir, `${String(phase).padStart(2, '0')}-VERIFICATION.md`);
    fs.writeFileSync(file, `---\nphase: ${phase}\nstatus: pending\n---\n\n# Phase ${phase}: Verification\n\n`);
    return { created: file };
  }
  if (sub === 'phase-dir') {
    const dir = ensurePhaseDir(cwd, phase, name);
    return { created: dir };
  }
  return { error: `unknown scaffold subcommand: ${sub}` };
}

function ensurePhaseDir(cwd, phase, name) {
  const dir = path.join(cwd, '.planning', 'phases', `${String(phase).padStart(2, '0')}-${(name || 'unnamed').toLowerCase().replace(/\s+/g, '-')}`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

module.exports = { handle };
