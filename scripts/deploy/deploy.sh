#!/usr/bin/env bash
#
# Deploy the AutoSPA frontend on the production server.
#
# The code is pushed into a release directory (by the GitHub Actions runner
# or by hand), and this script turns that release into the live one:
#
#   1. it takes the deploy lock, so two deploys never overlap,
#   2. it installs the dependencies and builds the release,
#   3. it checks the build before it is allowed to go live,
#   4. it switches `current` to the new release (atomically),
#   5. it restarts pm2 and watches the site come back up,
#   6. if the site does not answer, it switches back to the old release.
#
# The live site is never built over: every deploy gets its own directory
# under `releases/`, and the old one stays on disk as the rollback.
#
# Usage:
#   bash scripts/deploy/deploy.sh <release-directory>
#
# Example:
#   bash scripts/deploy/deploy.sh 20261030-201500-a1b2c3d

set -euo pipefail

APP_ROOT=/www/wwwroot/autospa-frontend
RELEASES_DIR="$APP_ROOT/releases"
SHARED_DIR="$APP_ROOT/shared"
CURRENT_LINK="$APP_ROOT/current"
LOCK_FILE="$APP_ROOT/.deploy.lock"

NODE_BIN=/www/server/nodejs/v20.20.2/bin
PM2_BIN=/www/server/nodejs/v22.23.3/bin

# How many releases are kept on disk (the live one plus the rollback).
KEEP_RELEASES=3

# The port the application listens on (the nginx vhost proxies to it).
APP_PORT=8089

# The markers the built pages have to carry. A build that does not contain
# them is a build of the wrong code - it never goes live.
REQUIRED_MARKERS=(
	'footer-big-text'
	'Quick links'
)

log() { printf '[deploy] %s\n' "$*"; }
fail() { printf '[deploy] ERROR: %s\n' "$*" >&2; exit 1; }

RELEASE_NAME="${1:-}"
[ -n "$RELEASE_NAME" ] || fail "usage: bash scripts/deploy/deploy.sh <release-directory>"
case "$RELEASE_NAME" in
	*/* | *..*) fail "the release name may not contain a path" ;;
esac

RELEASE_DIR="$RELEASES_DIR/$RELEASE_NAME"
[ -d "$RELEASE_DIR" ] || fail "the release $RELEASE_NAME does not exist"
[ -f "$RELEASE_DIR/package.json" ] || fail "$RELEASE_NAME is not an application"

# ───────────────────────────────────────────────
# 1. The lock.
# ───────────────────────────────────────────────
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
	fail "another deploy is running - the lock $LOCK_FILE is held"
fi
log "the deploy lock is taken"

mkdir -p "$RELEASES_DIR" "$SHARED_DIR"

# The release that is live right now - it is the fallback if anything goes
# wrong further down.
PREVIOUS_RELEASE=""
if [ -L "$CURRENT_LINK" ]; then
	PREVIOUS_RELEASE="$(readlink -f "$CURRENT_LINK")"
fi
log "the live release is ${PREVIOUS_RELEASE:-none}"

# ───────────────────────────────────────────────
# 2. The dependencies.
# ───────────────────────────────────────────────
log "installing the dependencies"
su -s /bin/bash www -c "cd '$RELEASE_DIR' && export PATH=$NODE_BIN:\$PATH && npm ci"

# The mirror of the CMS (the fonts, the uploads and the theme assets of the
# WordPress pages) is not in git - it is copied from the shared directory,
# so a fresh release serves the mirrored pages as well.
if [ -d "$SHARED_DIR/public/wp-content" ]; then
	log "copying the CMS mirror"
	rm -rf "$RELEASE_DIR/public/wp-content"
	mkdir -p "$RELEASE_DIR/public"
	cp -a "$SHARED_DIR/public/wp-content" "$RELEASE_DIR/public/wp-content"
elif [ -d "$PREVIOUS_RELEASE/public/wp-content" ]; then
	log "copying the CMS mirror from the previous release"
	cp -a "$PREVIOUS_RELEASE/public/wp-content" "$RELEASE_DIR/public/wp-content"
else
	log "WARNING: there is no CMS mirror - the mirrored pages will miss their assets"
fi

# ───────────────────────────────────────────────
# 3. The build.
# ───────────────────────────────────────────────
log "building the release (this takes about two minutes)"
su -s /bin/bash www -c "cd '$RELEASE_DIR' && export PATH=$NODE_BIN:\$PATH && NODE_OPTIONS=--max-old-space-size=2048 nice -n 15 npm run build"

[ -f "$RELEASE_DIR/.next/BUILD_ID" ] || fail "the build did not produce a BUILD_ID"

# ───────────────────────────────────────────────
# 4. The check - the build has to carry the new code.
# ───────────────────────────────────────────────
log "checking the build"
INDEX_HTML="$RELEASE_DIR/.next/server/app/index.html"
[ -f "$INDEX_HTML" ] || fail "the build did not produce the homepage"

for marker in "${REQUIRED_MARKERS[@]}"; do
	if ! grep -q "$marker" "$INDEX_HTML"; then
		fail "the homepage does not carry the marker '$marker' - the build is not the expected code"
	fi
done
log "the build carries every marker"

# ───────────────────────────────────────────────
# 5. The switch - the release goes live.
# ───────────────────────────────────────────────
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK.new"
mv -Tf "$CURRENT_LINK.new" "$CURRENT_LINK"
log "current now points at $RELEASE_DIR"

# ───────────────────────────────────────────────
# 6. The restart and the health check.
# ───────────────────────────────────────────────
su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 restart autospa-web"

log "waiting for the site to answer"
OK=0
for _ in $(seq 1 30); do
	sleep 2
	CODE="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$APP_PORT/" || true)"
	if [ "$CODE" = "200" ]; then
		OK=1
		break
	fi
done

if [ "$OK" != "1" ]; then
	log "the site did not answer - rolling back to the previous release"
	if [ -n "$PREVIOUS_RELEASE" ]; then
		ln -sfn "$PREVIOUS_RELEASE" "$CURRENT_LINK.new"
		mv -Tf "$CURRENT_LINK.new" "$CURRENT_LINK"
		su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 restart autospa-web"
		sleep 5
	fi
	fail "the new release did not come up"
fi
log "the site answers with 200"

# ───────────────────────────────────────────────
# 7. The cleanup - the old releases are pruned.
# ───────────────────────────────────────────────
log "pruning the old releases"
cd "$RELEASES_DIR"
ls -1dt */ 2>/dev/null | tail -n "+$KEEP_RELEASES" | while read -r old; do
	[ "$old" = "$(basename "$RELEASE_DIR")/" ] && continue
	log "removing the release $old"
	rm -rf "$RELEASES_DIR/$old"
done

log "the deployment of $RELEASE_NAME is done"
