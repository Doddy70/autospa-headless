#!/usr/bin/env bash
#
# The deploy script of the AutoSPA frontend for aaPanel.
#
# The aaPanel webhook plugin runs it (the URL of the hook is registered as a
# webhook of the GitHub repository, so a push to `main` lands here):
#
#   1. it pulls the repository - the directory of the site is the clone,
#   2. it hands the clone over to the deploy engine, which builds it, checks
#      it and puts it live (and rolls it back if the site does not come up).
#
# The engine is `scripts/deploy/deploy.sh` - the same one the GitHub
# Actions pipeline uses, so both ways of deploying produce the same result.
#
# The path of the repository is taken from the first argument, or from the
# current directory.

set -uo pipefail

# The branch that is deployed.
BRANCH="${BRANCH:-main}"

# The directory of the repository. The panel clones the repository into the
# directory of the site, so this is where the build lives.
if [ -n "${1:-}" ]; then
	SITE_DIR="$1"
elif [ -d ".git" ]; then
	SITE_DIR="$(pwd)"
elif [ -d "/www/wwwroot/autospajakarta.com/.git" ]; then
	SITE_DIR="/www/wwwroot/autospajakarta.com"
else
	echo "[deploy] ERROR: the directory of the repository is unknown - pass it as the first argument" >&2
	exit 1
fi
cd "$SITE_DIR" || { echo "[deploy] ERROR: $SITE_DIR does not exist" >&2; exit 1; }

log() { printf '[deploy] %s\n' "$*"; }
fail() { printf '[deploy] ERROR: %s\n' "$*" >&2; exit 1; }

log "the repository is $SITE_DIR"

# ───────────────────────────────────────────────
# 1. The pull.
# ───────────────────────────────────────────────
log "pulling the branch $BRANCH"
su -s /bin/bash www -c "cd '$SITE_DIR' && git fetch origin '$BRANCH' --prune && git reset --hard 'origin/$BRANCH'" \
	|| fail "the pull failed"
COMMIT="$(su -s /bin/bash www -c "cd '$SITE_DIR' && git rev-parse --short HEAD")"
log "the commit is $COMMIT"

# ───────────────────────────────────────────────
# 2. The build, the check and the switch.
# ───────────────────────────────────────────────
# The engine copies the clone into a release directory of its own, builds it
# and swaps it with the live one. The live site keeps serving the old build
# while the new one is made.
ENGINE="$SITE_DIR/scripts/deploy/deploy.sh"
[ -f "$ENGINE" ] || fail "the deploy engine $ENGINE does not exist"

bash "$ENGINE" "$SITE_DIR" "$(date +%Y%m%d-%H%M%S)-$COMMIT" || fail "the deployment of $COMMIT failed"

log "the deployment of $COMMIT is done"
log "status: success"
