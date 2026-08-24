# PHASE 2D.1 HANDOFF DOCUMENT
## Developer Ready for Phase 2D.2

**Project:** AutoSP AJakarta Headless WordPress → Next.js
**Date:** 2026-08-18
**Phase:** 2D.1 COMPLETE → 2D.2 UNLOCKED

---

## 📋 QUICK REFERENCE

### Server Access

| Service | Host | Port | Credentials |
|---------|------|------|-------------|
| SSH | 148.230.101.241 | 16916 | root / @Warakajimbe80 |
| aaPanel | 148.230.101.241 | 40037 | superadmin / (panel password) |
| MySQL | localhost | 3306 | root / StagingPass123 |
| WordPress DB | — | — | sql_autospajakarta / WArakajimbe80 |

### Environments

| Environment | URL | Status | PHP | Notes |
|-------------|-----|--------|-----|-------|
| **Production** | https://autospajakarta.com | READ ONLY | 7.4.33 ⚠️ | EOL - do not modify |
| **Staging** | https://staging.autospajakarta.com | ✅ ACTIVE | 8.2 | Ready for dev |

---

## 🚀 STAGING ENVIRONMENT

### Current Status

```
✅ Staging URL: https://staging.autospajakarta.com
✅ Database: sql_staging_autospajakarta (87 tables cloned)
✅ PHP Version: 8.2
✅ WordPress: Working
✅ WPGraphQL: Active at /graphql
✅ Directory: /www/wwwroot/staging.autospajakarta.com/
```

### Staging Database Credentials

```php
// wp-config.php for staging
define('DB_NAME', 'sql_staging_autospajakarta');
define('DB_USER', 'sql_autospajakarta');
define('DB_PASSWORD', 'WArakajimbe80');
define('DB_HOST', 'localhost');
$table_prefix = 'wpa_';
```

### Nginx Config Location

```
/www/server/panel/vhost/nginx/staging.autospajakarta.com.conf
```

### Key Commands

```bash
# SSH to server
sshpass -p '@Warakajimbe80' ssh -o StrictHostKeyChecking=no -p 16916 root@148.230.101.241

# Restart nginx
systemctl reload nginx

# Test GraphQL
curl -s -X POST https://staging.autospajakarta.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ posts(first: 3) { nodes { title } } }"}'
```

---

## ⚠️ CRITICAL FINDINGS

### 1. WordPress Version Anomaly

```
File: /www/wwwroot/autospajakarta.com/wp-includes/version.php
Version: 7.0.4

⚠️ ANOMALY: No WordPress release has version 7.0.x
ASSESSMENT: Version string was manually modified or custom build
ACTION: Treat as WordPress 6.x equivalent for compatibility
```

### 2. PHP 7.4.33 EOL (Production)

```
PHP Version: 7.4.33
EOL Date: November 2022
STATUS: 🔴 CRITICAL SECURITY RISK

ACTION REQUIRED: Upgrade production PHP to 8.2
TIMELINE: Before any production changes
```

### 3. SSL Certificate Expired

```
Staging SSL: Expired June 20, 2026
PRODUCTION SSL: Verify expiration date
ACTION: Renew via aaPanel
```

---

## 📝 PHASE 2D.2 READINESS

### What is Ready

| Component | Status | Notes |
|-----------|--------|-------|
| ACF Specification | ✅ Frozen | docs/phase-2c-acf-specification.md |
| WPGraphQL Schema | ✅ Frozen | docs/phase-2c-wpgraphql-schema.md |
| Staging Environment | ✅ Active | Ready for field implementation |
| Database | ✅ Cloned | 87 tables, all content |
| WPGraphQL | ✅ Active | /graphql endpoint working |

### Phase 2D.2 Tasks

1. **Create ACF Field Groups** (per spec)
2. **Register Custom Post Types** (Service, Location, Project, FAQ, Testimonial)
3. **Setup Taxonomies** (per spec)
4. **Configure WPGraphQL** (expose ACF fields)
5. **Test Relationships**

### Development Workflow

```
1. Develop on STAGING only
2. Test GraphQL queries
3. When ready: replicate changes to production
4. NEVER modify production directly
```

---

## 🔒 DEVELOPMENT RULES

```
PRODUCTION: READ ONLY
├── Do NOT modify production files
├── Do NOT modify production database
├── Do NOT activate/deactivate plugins
└── Do NOT change PHP version

STAGING: FULL DEVELOPMENT
├── Safe to test all changes
├── Safe to break things
├── Can revert from production clone
└── Test thoroughly before production
```

---

## 📁 KEY DOCUMENTATION

| Document | Purpose |
|----------|---------|
| docs/phase-2c-acf-specification.md | ACF field definitions |
| docs/phase-2c-wpgraphql-schema.md | GraphQL schema |
| docs/phase-2c-query-architecture.md | Query patterns |
| docs/phase-2b-content-model.md | Content model |
| docs/phase-2d-implementation-roadmap.md | Full roadmap |

---

## 📞 SUPPORT

For questions about this handoff:
1. Check documentation in docs/
2. Review staging environment
3. Test on staging before asking

---

**Handoff By:** Claude (AI Assistant)
**Date:** 2026-08-18
**Status:** ✅ READY FOR PHASE 2D.2
