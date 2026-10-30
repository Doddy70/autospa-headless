#!/usr/bin/env bash
#
# Check the live site after a deployment.
#
# The check is deliberately simple and it runs against the public URL, not
# against the port of the application: it answers the question the visitor
# asks - does the site serve the new code?
#
# Usage:
#   bash scripts/deploy/verify-deploy.sh [base-url]

set -uo pipefail

BASE="${1:-https://autospajakarta.com}"

FAILED=0

ok()   { printf 'OK   %s\n' "$*"; }
bad()  { printf 'FAIL %s\n' "$*"; FAILED=1; }

# The routes that have to answer.
for route in / /about /services /services/premium-wash /before-after /locations /contact /blog; do
	CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$BASE$route" || true)"
	if [ "$CODE" = "200" ]; then
		ok "$route answers with 200"
	else
		bad "$route answers with $CODE"
	fi
done

# The markers of the new code.
HTML="$(curl -s --max-time 30 "$BASE/" || true)"
for marker in 'footer-big-text' 'Quick links' 'tp-copyright-area'; do
	if printf '%s' "$HTML" | grep -q "$marker"; then
		ok "the homepage carries '$marker'"
	else
		bad "the homepage does not carry '$marker'"
	fi
done

# The API of the catalogue has to answer as well.
CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$BASE/api/services" || true)"
if [ "$CODE" = "200" ]; then
	ok "/api/services answers with 200"
else
	bad "/api/services answers with $CODE"
fi

if [ "$FAILED" != "0" ]; then
	printf '\nThe deployment did not pass the check.\n'
	exit 1
fi

printf '\nThe deployment passed every check.\n'
