#!/bin/bash
# Start the AutoSPA frontend.
#
# The process is run under pm2 as the user `www`:
#
#   pm2 start ./start.sh --name autospa-web --interpreter /bin/bash
#
# The port can be changed with the PORT variable - the nginx vhost has to
# point at the same port.
export PATH=/www/server/nodejs/v20.20.2/bin:$PATH
cd "$(dirname "$0")"
export NODE_OPTIONS=--max-old-space-size=1024
exec node_modules/.bin/next start -p "${PORT:-8089}"
