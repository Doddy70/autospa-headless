# Deployment - AutoSPA Jakarta frontend

The headless frontend (Next.js 15, App Router) over the WordPress backend.
It runs on the server `83.147.38.178` and serves `https://autospajakarta.com`.

The deployment runs through the **Git Manager of aaPanel**: the panel clones
the repository of GitHub into the directory of the site, and a deploy script
builds the new version, checks it and puts it live. A push to `main` does
the same thing through the webhook of the panel.

## The layout on the server

```
/www/wwwroot/autospajakarta.com/     the site of aaPanel (the repository lives here)
├── .git/                            the clone of the repository
├── .next/                           the build that is live
├── .next.new/                       the build that is being made
├── node_modules/                    the dependencies
├── public/                          the static assets, the videos, the mirror of the CMS
├── .env.production                  the WordPress origin and the public origin
└── start.sh                         the start script (pm2 runs it, port 8089)
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

`scripts/deploy/aapanel-deploy.sh` is the script the panel runs after it
pulls the repository:

1. it restores the files that are not in git - the environment of the
   production (`.env.production`) and the mirror of the CMS
   (`public/wp-content`); the backup of them is in
   `/www/backup/autospa-frontend/20261030-pre-gitreset/`,
2. it installs the dependencies (`npm ci`, without `--omit=dev` - the
   `next.config.ts` is TypeScript and the build needs `typescript`),
3. it builds the new version **next to** the live one (`NEXT_DIST_DIR=.next.new`),
   so the site keeps serving the old build while the new one is built,
4. it **checks the build**: the homepage has to carry the markers of the new
   code, otherwise the release does not go live,
5. it swaps the two builds and restarts pm2 (the application is created when
   it does not exist yet),
6. if the site does not answer within a minute, it swaps the builds back.

A build on the server takes about two minutes and up to 2 GB of memory. The
box also serves a dozen other sites, so the build is worth running with a
lower priority.

## The panel

**The repository** (Site -> autospajakarta.com -> Config -> Git):

| Field | Value |
|-------|-------|
| Repository | `https://github.com/Doddy70/autospa-headless.git` |
| Branch | `main` |
| Authentication | GitHub (the OAuth of the panel) |
| Deploy mode | merge (the files that are not in git are kept) |

The first connection clones the repository into the directory of the site
and injects the `.git` into it - the deploys after that pull the
repository in place.

**The script** (Site -> autospajakarta.com -> Config -> Git -> Script):

| Field | Value |
|-------|-------|
| Alias | `deploy` |
| Path | `/www/wwwroot/autospajakarta.com/scripts/deploy/aapanel-deploy.sh` |

The script is bound to the repository in the Repository tab, and the panel
writes the webhook of the site:

```
/www/server/panel/plugin/webhook/script/<access_key>
```

**The webhook** (GitHub -> the repository -> Settings -> Webhooks):

| Field | Value |
|-------|-------|
| Payload URL | the webhook URL of the site (Git -> Repository -> copy) |
| Content type | `application/json` |
| SSL verification | Disable |
| Events | push |

## The files that are not in git

| File | Where it comes from |
|------|---------------------|
| `.env.production` | the backup - the environment of the production |
| `public/wp-content` | the backup, or `npm run sync:content` in a release |

`.env.production` holds the WordPress origin
(`https://backend.autospajakarta.com`), the public origin
(`https://autospajakarta.com`) and the Beauty Care popout switch.

`POPUP_ENABLED=false` takes the popout off the site for every visitor -
the switch is read on the server at runtime, so a restart is enough.

## Checking a deployment

```bash
bash scripts/deploy/verify-deploy.sh                       # the public site
curl -I https://autospajakarta.com/
curl -I https://autospajakarta.com/contact
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v22.23.3/bin:$PATH; pm2 logs autospa-web --lines 30 --nostream'
```

The check scripts of the repository run against the live site as well:

```bash
node scripts/perf/check-booking-wizard.mjs https://autospajakarta.com
node scripts/perf/check-before-after.mjs https://autospajakarta.com
BASE_URL=https://autospajakarta.com node scripts/sync/check-inner-nav.mjs /about /services
```

## The manual method (the fallback)

The panel is not available, the deployment can be done by hand. The bundle
is built from the working tree (never the secrets and never the build
output), uploaded and extracted over the site directory:

```bash
# locally
tar --exclude='./node_modules' --exclude='./.next*' --exclude='./.git' \
    --exclude='./.cache' --exclude='./.remember' --exclude='./.env.local' \
    --exclude='./.key.md' -czf /tmp/autospa-frontend.tar.gz .
scp -P 22 /tmp/autospa-frontend.tar.gz root@83.147.38.178:/tmp/

# on the server
cd /www/wwwroot/autospajakarta.com
tar -xzf /tmp/autospa-frontend.tar.gz -C . --no-same-owner
chown -R www:www .
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v20.20.2/bin:$PATH && npm ci'
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v20.20.2/bin:$PATH && NODE_OPTIONS=--max-old-space-size=2048 nice -n 15 npm run build'
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v22.23.3/bin:$PATH; pm2 restart autospa-web'
```

## The pipeline of GitHub Actions (the plan that was not used)

The workflow `.github/workflows/deploy.yml` and `scripts/deploy/deploy.sh`
build a release in a directory of its own and switch a symlink to it. It
is not wired up - the deployment goes through the panel of aaPanel. The
files stay in the repository as the plan of the release directories.
