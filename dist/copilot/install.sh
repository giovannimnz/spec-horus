#!/usr/bin/env bash
# Horus Spec Driven — GitHub Copilot Installer v5.0
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PD=${PWD}/.github/prompts
AD=${PWD}/.github/agents
echo "Installing HSD v5.0 for GitHub Copilot..."
mkdir -p "$PD" "$AD"
cp "$SCRIPT_DIR"/prompts/*.md "$PD/"
cp "$SCRIPT_DIR"/agents/*.md "$AD/" 2>/dev/null || true
echo "✓ $(ls "$SCRIPT_DIR"/prompts/ | wc -l) prompts installed"
