# Deployment - AutoSPA Jakarta frontend

The headless frontend (Next.js 15, App Router) over the WordPress backend.
It runs on the server `83.147.38.178` and serves `https://autospajakarta.com`.

A push to `main` builds the site, checks it and puts it live. The build
happens on the server (the box has the memory the build needs), the runner of
GitHub Actions only carries the code and watches the result.

There is **one engine** and **two callers** of it:

```
push to main ─┐
              ├─► scripts/deploy/deploy.sh ─► build ─► check ─► switch ─► pm2 ─► health check
webhook/panel ┘                                            └─► the way back, if it does not come up
```

| Caller | What it does | Where it runs |
|--------|--------------|---------------|
| `.github/workflows/deploy.yml` | the push to `main` | the runner of GitHub Actions |
| `scripts/deploy/aapanel-deploy.sh` | the webhook of aaPanel, or a deployment by hand | the server |

Both end up in the same place: a release of its own under `releases/`, a
build that is checked, and a switch of `current` that can be taken back.

## The layout on the server

```
/www/wwwroot/autospa-frontend/          the root of the deployment
├── current -> releases/<the live one>  the symlink that is switched
├── run.sh                              the launcher pm2 runs (a stable path)
├── releases/
│   ├── 20261030-210512-8f22618/        one directory per deployment
│   └── ...                             the old ones are pruned (three are kept)
├── shared/                             the files that are not in git
│   ├── .env.production                 the environment of the production
│   └── public/wp-content/              the mirror of the CMS (40 MB)
└── .deploy.lock                        the lock of the deployment
```

The clone of the repository (the directory aaPanel pulls into) is
`/www/wwwroot/autospajakarta.com` - it is the *source*, not the live site.

The process runs under pm2 as the user `www`:

```bash
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v22.23.3/bin:$PATH; pm2 list'
```

pm2 runs `/www/wwwroot/autospa-frontend/run.sh` - a stable path that enters
the release `current` points at. A deployment swaps the release under the
process, the path of the process does not change.

nginx is the reverse proxy in front of it (`127.0.0.1:8089`):

```
/www/server/panel/vhost/nginx/autospajakarta.com.conf
```

## The engine

`scripts/deploy/deploy.sh <source-directory> [release-name]`:

1. it takes the deploy lock (`flock`), so two deploys never overlap,
2. it copies the source into a release directory of its own (a source that
   already lives under `releases/` is used where it is),
3. it puts the files that are not in git back - the environment of the
   production and the mirror of the CMS come from `shared/`,
4. it installs the dependencies (`npm ci`, without `--omit=dev` - the
   `next.config.ts` is TypeScript and the build needs `typescript`),
5. it builds the release (`npm run build`, about two minutes, 2 GB of memory,
   `nice -n 15` because the box serves a dozen other sites),
6. it **checks the build**: the homepage has to carry the markers of the new
   code, otherwise the release does not go live,
7. it switches `current` to the new release (atomically) and restarts pm2,
8. it waits for the site to answer, and checks that the process which holds
   the port is the application that was just started,
9. if the site does not answer, it switches `current` back to the release
   that was live before and restarts pm2,
10. it prunes the old releases (three are kept).

The live site is never built over: every deployment gets its own directory
and the previous one stays on disk as the way back.

## The pipeline of GitHub Actions

| Workflow | When | What it does |
|----------|------|--------------|
| `.github/workflows/ci.yml` | every push, every pull request | typecheck and a build |
| `.github/workflows/deploy.yml` | a push to `main`, or by hand | the deployment |

The deployment of `deploy.yml`:

1. the `check` job typechecks the code and builds it (without a secret the
   app falls back to the staging CMS),
2. the `deploy` job carries the checkout to the server as a tar over ssh and
   puts it into `releases/<date>-<commit>/`,
3. it runs the engine on that directory,
4. it runs `scripts/deploy/verify-deploy.sh` against the public site,
5. it writes a summary of the deployment.

### The settings of the repository

Settings -> Secrets and variables -> Actions:

| Name | Kind | Value |
|------|------|-------|
| `DEPLOY_SSH_KEY` | secret | the private key of the deploy user (the `Root Key` of `.key.md`) |
| `DEPLOY_SSH_HOST` | variable | `83.147.38.178` |
| `DEPLOY_SSH_USER` | variable | `root` |
| `DEPLOY_SSH_PORT` | variable | `22` |
| `APP_ROOT` | variable | `/www/wwwroot/autospa-frontend` |

The key is written to `~/.ssh/deploy_key` by the workflow and the host key is
added with `ssh-keyscan`.

## The path through aaPanel (the way that does not need a secret)

The panel of aaPanel can pull the repository and run a script itself. The
clone lives in `/www/wwwroot/autospajakarta.com`, and the script of the
panel is `scripts/deploy/aapanel-deploy.sh` - it pulls the branch and hands
the clone over to the engine.

| Field | Value |
|-------|-------|
| Repository | `https://github.com/Doddy70/autospa-headless.git` |
| Branch | `main` |
| Script | `/www/wwwroot/autospajakarta.com/scripts/deploy/aapanel-deploy.sh` |
| Webhook | `http://83.147.38.178:17594/hook?access_key=<the key of the site>` |

The webhook is registered in GitHub (Settings -> Webhooks -> Add webhook):
the payload URL of the panel, the content type `application/json`, the event
`push`.

This path was not taken: the OAuth token of GitHub in the panel had expired,
and the token is needed to pull a private repository. The pipeline of GitHub
Actions needs only an SSH key.

## The manual way (the fallback)

The panel is not available and the pipeline does not run - the deployment can
be done by hand. The engine takes a directory with the source of the site:

```bash
# locally: the tree of the commit, without the build output
git archive --format=tar HEAD | ssh root@83.147.38.178 \
  "mkdir -p /www/wwwroot/autospa-frontend/releases/manual && tar -xf - -C /www/wwwroot/autospa-frontend/releases/manual"

# on the server: build it, check it, put it live
ssh root@83.147.38.178 "bash /www/wwwroot/autospa-frontend/releases/manual/scripts/deploy/deploy.sh /www/wwwroot/autospa-frontend/releases/manual"
```

The files that are not in git are restored by the engine itself, from
`shared/`. The backup of them is in
`/www/backup/autospa-frontend/20261030-pre-gitreset/`.

## Checking a deployment

```bash
bash scripts/deploy/verify-deploy.sh                       # the public site
curl -I https://autospajakarta.com/
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v22.23.3/bin:$PATH; pm2 logs autospa-web --lines 30 --nostream'
```

The check scripts of the repository run against the live site as well:

```bash
node scripts/perf/check-booking-wizard.mjs https://autospajakarta.com
node scripts/perf/check-before-after.mjs https://autospajakarta.com
BASE_URL=https://autospajakarta.com node scripts/sync/check-inner-nav.mjs /about /services
```

## The files that are not in git

| File | Where it comes from |
|------|---------------------|
| `.env.production` | `shared/` - the environment of the production |
| `public/wp-content` | `shared/` - the mirror of the CMS |

`.env.production` holds the WordPress origin
(`https://backend.autospajakarta.com`), the public origin
(`https://autospajakarta.com`) and the Beauty Care popout switch.

`POPUP_ENABLED=false` takes the popout off the site for every visitor -
the switch is read on the server at runtime, so a restart is enough.
