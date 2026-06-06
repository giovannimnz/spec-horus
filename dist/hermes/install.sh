#!/usr/bin/env bash
# Horus Spec Driven — Hermes Agent Installer v5.0
set -euo pipefail
HD=${HERMES_HOME:-$HOME/.hermes}/skills/hsd
AD=${HERMES_HOME:-$HOME/.hermes}/agents
echo "Installing HSD v5.0 for Hermes Agent..."
mkdir -p "$HD" "$AD" "$HD/horus-sdk-hermes"
cp -r dist/hermes/skills/hsd/* "$HD/"
cp dist/hermes/agents/*.md "$AD/" 2>/dev/null || true
cp -r dist/hermes/adapter/* "$HD/horus-sdk-hermes/" 2>/dev/null || true
echo "✓ $(ls "$HD" | wc -l) skills + agents installed"
echo "  Restart Hermes or run /reload_skills"
