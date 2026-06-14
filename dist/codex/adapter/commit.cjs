'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function handle(args, cwd) {
  const amend = args.includes('--amend');
  const noVerify = args.includes('--no-verify');
  const filesIdx = args.indexOf('--files');
  const messageArgs = args.filter((a, i) => i > 0 && i < (filesIdx !== -1 ? filesIdx : args.length) && !a.startsWith('--'));
  const message = messageArgs.join(' ') || 'chore: commit';
  const files = filesIdx !== -1 ? args.slice(filesIdx + 1).filter(a => !a.startsWith('--')) : [];
  if (files.length) {
    execSync(`git -C "${cwd}" add ${files.map(f => `"${f}"`).join(' ')}`, { stdio: 'pipe' });
  }
  const cmd = `git -C "${cwd}" commit -m "${message.replace(/"/g, '\\"')}"${amend ? ' --amend' : ''}${noVerify ? ' --no-verify' : ''}`;
  try {
    execSync(cmd, { stdio: 'pipe' });
    return { committed: true, message };
  } catch (e) {
    return { committed: false, error: e.stderr?.toString() || e.message };
  }
}

function subrepo(args, cwd) {
  const subrepo = args[0];
  const filesIdx = args.indexOf('--files');
  const messageArgs = args.filter(a => !a.startsWith('--') && a !== subrepo);
  const message = messageArgs.slice(1).join(' ') || 'chore: subrepo commit';
  const files = filesIdx !== -1 ? args.slice(filesIdx + 1).filter(a => !a.startsWith('--')) : [];
  const repoPath = path.join(cwd, subrepo);
  if (files.length) execSync(`git -C "${repoPath}" add ${files.map(f => `"${f}"`).join(' ')}`, { stdio: 'pipe' });
  try {
    execSync(`git -C "${repoPath}" commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: 'pipe' });
    return { committed: true, subrepo, message };
  } catch (e) {
    return { committed: false, error: e.stderr?.toString() || e.message };
  }
}

function check(cwd) {
  try {
    const out = execSync(`git -C "${cwd}" status --porcelain`, { stdio: 'pipe' }).toString();
    return { can_commit: out.trim() === '', dirty_files: out.trim().split('\n').filter(Boolean).length };
  } catch (e) {
    return { can_commit: false, error: e.stderr?.toString() };
  }
}

module.exports = { handle, subrepo, check };
