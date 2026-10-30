# Deployment - AutoSPA Jakarta frontend

The headless frontend (Next.js 15, App Router) over the WordPress backend.
It runs on the server `83.147.38.178` and serves `https://autospajakarta.com`.

## The layout on the server

```
/www/wwwroot/autospa-frontend/    the application
├── .next/                         the build (next build)
├── node_modules/                  the dependencies
├── public/                        the static assets and the videos
├── .env.production                the WordPress origin and the public origin
└── start.sh                       the start script (port 8089)
```

The process runs under pm2 as the user `www`, the same user as the other Node
applications of the box:

```bash
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v22.23.3/bin:$PATH; pm2 list'
```

nginx is the reverse proxy in front of it:

```
/www/server/panel/vhost/nginx/autospajakarta.com.conf
```

The original vhost (the WordPress one, without a docroot) is kept in
`/www/backup/autospa-frontend/`.

## The first installation

```bash
cd /www/wwwroot/autospa-frontend
export PATH=/www/server/nodejs/v20.20.2/bin:$PATH
npm ci                 # the build needs the dev dependencies, so no --omit=dev
npm run build
pm2 start ./start.sh --name autospa-web --interpreter /bin/bash
pm2 save
```

`next.config.ts` is a TypeScript file, so `typescript` has to be installed -
it is a dev dependency, and `npm ci` without `--omit=dev` takes care of it.
With `--omit=dev` the config cannot be loaded and the server stops with
"Failed to load next.config.ts".

The nginx configuration is tested and reloaded with the binary of the panel,
not the one of the system:

```bash
NG=/www/server/nginx/sbin/nginx
CONF=/www/server/nginx/conf/nginx.conf
$NG -t -c $CONF
$NG -s reload -c $CONF
```

## An update

Upload the new bundle, extract it over the application directory and run:

```bash
cd /www/wwwroot/autospa-frontend
export PATH=/www/server/nodejs/v20.20.2/bin:$PATH
npm ci
npm run build
pm2 restart autospa-web
```

A build on the server takes about two minutes and up to 2 GB of memory. The
box also serves a dozen other sites, so the build is worth running with a
lower priority:

```bash
NODE_OPTIONS=--max-old-space-size=2048 nice -n 15 npm run build
```

## The environment

`.env.production` is part of the bundle and holds the WordPress origin
(`https://backend.autospajakarta.com`), the public origin
(`https://autospajakarta.com`) and the Beauty Care popout switch.

`POPUP_ENABLED=false` takes the popout off the site for every visitor - the
switch is read on the server at runtime, so a restart is enough.

## Checking a deployment

```bash
curl -I https://autospajakarta.com/
curl -I https://autospajakarta.com/contact
su -s /bin/bash www -c 'export PATH=/www/server/nodejs/v22.23.3/bin:$PATH; pm2 logs autospa-web --lines 30 --nostream'
```
