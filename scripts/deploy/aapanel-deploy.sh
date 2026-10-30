#!/usr/bin/env bash
#
# The deploy script of the AutoSPA frontend (the aaPanel Git Manager runs it
# after it pulls the repository).
#
# The panel does the pull - this script does the rest:
#
#   1. it makes sure the files that are not in git are in place
#      (the environment of the production and the mirror of the CMS),
#   2. it builds the new version next to the live one, so the site keeps
#      serving the old build while the new one is built,
#   3. it checks the new build before it is allowed to go live,
#   4. it swaps the two builds and restarts pm2,
#   5. if the site does not come up, it swaps them back.
#
# The path of the site directory is taken from the first argument, or from
# the current directory (the panel runs the script inside the site).

set -uo pipefail

SITE_DIR="${1:-$(pwd)}"
cd "$SITE_DIR" || { echo "[deploy] ERROR: $SITE_DIR does not exist" >&2; exit 1; }

NODE_BIN=/www/server/nodejs/v20.20.2/bin
PM2_BIN=/www/server/nodejs/v22.23.3/bin

# The files that are not in git. The backup of them is made outside the
# repository, so a fresh clone does not lose them.
BACKUP_DIR=/www/backup/autospa-frontend/20261030-pre-gitreset

# The markers the built pages have to carry. A build without them is a
# build of the wrong code - it never goes live.
REQUIRED_MARKERS=(
	'footer-big-text'
	'Quick links'
)

# The port the application listens on (the nginx vhost proxies to it).
APP_PORT=8089

log() { printf '[deploy] %s\n' "$*"; }
fail() { printf '[deploy] ERROR: %s\n' "$*" >&2; exit 1; }

log "the site directory is $SITE_DIR"

# ───────────────────────────────────────────────
# 1. The files that are not in git.
# ───────────────────────────────────────────────
if [ ! -f .env.production ] && [ -f "$BACKUP_DIR/.env.production" ]; then
	log "restoring the environment of the production"
	cp -a "$BACKUP_DIR/.env.production" .env.production
fi
[ -f .env.production ] || fail "there is no .env.production and no backup of it"

if [ ! -d public/wp-content ] && [ -d "$BACKUP_DIR/wp-content" ]; then
	log "restoring the mirror of the CMS"
	cp -a "$BACKUP_DIR/wp-content" public/wp-content
fi

# ───────────────────────────────────────────────
# 2. The build - next to the live one.
# ───────────────────────────────────────────────
log "installing the dependencies"
su -s /bin/bash www -c "cd '$SITE_DIR' && export PATH=$NODE_BIN:\$PATH && npm ci" || fail "npm ci failed"

log "building the new version (about two minutes)"
rm -rf .next.new
su -s /bin/bash www -c "cd '$SITE_DIR' && export PATH=$NODE_BIN:\$PATH && NEXT_DIST_DIR=.next.new NODE_OPTIONS=--max-old-space-size=2048 nice -n 15 npm run build" || fail "the build failed - the live version keeps running"

[ -f .next.new/BUILD_ID ] || fail "the build did not produce a BUILD_ID"

# ───────────────────────────────────────────────
# 3. The check.
# ───────────────────────────────────────────────
INDEX_HTML="$SITE_DIR/.next.new/server/app/index.html"
[ -f "$INDEX_HTML" ] || fail "the build did not produce the homepage"

for marker in "${REQUIRED_MARKERS[@]}"; do
	grep -q "$marker" "$INDEX_HTML" || fail "the homepage does not carry '$marker' - the build is not the expected code"
done
log "the build carries every marker"

# ───────────────────────────────────────────────
# 4. The swap - the new build goes live.
# ───────────────────────────────────────────────
log "swapping the build"
rm -rf .next.prev
if [ -d .next ]; then mv .next .next.prev; fi
mv .next.new .next
chown -R www:www .next

su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 restart autospa-web" || fail "pm2 could not be restarted"

# ───────────────────────────────────────────────
# 5. The health check - and the way back.
# ───────────────────────────────────────────────
log "waiting for the site to answer"
OK=0
for _ in $(seq 1 30); do
	sleep 2
	CODE="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$APP_PORT/" || true)"
	if [ "$CODE" = "200" ]; then OK=1; break; fi
done

if [ "$OK" != "1" ]; then
	log "the site did not answer - the previous build goes back"
	rm -rf .next
	if [ -d .next.prev ]; then mv .next.prev .next; chown -R www:www .next; fi
	su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 restart autospa-web"
	sleep 5
	fail "the new build did not come up"
fi
log "the site answers with 200"

rm -rf .next.prev
log "the deployment is done"
