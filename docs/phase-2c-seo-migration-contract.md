# PHASE 2C: SEO MIGRATION CONTRACT
## AutoSP AJakarta - Headless WordPress Project

**Project:** Headless WordPress → Next.js for SEO/GEO Rebuild
**Date:** 2026-08-18
**Status:** TECHNICAL SPECIFICATION - SEO MIGRATION LAYER

---

## 1. SEO MIGRATION OVERVIEW

```
LEGACY WEBSITE
https://autospajakarta.com
     │
     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    SEO MIGRATION LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────┐          │
│   │ LEGACY URL              │ NEW URL            │ STATUS │          │
│   ├─────────────────────────────────────────────────────────────┤          │
│   │ /premium-nano-ceramic/ │ /services/.../ │ 301    │          │
│   │ /blog-standard/         │ /blog/         │ 301    │          │
│   │ /service/premium-ceramic│ /services/.../ │ 301    │          │
│   └─────────────────────────────────────────────────────────────┘          │
│                                                                          │
│   MAPPING RULES:                                                         │
│   ├── URL → Canonical URL (per Phase 1A)                          │
│   ├── Canonical URL → Next.js Route                                      │
│   ├── Next.js Route → Redirect Status                                     │
│   └── Indexability (yes/no)                                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
     │
     ▼
NEW WEBSITE
Next.js 15 + WordPress Headless
```

---

## 2. REDIRECT DECISION MATRIX

### 2.1 Redirect Types

```
REDIRECT TYPE: 301 (Permanent)
USE WHEN:
├── URL has traffic/value
├── URL has backlinks
├── URL has rankings
└── Content moved to new URL

REDIRECT TYPE: 302 (Temporary)
USE WHEN:
├── Content temporarily relocated
├── A/B testing
└── Seasonal content

REDIRECT TYPE: 410 (Gone)
USE WHEN:
├── Content permanently deleted
├── No valuable URLs to redirect
└── No backlinks

REDIRECT TYPE: NOINDEX (Robots meta)
USE WHEN:
├── Thin content pages
├── Duplicate content
├── Low-value pages
└── Archive/noindex request

REDIRECT TYPE: KEEP URL
USE WHEN:
├── URL already correct per Phase 1A
├── No change needed
└── Same canonical URL
```

### 2.2 Decision Tree

```
URL ANALYSIS
│
├── Does URL have traffic/backlinks?
│   └── YES → 301 redirect to canonical URL
│   └── NO ↓
│
├── Is content still valuable?
│   └── YES → 301 to relevant page
│   └── NO ↓
│
├── Should URL be preserved for architecture?
│   └── YES → NOINDEX (keep URL, noindex it)
│   └── NO → 410 (delete with 410)
```

---

## 3. MIGRATION CONTRACT FIELDS

### 3.1 Migration Record

```typescript
interface URLMigrationRecord {
  // Legacy URL data
  legacy: {
    url: string;                    // Original URL
    type: 'page' | 'post' | 'service' | 'cpt';
    postId: number;                 // WordPress post ID
    redirectType: number;            // 301 | 302 | 410
    reason?: string;                // Why this redirect choice
  };

  // New URL mapping
  canonical: {
    url: string;                  // Final canonical URL
    route: string;                 // Next.js route path
    entityType?: string;            // 'service' | 'location' | 'post' | 'page'
    entityId?: string;              // CMS entity ID
  };

  // SEO Value
  seo: {
    traffic: 'high' | 'medium' | 'low' | 'none';
    backlinks: number;
    rankings: 'good' | 'some' | 'none';
    indexed: boolean;
  };

  // Content decision
  content: {
    action: 'keep' | 'update' | 'merge' | 'redirect' | 'noindex' | 'delete';
    mergeTarget?: string;           // URL to merge INTO
    updateRequired: boolean;
    notes: string;
  };

  // Migration status
  migration: {
    redirectImplemented: boolean;
    contentMigrated: boolean;
    verified: boolean;
    completedAt?: string;
    verifiedBy?: string;
  };
}
```

### 3.2 Migration Status Enum

```typescript
type MigrationStatus =
  | 'pending'        // Not started
  | 'redirect-pending'  // Redirect queued
  | 'in-progress'    // Being migrated
  | 'redirect-done'  // Redirect implemented
  | 'content-done'  // Content migrated
  | 'verified'      // Migration verified
  | 'issue';        // Migration issue found
```

---

## 4. BLOG MIGRATION MAPPING

### 4.1 From Phase 2A-D Audit

| Action | Count | Redirect Type | Implementation |
|--------|-------|-------------|----------------|
| KEEP | 28 | KEEP URL | Update metadata if needed |
| UPDATE | 142 | KEEP URL | Update + add internal links |
| MERGE | TBD | 301 | Consolidate to master article |
| REDIRECT | TBD | 301 | To relevant service/category |
| NOINDEX | 5 | NOINDEX | Add robots meta |

### 4.2 Sample Blog Migration Records

```typescript
// Example records from audit data
const blogMigrationMap: URLMigrationRecord[] = [
  {
    legacy: {
      url: '/auto-detailing-depok/',
      type: 'post',
      postId: 239,
      redirectType: 301,
      reason: 'Redirect to main detailing service page - thin content'
    },
    canonical: {
      url: '/services/premium-detailing/',
      route: '/services/premium-detailing/',
      entityType: 'service',
    },
    seo: {
      traffic: 'low',
      backlinks: 0,
      rankings: 'none',
      indexed: true,
    },
    content: {
      action: 'redirect',
      notes: 'Redirect to service page, extract useful content first'
    },
    migration: {
      redirectImplemented: false,
      contentMigrated: false,
      verified: false,
    }
  },
  {
    legacy: {
      url: '/manfaat-paint-protection-film/',
      type: 'post',
      postId: 245,
      redirectType: 301,
      reason: 'Duplicate topic - merge into main PPF article'
    },
    canonical: {
      url: '/tips/paint-protection-film-benefits/',
      route: '/blog/paint-protection-film-benefits/',
      entityType: 'post',
      entityId: 'keep-best-version',
    },
    seo: {
      traffic: 'low',
      backlinks: 0,
      rankings: 'none',
      indexed: true,
    },
    content: {
      action: 'merge',
      mergeTarget: '/tips/benefits-of-ppf/',
      updateRequired: true,
      notes: 'Keep as standalone article, update content and internal links'
    },
    migration: {
      redirectImplemented: false,
      contentMigrated: false,
      verified: false,
    }
  },
  {
    legacy: {
      url: '/tips-merawat-paint-protection-film-mobil/',
      type: 'post',
      postId: 3132,
      redirectType: 301,
      reason: 'Good content, preserve as hub article'
    },
    canonical: {
      url: '/tips/mengapa-perawatan-ppf/',
      route: '/blog/mengapa-perawatan-ppf/',
      entityType: 'post',
    },
    seo: {
      traffic: 'medium',
      backlinks: 2,
      rankings: 'good',
      indexed: true,
    },
    content: {
      action: 'update',
      updateRequired: true,
      notes: 'Good SEO score (67), preserve URL, add service links'
    },
    migration: {
      redirectImplemented: false,
      contentMigrated: false,
      verified: false,
    }
  },
];
```

---

## 5. SERVICE MIGRATION MAPPING

### 5.1 From Phase 1A + Phase 2A-B

| Legacy URL | New URL | Type | Action |
|-----------|---------|------|---------|
| `/premium-nano-ceramic-coating/` | `/services/nano-ceramic-coating/` | 301 | Consolidate |
| `/premium-coating-lp/` | N/A | 410 | Landing page, archive |
| `/our-services/` | `/services/` | 301 | Redirect to listing |
| `/service/premium-wash/` | `/services/premium-wash/` | 301 | Normalize URL |
| `/service/premium-detailing/` | `/services/premium-detailing/` | 301 | Normalize URL |

### 5.2 Service Migration Records

```typescript
const serviceMigrationMap: URLMigrationRecord[] = [
  {
    legacy: {
      url: '/premium-nano-ceramic-coating/',
      type: 'page',
      postId: 4336,
      redirectType: 301,
      reason: 'Duplicate of /nano-ceramic-coating/, consolidate'
    },
    canonical: {
      url: '/services/nano-ceramic-coating/',
      route: '/services/nano-ceramic-coating/',
      entityType: 'service',
      entityId: 'ceramic-coating',
    },
    seo: {
      traffic: 'high',
      backlinks: 15,
      rankings: 'good',
      indexed: true,
    },
    content: {
      action: 'merge',
      mergeTarget: '/services/nano-ceramic-coating/',
      updateRequired: true,
      notes: 'This is overview page linking to detail page. Both point to same service.'
    },
    migration: {
      redirectImplemented: false,
      contentMigrated: false,
      verified: false,
    }
  },
  {
    legacy: {
      url: '/premium-coating-lp/',
      type: 'page',
      postId: 4581,
      redirectType: 410,
      reason: 'Landing page, not service page - no indexable content value'
    },
    canonical: {
      url: '/services/nano-ceramic-coating/',
      route: '/services/nano-ceramic-coating/',
      entityType: 'service',
    },
    seo: {
      traffic: 'low',
      backlinks: 0,
      rankings: 'none',
      indexed: true,
    },
    content: {
      action: 'noindex',
      notes: 'Landing page, extract testimonials, noindex original URL'
    },
    migration: {
      redirectImplemented: false,
      contentMigrated: false,
      verified: false,
    }
  },
];
```

---

## 6. CATEGORY/PAGINATION MIGRATION

### 6.1 Category Redirects

| Old URL | New URL | Action |
|---------|---------|--------|
| `/blog-standard/` | `/blog/` | 301 |
| `/news-insight/` | `/blog/` | 301 |
| `/category/uncategorized/` | No redirect | NOINDEX all remaining |
| `/tag/*` | `/blog/` | Keep as listing |

### 6.2 Archive/Feed URLs

```
IMPLEMENT 410 (Gone):
├── /feed/
├── /comments/feed/
├── /author/* (unless needed)
└── /page/* (pagination, handled by Next.js)

IMPLEMENT NOINDEX (if not already):
└── /?p=* (old WordPress query URLs)
```

---

## 7. REDIRECT IMPLEMENTATION

### 7.1 Next.js Redirects Config

```typescript
// next.config.ts

export default {
  async redirects() {
    const migrationMap = await getMigrationMap(); // Load from JSON/DB
    
    return [
      // Blog redirects
      ...migrationMap
        .filter(r => r.content.action === 'redirect')
        .map(r => ({
          source: r.legacy.url.replace(/\/$/, ''),  // Remove trailing slash
          destination: r.canonical.url.replace(/\/$/, ''),
          permanent: r.legacy.redirectType === 301,
        })),
      
      // Category redirects
      {
        source: '/blog-standard',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/news-insight',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
};
```

### 7.2 WordPress Redirection Plugin Import Format

```csv
# Format for Redirection plugin import
source,target,type,regex
/blog-standard,https://autospajakarta.com/blog,301,0
/news-insight,https://autospajakarta.com/blog,301,0
/premium-nano-ceramic-coating/,https://autospajakarta.com/services/nano-ceramic-coating/,301,0
```

### 7.3 Nginx Redirect Rules (Alternative)

```nginx
# For nginx config (if not using WordPress redirects)
location /premium-nano-ceramic-coating/ {
    return 301 /services/nano-ceramic-coating/;
}

location /blog-standard/ {
    return 301 /blog/;
}
```

---

## 8. INDEXABILITY MANAGEMENT

### 8.1 NOINDEX Strategy

```typescript
// pages that should be noindexed
const noindexPages = [
  // Landing pages
  '/premium-coating-lp/',
  
  // Duplicates
  '/premium-nano-ceramic-coating/', // Redirected, noindex original
  
  // Archives
  '/blog-standard/',
  '/news-insight/',
  
  // Low value
  '/author/',
  '/search/',
];

// Implementation via meta tag
// In page head:
<meta name="robots" content="noindex, nofollow">
```

### 8.2 Robots.txt Updates

```txt
# robots.txt additions for migration

# Allow main crawlers
User-agent: *
Allow: /

# Disallow old patterns (301 redirect in place)
Disallow: /blog-standard/
Disallow: /news-insight/
Disallow: /premium-nano-ceramic-coating/

# Allow new URLs
Allow: /blog/
Allow: /services/
Allow: /locations/
Allow: /projects/
Allow: /about/
Allow: /faq/

# Sitemap
Sitemap: https://autospajakarta.com/sitemap.xml
```

---

## 9. SITEMAP STRATEGY

### 9.1 Sitemap Configuration

```typescript
// next-sitemap.config.ts or generateSitemaps function

const sitemapEntries = {
  static: [
    '/',
    '/blog',
    '/services',
    '/locations',
    '/projects',
    '/about',
    '/faq',
    '/contact',
    '/reservasi',
    '/privacy-policy',
    '/terms-conditions',
  ],
  
  dynamic: [
    // Services (from WordPress)
    '/services/[slug]',
    
    // Locations (from WordPress)
    '/locations/[slug]',
    
    // Projects (from WordPress)
    '/projects/[slug]',
    
    // Blog posts (from WordPress)
    '/blog/[slug]',
    
    // Categories
    '/blog/category/[slug]',
  ],
  
  exclude: [
    // Noindex pages
    '/premium-coating-lp',
    '/blog-standard',
    '/news-insight',
    
    // Drafts/deleted
    '/p=*',  // Old WordPress query URLs
  ],
};
```

### 9.2 Sitemap Priority Rules

```typescript
const sitemapPriority = {
  homepage: '1.0',
  servicePages: '0.9',     // High priority for commercial pages
  locationPages: '0.8',    // GEO importance
  blogPosts: '0.7',      // Content hub
  projectPages: '0.6',    // Proof pages
  categoryPages: '0.5',
  legalPages: '0.3',
};
```

---

## 10. MONITORING CONTRACT

### 10.1 Post-Migration Checks

```typescript
interface MigrationChecklist {
  redirects: {
    implemented: boolean;
    tested: string[];        // URLs tested
    verified: {
      status: number;         // 200/301/404
      redirectChain: string[];  // If chain exists
    }[];
  };
  
  indexability: {
    indexed: boolean;
    indexedUrls: string[];
    noindexUrls: string[];
    pendingIndexing: string[];
  };
  
  performance: {
    coreWebVitals: {
      lcp: number;  // < 2.5s target
      fid: number;   // < 100ms target
      cls: number;   // < 0.1 target
    };
  };
  
  seo: {
    organicTraffic: number;
    rankingChanges: {
      improved: string[];
      declined: string[];
      stable: string[];
    };
  };
}
```

### 10.2 Google Search Console Monitoring

```
MONTHLY CHECKS:
├── Crawl errors (4xx/5xx)
├── Index coverage
├── Sitemap status
├── Ranking changes (top queries)
└── Core Web Vitals report

WEEKLY CHECKS (first month):
├── Crawl stats
├── Manual crawls of key URLs
└── Search appearance review
```

---

## 11. MIGRATION CSV EXPORT FORMAT

### 11.1 Full Migration Record Export

```csv
# migration-log-YYYY-MM-DD.csv
legacy_url,canonical_url,redirect_type,post_type,post_id,entity_type,entity_id,traffic_level,backlinks,rankings,indexed,action,reason,redirect_status,content_status,verified,verified_by,completed_at
/premium-nano-ceramic-coating/,/services/nano-ceramic-coating/,301,page,4336,service,ceramic-coating,high,15,good,true,merge,Duplicate page content,none,none,false,,2024-XX-XX
/blog-standard/,/blog/,301,page,896,blog-listing,,none,0,none,true,redirect,Category consolidation,done,n/a,false,,2024-XX-XX
```

---

**Document Status:** TECHNICAL SPECIFICATION
**Last Updated:** 2026-08-18
**Owner:** Migration Team
**Next:** Schema Freeze → Phase 2D Implementation
