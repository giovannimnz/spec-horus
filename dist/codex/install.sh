#!/usr/bin/env bash
# Horus Spec Driven — Codex CLI Installer v5.0
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PD=${CODEX_HOME:-$HOME/.codex}/prompts
AD=${CODEX_HOME:-$HOME/.codex}/agents
SD=${CODEX_HOME:-$HOME/.codex}/skills/horus-sdk-codex
echo "Installing HSD v5.0 for Codex CLI..."
mkdir -p "$PD" "$AD" "$SD"
cp "$SCRIPT_DIR"/prompts/*.md "$PD/"
cp "$SCRIPT_DIR"/agents/*.md "$AD/" 2>/dev/null || true
cp -r "$SCRIPT_DIR"/adapter/* "$SD/"
echo "✓ $(ls "$SCRIPT_DIR"/prompts/ | wc -l) prompts + $(ls "$SCRIPT_DIR"/agents/ | wc -l) agents + horus-sdk-codex installed"
