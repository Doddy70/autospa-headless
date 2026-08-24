# Phase 2D.2: ACF Fields Deployment Guide

## AutoSP AJakarta - Headless WordPress Migration

**Status:** Ready for Deployment
**Date:** 2026-08-18
**Target:** Staging (backend.autospajakarta.com)

---

## Files Created

| File | Field Groups | CPT | Priority |
|------|-------------|-----|----------|
| `group_service.json` | 6 groups | Service | 1 |
| `group_location.json` | 7 groups | Location | 2 |
| `group_project.json` | 3 groups | Project | 3 |
| `group_faq.json` | 2 groups | FAQ | 4 |
| `group_testimonial.json` | 3 groups | Testimonial | 5 |
| `group_post.json` | 2 groups | Post | 7 |
| `group_site_config.json` | 1 group | Options Page | 6 |

**Total:** 24 field groups across 7 CPTs/options

---

## Deployment Methods

### Method 1: ACF Tools Import (Recommended)

1. **Access WordPress Admin**
   ```
   https://backend.autospajakarta.com/wp-admin
   ```

2. **Navigate to ACF**
   ```
   Custom Fields → Tools
   ```

3. **Import Each File**
   - Copy content from each JSON file
   - Paste into "Import Field Groups" textarea
   - Click "Import"
   - Repeat for all 7 files

4. **Recommended Order**
   ```
   1. group_service.json
   2. group_location.json
   3. group_project.json
   4. group_faq.json
   5. group_testimonial.json
   6. group_post.json
   7. group_site_config.json
   ```

### Method 2: WP-CLI (Advanced)

```bash
# SSH to server
ssh -p 16916 root@148.230.101.241

# Navigate to WordPress
cd /www/wwwroot/backend.autospajakarta.com

# Import all field groups
wp acf import /path/to/acf-json/group_*.json
```

### Method 3: Auto-Import via PHP

Place JSON files in theme's `acf-json` folder for auto-import on theme activation.

---

## Post-Deployment Checklist

### Verify Field Groups Created

1. Go to **Custom Fields → Field Groups**
2. Verify all 24 field groups appear
3. Check each group has correct fields

### Enable Options Page

For `group_site_config.json` to work:

1. Add to `functions.php` or custom plugin:

```php
if( function_exists('acf_add_options_page') ) {
    acf_add_options_page(array(
        'page_title'    => 'Site Configuration',
        'menu_title'    => 'Site Configuration',
        'menu_slug'     => 'site-configuration',
        'parent_slug'   => 'options-general.php',
        'position'      => 80,
        'icon_url'      => 'dashicons-admin-site'
    ));
}
```

---

## CPT Registration Note

**IMPORTANT:** These ACF fields will only show in the admin after the CPTs are registered.

CPT registration is **Phase 2D.3**. The fields are created but will show no location rules until CPTs exist.

For testing, you can temporarily:
1. Register CPTs first (2D.3), OR
2. Create test posts using a workaround

---

## Field Groups Summary

### Service CPT (6 Groups)
- [ ] Service Hero
- [ ] Service Content
- [ ] Service Packages
- [ ] Service Gallery
- [ ] Service Relationships
- [ ] Service SEO

### Location CPT (7 Groups)
- [ ] Location Identity
- [ ] Location Address
- [ ] Location Geo
- [ ] Business Hours
- [ ] Location Content
- [ ] Location Relationships
- [ ] Location Gallery

### Project CPT (3 Groups)
- [ ] Project Content
- [ ] Project Media
- [ ] Project Relationships

### FAQ CPT (2 Groups)
- [ ] FAQ Content
- [ ] FAQ Context

### Testimonial CPT (3 Groups)
- [ ] Testimonial Content
- [ ] Testimonial Media
- [ ] Testimonial Context

### Post (2 Groups)
- [ ] Post Relationships
- [ ] Migration Status

### Options Page (1 Group)
- [ ] Site Configuration (tabs: Organization, Contact, Social, SEO)

---

## Next Steps

1. ✅ Deploy ACF JSON files
2. ⏳ Enable Options Page (add PHP code)
3. ⏳ **Phase 2D.3:** Register CPTs
4. ⏳ Verify fields appear in admin

---

## Troubleshooting

### Fields not showing
- Check CPT is registered (Phase 2D.3)
- Verify location rules are correct
- Check ACF PRO is installed and activated

### Options page not working
- Ensure ACF PRO (not free) is installed
- Add the options page PHP code

### Import errors
- Check PHP memory limit (recommend 256MB+)
- Verify JSON syntax is valid
- Try importing one file at a time

---

**Document Status:** Ready for Deployment
**Last Updated:** 2026-08-18
