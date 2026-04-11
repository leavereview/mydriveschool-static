#!/bin/bash
# =============================================================================
# DriveSchoolPro — Pillar Content Build & Deploy Pipeline
#
# Runs 4 Claude Code prompts in sequence. Each prompt handles its own
# validation, commit, build, and deploy (Claude Code knows the Lightsail config).
#
# Usage:
#   chmod +x run-pillar-prompts.sh
#   ./run-pillar-prompts.sh
#
# Prerequisites:
#   - Claude Code CLI installed and authenticated
#   - Inside the mydriveschool.software Astro project root
#   - Git working tree clean
# =============================================================================

set -euo pipefail

PROJECT_DIR="$(pwd)"
PROMPT_DIR="$PROJECT_DIR/files"
LOG_FILE="$PROJECT_DIR/pillar-build-$(date +%Y%m%d-%H%M%S).log"

PROMPTS=(
  "CC-Prompt-Pillar-Start-Driving-School.md"
  "CC-Prompt-Pillar-Reduce-No-Shows.md"
  "CC-Prompt-Pillar-Switch-Paper-To-Software.md"
  "CC-Prompt-Fix-Stale-CTAs-CrossLinks.md"
)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "[$(date +%H:%M:%S)] $1" | tee -a "$LOG_FILE"; }

# --- PRE-FLIGHT ---
log "Starting pipeline..."

git rev-parse --is-inside-work-tree > /dev/null 2>&1 || { log "${RED}✗ Not a git repo${NC}"; exit 1; }
command -v claude > /dev/null 2>&1 || { log "${RED}✗ Claude Code CLI not found${NC}"; exit 1; }

for prompt in "${PROMPTS[@]}"; do
  [ -f "$PROMPT_DIR/$prompt" ] || { log "${RED}✗ Missing: $PROMPT_DIR/$prompt${NC}"; exit 1; }
done

if [ -n "$(git status --porcelain)" ]; then
  log "${YELLOW}⚠ Uncommitted changes — committing first${NC}"
  git add -A && git commit -m "chore: save work before pillar content pipeline"
fi

log "${GREEN}✓ Pre-flight passed — ${#PROMPTS[@]} prompts queued${NC}"
echo ""

# --- RUN EACH PROMPT ---
for i in "${!PROMPTS[@]}"; do
  step=$((i + 1))
  prompt="${PROMPTS[$i]}"

  log "${YELLOW}[$step/${#PROMPTS[@]}] Running: $prompt${NC}"

  claude --dangerously-skip-permissions -p \
    "Read and execute ALL instructions in the following prompt file. Follow every phase in order. After completing all phases, commit the changes, build the site, and deploy to Lightsail using the standard rsync deployment process.

$(cat "$PROMPT_DIR/$prompt")" \
    >> "$LOG_FILE" 2>&1

  if [ $? -eq 0 ]; then
    log "${GREEN}✓ Completed: $prompt${NC}"
  else
    log "${RED}✗ Failed: $prompt — check $LOG_FILE${NC}"
    exit 1
  fi

  echo ""
done

# --- DONE ---
log "${GREEN}═══════════════════════════════════════════${NC}"
log "${GREEN}Pipeline complete — all ${#PROMPTS[@]} prompts executed${NC}"
log "${GREEN}═══════════════════════════════════════════${NC}"
log ""
log "New pages:"
log "  /blog/how-to-start-a-driving-school"
log "  /blog/reduce-driving-lesson-no-shows"
log "  /blog/switch-paper-diary-to-driving-school-software"
log ""
log "Log: $LOG_FILE"
