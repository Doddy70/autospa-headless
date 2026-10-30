#!/usr/bin/env bash
#
# The deploy engine of the AutoSPA frontend.
#
# It turns a directory that holds the source of the site into the live
# release:
#
#   1. it takes the deploy lock, so two deploys never overlap,
#   2. it copies the source into a release directory of its own (a source
#      that already lives under `releases/` is used where it is),
#   3. it puts the files that are not in git back - the environment of the
#      production and the mirror of the CMS,
#   4. it installs the dependencies and builds the release,
#   5. it checks the build before it is allowed to go live,
#   6. it switches `current` to the new release (atomically) and restarts
#      pm2,
#   7. if the site does not answer, it switches back to the old release.
#
# The live site is never built over: every deploy gets its own directory
# under `releases/`, and the old one stays on disk as the rollback.
#
# The two callers of this engine:
#
#   - `.github/workflows/deploy.yml` (the push to `main`),
#   - `scripts/deploy/aapanel-deploy.sh` (the webhook of aaPanel, or a
#     deployment by hand).
#
# Usage:
#   bash scripts/deploy/deploy.sh <source-directory> [release-name]
#
# Example:
#   bash scripts/deploy/deploy.sh /www/wwwroot/autospajakarta.com
#   bash scripts/deploy/deploy.sh /tmp/autospa-frontend 20261030-201500-a1b2c3d

set -euo pipefail

# The root of the deployment on the server. Everything else hangs under it.
APP_ROOT="${APP_ROOT:-/www/wwwroot/autospa-frontend}"
RELEASES_DIR="$APP_ROOT/releases"
SHARED_DIR="$APP_ROOT/shared"
CURRENT_LINK="$APP_ROOT/current"
LOCK_FILE="$APP_ROOT/.deploy.lock"

# The launcher of pm2. It is a stable path - the release underneath it is
# swapped, not the path itself.
RUN_SCRIPT="$APP_ROOT/run.sh"

NODE_BIN=/www/server/nodejs/v20.20.2/bin
PM2_BIN=/www/server/nodejs/v22.23.3/bin

# How many releases are kept on disk (the live one plus the rollback).
KEEP_RELEASES=3

# The port the application listens on (the nginx vhost proxies to it).
APP_PORT="${APP_PORT:-8089}"

# The markers the built pages have to carry. A build that does not contain
# them is a build of the wrong code - it never goes live.
REQUIRED_MARKERS=(
	'footer-big-text'
	'Quick links'
)

log() { printf '[deploy] %s\n' "$*"; }
fail() { printf '[deploy] ERROR: %s\n' "$*" >&2; exit 1; }

SOURCE_DIR="${1:-}"
[ -n "$SOURCE_DIR" ] || fail "usage: bash scripts/deploy/deploy.sh <source-directory> [release-name]"
SOURCE_DIR="$(cd "$SOURCE_DIR" 2>/dev/null && pwd -P)" || fail "the source $SOURCE_DIR does not exist"
[ -f "$SOURCE_DIR/package.json" ] || fail "$SOURCE_DIR is not an application"

# ───────────────────────────────────────────────
# 1. The name of the release and the lock.
# ───────────────────────────────────────────────
if [ -n "${2:-}" ]; then
	RELEASE_NAME="$2"
else
	COMMIT="$(cd "$SOURCE_DIR" && git rev-parse --short HEAD 2>/dev/null || echo nogit)"
	RELEASE_NAME="$(date +%Y%m%d-%H%M%S)-$COMMIT"
fi
case "$RELEASE_NAME" in
	*/* | *..*) fail "the release name may not contain a path" ;;
esac

mkdir -p "$APP_ROOT"
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
# 2. The release directory.
# ───────────────────────────────────────────────
RELEASE_DIR="$RELEASES_DIR/$RELEASE_NAME"

case "$SOURCE_DIR/" in
	"$RELEASES_DIR"/*)
		# The source is already a release (the runner pushed it into place) -
		# it is used where it is.
		RELEASE_DIR="$SOURCE_DIR"
		RELEASE_NAME="$(basename "$RELEASE_DIR")"
		log "the release directory is $RELEASE_DIR (the source is already a release)"
		;;
	*)
		log "copying the source into the release $RELEASE_NAME"
		mkdir -p "$RELEASE_DIR"
		if command -v rsync >/dev/null 2>&1; then
			rsync -a --delete \
				--exclude '.git' \
				--exclude 'node_modules' \
				--exclude '.next' \
				--exclude '.next-*' \
				--exclude '.cache' \
				--exclude '.remember' \
				--exclude '.claude' \
				--exclude 'tmp' \
				--exclude 'test-results' \
				--exclude 'playwright-report' \
				--exclude 'tsconfig.tsbuildinfo' \
				--exclude '.env.local' \
				--exclude '.env.production' \
				--exclude '*.tar.gz' \
				"$SOURCE_DIR/" "$RELEASE_DIR/"
		else
			# rsync is not everywhere - a plain copy has to do then.
			log "rsync is not on this machine - the source is copied"
			rm -rf "$RELEASE_DIR"
			mkdir -p "$RELEASE_DIR"
			tar -C "$SOURCE_DIR" \
				--exclude './.git' \
				--exclude './node_modules' \
				--exclude './.next' \
				--exclude './.next-*' \
				--exclude './.cache' \
				--exclude './.remember' \
				--exclude './.claude' \
				--exclude './tmp' \
				--exclude './test-results' \
				--exclude './playwright-report' \
				--exclude './tsconfig.tsbuildinfo' \
				--exclude './.env.local' \
				--exclude './.env.production' \
				--exclude '*.tar.gz' \
				-cf - . | tar -C "$RELEASE_DIR" -xf -
		fi
		;;
esac
chown -R www:www "$RELEASE_DIR"

# ───────────────────────────────────────────────
# 3. The files that are not in git.
# ───────────────────────────────────────────────
# The environment of the production and the mirror of the CMS live in the
# shared directory, so they survive a fresh clone of the repository.
if [ ! -f "$SHARED_DIR/.env.production" ] && [ -f "$SOURCE_DIR/.env.production" ]; then
	log "taking the environment of the production from the source"
	cp -a "$SOURCE_DIR/.env.production" "$SHARED_DIR/.env.production"
fi
if [ ! -f "$SHARED_DIR/.env.production" ] && [ -f "$PREVIOUS_RELEASE/.env.production" ]; then
	log "taking the environment of the production from the live release"
	cp -a "$PREVIOUS_RELEASE/.env.production" "$SHARED_DIR/.env.production"
fi
[ -f "$SHARED_DIR/.env.production" ] || fail "there is no .env.production in $SHARED_DIR and no source of it"

if [ ! -d "$SHARED_DIR/public/wp-content" ] && [ -d "$SOURCE_DIR/public/wp-content" ]; then
	log "taking the mirror of the CMS from the source"
	mkdir -p "$SHARED_DIR/public"
	cp -a "$SOURCE_DIR/public/wp-content" "$SHARED_DIR/public/wp-content"
fi

cp -a "$SHARED_DIR/.env.production" "$RELEASE_DIR/.env.production"
if [ -d "$SHARED_DIR/public/wp-content" ]; then
	rm -rf "$RELEASE_DIR/public/wp-content"
	mkdir -p "$RELEASE_DIR/public"
	cp -a "$SHARED_DIR/public/wp-content" "$RELEASE_DIR/public/wp-content"
elif [ -d "$PREVIOUS_RELEASE/public/wp-content" ]; then
	log "copying the mirror of the CMS from the previous release"
	cp -a "$PREVIOUS_RELEASE/public/wp-content" "$RELEASE_DIR/public/wp-content"
else
	log "WARNING: there is no mirror of the CMS - the mirrored pages will miss their assets"
fi
chown -R www:www "$RELEASE_DIR"

# ───────────────────────────────────────────────
# 4. The dependencies and the build.
# ───────────────────────────────────────────────
log "installing the dependencies"
su -s /bin/bash www -c "cd '$RELEASE_DIR' && export PATH=$NODE_BIN:\$PATH && npm ci"

log "building the release (this takes about two minutes)"
su -s /bin/bash www -c "cd '$RELEASE_DIR' && export PATH=$NODE_BIN:\$PATH && NODE_OPTIONS=--max-old-space-size=2048 nice -n 15 npm run build"

[ -f "$RELEASE_DIR/.next/BUILD_ID" ] || fail "the build did not produce a BUILD_ID"

# ───────────────────────────────────────────────
# 5. The check - the build has to carry the new code.
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
# 6. The switch - the release goes live.
# ───────────────────────────────────────────────
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK.new"
mv -Tf "$CURRENT_LINK.new" "$CURRENT_LINK"
log "current now points at $RELEASE_DIR"

# ───────────────────────────────────────────────
# 7. The application.
# ───────────────────────────────────────────────
# pm2 runs a stable launcher, which enters the release that `current` points
# at. The release is swapped under it, the path of the process is not.
if [ -f "$RELEASE_DIR/start.sh" ]; then
	{
		printf '#!/usr/bin/env bash\n'
		printf '# The launcher of the application - it enters the release that is live.\n'
		printf 'exec "%s/current/start.sh" "$@"\n' "$APP_ROOT"
	} > "$RUN_SCRIPT"
	chmod 755 "$RUN_SCRIPT"
	chmod 755 "$RELEASE_DIR/start.sh"
fi

# The path the application is started from. It is read from pm2 itself, so a
# change of the launcher is noticed. The table of pm2 ends every line with a
# separator, so the path is the field that looks like a path.
PM2_SCRIPT="$(su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 describe autospa-web" 2>/dev/null \
	| awk -F'│' '/script path/ {
		for (i = 1; i <= NF; i++) {
			gsub(/^[ \t]+|[ \t]+$/, "", $i)
			if ($i ~ /^\//) { print $i; exit }
		}
	}' || true)"
case "$PM2_SCRIPT" in
	/*) ;;
	*) PM2_SCRIPT="" ;;
esac

# How many processes carry the name. Two of them would fight over the port,
# so the duplicates are removed before the application is started.
PM2_COUNT="$(su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 jlist" 2>/dev/null \
	| node -e 'let s=""; process.stdin.on("data", d => s += d).on("end", () => {
		try { console.log(JSON.parse(s).filter(p => p && p.name === "autospa-web").length) }
		catch (e) { console.log(0) }
	})' || true)"
case "$PM2_COUNT" in
	'' | *[!0-9]*) PM2_COUNT=0 ;;
esac

if [ "$PM2_COUNT" -gt 1 ]; then
	log "there are $PM2_COUNT processes named autospa-web - the duplicates are removed"
	su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 delete autospa-web"
	PM2_SCRIPT=""
elif [ -n "$PM2_SCRIPT" ] && [ "$PM2_SCRIPT" != "$RUN_SCRIPT" ]; then
	log "the application still points at $PM2_SCRIPT - it is replaced by $RUN_SCRIPT"
	su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 delete autospa-web"
	PM2_SCRIPT=""
fi

if [ -z "$PM2_SCRIPT" ]; then
	log "starting the application"
	# The working directory is given to pm2 on purpose: it inherits the one
	# of the shell otherwise, and a directory the user `www` may not enter
	# kills the process the moment it starts.
	su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 start '$RUN_SCRIPT' --name autospa-web --interpreter /bin/bash --cwd '$APP_ROOT' && pm2 save" \
		|| fail "the application could not be started"
else
	log "restarting the application"
	su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 restart autospa-web && pm2 save" || fail "pm2 could not be restarted"
fi

# ───────────────────────────────────────────────
# 8. The health check - and the way back.
# ───────────────────────────────────────────────
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
	if [ -n "$PREVIOUS_RELEASE" ] && [ -d "$PREVIOUS_RELEASE" ]; then
		ln -sfn "$PREVIOUS_RELEASE" "$CURRENT_LINK.new"
		mv -Tf "$CURRENT_LINK.new" "$CURRENT_LINK"
		su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 restart autospa-web"
		sleep 5
	fi
	fail "the new release did not come up"
fi
log "the site answers with 200"

# The answer has to come from the application that was just started - a
# process that still holds the port from the release before would answer
# just as well.
PORT_PID="$(ss -lntp 2>/dev/null | grep ":$APP_PORT " | sed -n 's/.*pid=\([0-9]\{1,\}\).*/\1/p' | head -1)"
PM2_PIDS="$(su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 pid autospa-web" 2>/dev/null | tr -d ' ' || true)"
if [ -n "$PORT_PID" ] && [ -n "$PM2_PIDS" ]; then
	case " $PM2_PIDS " in
		*" $PORT_PID "*)
			log "the port $APP_PORT is held by the application (pid $PORT_PID)"
			;;
		*)
			log "the port $APP_PORT is held by another process (pid $PORT_PID, the application is $PM2_PIDS)"
			if [ -n "$PREVIOUS_RELEASE" ] && [ -d "$PREVIOUS_RELEASE" ]; then
				ln -sfn "$PREVIOUS_RELEASE" "$CURRENT_LINK.new"
				mv -Tf "$CURRENT_LINK.new" "$CURRENT_LINK"
				su -s /bin/bash www -c "export PATH=$PM2_BIN:\$PATH; pm2 restart autospa-web"
				sleep 5
			fi
			fail "the release did not take over the port $APP_PORT"
			;;
	esac
fi

# ───────────────────────────────────────────────
# 9. The cleanup - the old releases are pruned.
# ───────────────────────────────────────────────
log "pruning the old releases"
cd "$RELEASES_DIR"
for old in $(ls -1dt */ 2>/dev/null | tail -n "+$((KEEP_RELEASES + 1))"); do
	OLD_DIR="$RELEASES_DIR/${old%/}"
	[ "$OLD_DIR" = "$RELEASE_DIR" ] && continue
	[ "$OLD_DIR" = "$PREVIOUS_RELEASE" ] && continue
	log "removing the release $old"
	rm -rf "$OLD_DIR"
done

log "the deployment of $RELEASE_NAME is done"
log "status: success"
