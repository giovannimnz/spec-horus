'use strict';
const fs = require('fs');
const path = require('path');

function handle(args, cwd) {
  const sub = args[0];
  if (sub === 'complete') {
    const version = args[1];
    const nameIdx = args.indexOf('--name');
    const name = nameIdx !== -1 ? args[nameIdx + 1] : `Milestone ${version}`;
    const archive = args.includes('--archive-phases');
    // Archive logic: create MILESTONES.md if not exists, append entry
    const mf = path.join(cwd, '.planning', 'MILESTONES.md');
    const entry = `\n## ${version}: ${name}\nCompleted: ${new Date().toISOString().split('T')[0]}\nPhases archived: ${archive ? 'yes' : 'no'}\n`;
    fs.appendFileSync(mf, entry);
    if (archive) {
      const phasesDir = path.join(cwd, '.planning', 'phases');
      const archiveDir = path.join(cwd, '.planning', '.archive', version);
      if (fs.existsSync(phasesDir) && !fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
        // Copy phase dirs to archive
        for (const d of fs.readdirSync(phasesDir, { withFileTypes: true })) {
          if (d.isDirectory()) {
            fs.cpSync(path.join(phasesDir, d.name), path.join(archiveDir, d.name), { recursive: true });
            fs.rmSync(path.join(phasesDir, d.name), { recursive: true });
          }
        }
      }
    }
    return { completed: true, milestone: version, name, archived: archive };
  }
  return { error: `unknown milestone subcommand: ${sub}` };
}

function requirements(args, cwd) {
  const sub = args[0];
  if (sub === 'mark-complete') {
    const ids = args.slice(1).filter(a => !a.startsWith('--'));
    const reqFile = path.join(cwd, '.planning', 'REQUIREMENTS.md');
    if (!fs.existsSync(reqFile)) return { error: 'REQUIREMENTS.md not found' };
    let content = fs.readFileSync(reqFile, 'utf8');
    for (const id of ids) {
      const re = new RegExp(`- \\[ \\] \\*\\*${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\*`, 'g');
      content = content.replace(re, `- [x] **${id}**`);
      content = content.replace(new RegExp(`- \\[ \\] ${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'), `- [x] ${id}`);
    }
    fs.writeFileSync(reqFile, content);
    return { marked_complete: ids };
  }
  return { error: 'unknown requirements subcommand' };
}

module.exports = { handle, requirements };
