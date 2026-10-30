# Deployment - AutoSPA Jakarta frontend

The headless frontend (Next.js 15, App Router) over the WordPress backend.
It runs on the server `83.147.38.178` and serves `https://autospajakarta.com`.

Since the reset the deployment runs through **GitHub Actions**: a push to
`main` builds a release on the server, checks it and switches it live. The
manual method (bundle -> upload -> build -> pm2 restart) is kept at the end
of this document for the times the pipeline is not available.

## The pipeline

```
push to main
   |
   v
GitHub Actions (.github/workflows/deploy.yml)
   |-- npm run typecheck                     the code is checked
   |-- rsync the checkout into              /www/wwwroot/autospa-frontend/releases/<stamp>-<sha>
   |  the new release directory
   |-- scripts/deploy/deploy.sh              build, check, switch, restart, health check
   `-- scripts/deploy/verify-deploy.sh       the public site
```

The runner never builds and the server never builds over the live
application: every deploy gets its own release directory, and the one that
is live is only a symlink away.

## The layout on the server

```
/www/wwwroot/autospa-frontend/
├── current -> releases/20261030-201500-a1b2c3d   the live release
├── releases/                                     the releases (the old ones are the rollback)
│   └── 20261030-201500-a1b2c3d/
│       ├── .next/                                the build
│       ├── node_modules/                         the dependencies
│       ├── public/                               the static assets, the videos
│       └── start.sh, package.json, src/, ...
├── shared/public/wp-content/                    the mirror of the CMS (not in git)
├── start.sh                                      the start script (pm2 runs it)
└── .deploy.lock                                  the deploy lock
```

The process runs under pm2 as the user `www`, the same user as the other
Node applications of the box:

```bash
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v22.23.3/bin:$PATH; pm2 list'
```

nginx is the reverse proxy in front of it (`127.0.0.1:8089`):

```
/www/server/panel/vhost/nginx/autospajakarta.com.conf
```

The original vhost (the WordPress one, without a docroot) is kept in
`/www/backup/autospa-frontend/`.

## The deploy script

`scripts/deploy/deploy.sh <release-directory>` runs on the server and does
the whole cutover:

1. it takes the deploy lock (`flock`), so two deploys never overlap,
2. it installs the dependencies (`npm ci`, without `--omit=dev` - the
   `next.config.ts` is TypeScript and the build needs `typescript`),
3. it copies the mirror of the CMS (`public/wp-content`) into the release,
4. it builds (`nice -n 15`, 2 GB of heap - the box serves a dozen other
   sites),
5. it **checks the build**: the homepage has to carry the markers of the
   new code, otherwise the release does not go live,
6. it switches `current` to the new release (the symlink is replaced
   atomically),
7. it restarts pm2 and waits for the site to answer,
8. if the site does not answer within a minute, it **switches back** to the
   previous release and restarts pm2 again,
9. it prunes the old releases (three are kept).

## What the pipeline needs

**Repository variables** (Settings -> Secrets and variables -> Actions ->
Variables):

| Name | Value |
|------|-------|
| `DEPLOY_SSH_HOST` | `83.147.38.178` |
| `DEPLOY_SSH_USER` | `root` |
| `DEPLOY_SSH_PORT` | `22` |
| `APP_ROOT` | `/www/wwwroot/autospa-frontend` |

**Repository secret** (Settings -> Secrets and variables -> Actions ->
Secrets):

| Name | Value |
|------|-------|
| `DEPLOY_SSH_KEY` | the private key of the deploy key (see below) |

The deploy key is a key of its own, not the personal one: it lives in
`~/.ssh/deploy_key` on the runner and its public half is in
`/root/.ssh/authorized_keys` of the server.

## The first deployment (the migration)

The site that is live was deployed by hand and lived directly in
`/www/wwwroot/autospa-frontend`. The migration moves it into the release
structure and lets the pipeline take over:

```bash
# on the server
cd /www/wwwroot/autospa-frontend
mkdir -p releases shared
STAMP=$(date +%Y%m%d-%H%M%S)-baseline
mkdir "releases/$STAMP"
# everything that is not the release structure itself moves into the release
for item in .next node_modules public src scripts docs acf-json cpt data \
             package.json package-lock.json next.config.ts tsconfig.json \
             postcss.config.mjs .npmrc .env.production next-env.d.ts \
             playwright.config.ts README.md CLAUDE.md; do
    [ -e "$item" ] && mv "$item" "releases/$STAMP/"
done
ln -sfn "$PWD/releases/$STAMP" current
# the start script now runs the release behind `current`
cat > start.sh <<'SH'
#!/bin/bash
export PATH=/www/server/nodejs/v20.20.2/bin:$PATH
cd /www/wwwroot/autospa-frontend/current
export NODE_OPTIONS=--max-old-space-size=1024
exec node_modules/.bin/next start -p "${PORT:-8089}"
SH
chmod +x start.sh
chown -R www:www .
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v22.23.3/bin:$PATH; pm2 restart autospa-web'
```

After that the first push to `main` deploys through the pipeline.

## Checking a deployment

```bash
bash scripts/deploy/verify-deploy.sh                       # the public site
curl -I https://autospajakarta.com/
curl -I https://autospajakarta.com/contact
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v22.23.3/bin:$PATH; pm2 logs autospa-web --lines 30 --nostream'
```

## The environment

`.env.production` holds the WordPress origin
(`https://backend.autospajakarta.com`), the public origin
(`https://autospajakarta.com`) and the Beauty Care popout switch. It is
**not** in git - the file lives on the server and is copied into every
release by the migration.

`POPUP_ENABLED=false` takes the popout off the site for every visitor -
the switch is read on the server at runtime, so a restart is enough.

## The mirror of the CMS

`public/wp-content` (the fonts, the uploads and the theme assets of the
mirrored WordPress pages) is regenerated from the WordPress origin and is
not in git. The deploy script copies it from `shared/public/wp-content`
into every release.

```bash
npm run sync:content     # on the server, inside a release
```

## The manual method (the fallback)

The pipeline is not available, the deployment can be done by hand. The
bundle is built from the working tree (never the secrets and never the
build output), uploaded and extracted over the application directory:

```bash
# locally
tar --exclude='./node_modules' --exclude='./.next*' --exclude='./.git' \
    --exclude='./.cache' --exclude='./.remember' --exclude='./.env.local' \
    --exclude='./.key.md' -czf /tmp/autospa-frontend.tar.gz .
scp -P 22 /tmp/autospa-frontend.tar.gz root@83.147.38.178:/tmp/

# on the server
cd /www/wwwroot/autospa-frontend
tar -xzf /tmp/autospa-frontend.tar.gz -C . --no-same-owner
chown -R www:www .
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v20.20.2/bin:$PATH && npm ci'
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v20.20.2/bin:$PATH && NODE_OPTIONS=--max-old-space-size=2048 nice -n 15 npm run build'
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v22.23.3/bin:$PATH; pm2 restart autospa-web'
```

A build on the server takes about two minutes and up to 2 GB of memory.
