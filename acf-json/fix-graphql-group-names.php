<?php
/**
 * Set the GraphQL exposure of every ACF field group.
 *
 * WHY THIS FILE EXISTS
 *
 * `enable-graphql-all-groups.php` switches "Show in GraphQL" on for every
 * field group, but it DERIVES the GraphQL field name from the group's
 * `post_name`:
 *
 *     "Service SEO"    -> "ServiceSeo"     <- wrong
 *     "Service Media"  -> "ServiceMedia"   <- wrong
 *     "FAQ Content"    -> "FaqContent"     <- wrong
 *
 * The frontend queries a different contract:
 *
 *     serviceSEO, serviceGallery, fAQContent, ...
 *
 * So the group is exposed under a name the frontend never asks for and the
 * query fails with "Cannot query field ... on type Service". This script
 * sets the exact names instead of deriving them.
 *
 * It reads and writes through the ACF API (`acf_get_field_group()` /
 * `acf_update_field_group()`) rather than through `post_content`, because
 * ACF 6 stores its metadata as JSON - unserializing it by hand does not
 * give the real settings back.
 *
 * USAGE
 *
 *   Report what the install looks like (read-only, no writes):
 *       AUTOSP_GQL_NAMES=report wp eval-file acf-json/fix-graphql-group-names.php
 *
 *   Apply the names and the exposure:
 *       AUTOSP_GQL_NAMES=write  wp eval-file acf-json/fix-graphql-group-names.php
 *
 *   Standalone (no WP-CLI):
 *       php acf-json/fix-graphql-group-names.php --write
 *
 * The names below are the contract the frontend queries against:
 *   src/lib/wordpress/queries/services.ts
 *   src/lib/wordpress/queries/locations.ts
 * The mapping is checked by `acf-json/verify-graphql.php` and by the
 * frontend itself - see `docs/cms-restore-checklist.md`.
 */

if (!defined('ABSPATH')) {
    require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';
}

/**
 * group key (ACF) => GraphQL field name (the contract).
 *
 * `group_site_config` is an options page, not a post type group; it is
 * listed for completeness but no frontend query reads it.
 *
 * A plain variable, not a constant: the file may be included more than once
 * in some WP-CLI contexts and a second `const` declaration would fatal.
 */
$group_graphql_names = [
    // Service CPT
    'group_service_hero'          => 'serviceHero',
    'group_service_content'       => 'serviceContent',
    'group_service_packages'      => 'servicePackages',
    'group_service_media'         => 'serviceGallery',
    'group_service_relationships' => 'serviceRelationships',
    'group_service_seo'           => 'serviceSEO',

    // Location CPT
    'group_location_identity'      => 'locationIdentity',
    'group_location_address'       => 'locationAddress',
    'group_location_geo'           => 'locationGeo',
    'group_location_business'      => 'businessHours',
    'group_location_content'       => 'locationContent',
    'group_location_relationships' => 'locationRelationships',
    'group_location_gallery'       => 'locationGallery',

    // Project CPT
    'group_project_content'       => 'projectContent',
    'group_project_media'         => 'projectMedia',
    'group_project_relationships' => 'projectRelationships',

    // FAQ CPT
    'group_faq_content' => 'fAQContent',
    'group_faq_context' => 'fAQContext',

    // Testimonial CPT
    'group_testimonial_content' => 'testimonialContent',
    'group_testimonial_media'   => 'testimonialMedia',
    'group_testimonial_context' => 'testimonialContext',

    // Post CPT
    'group_post_relationships' => 'postRelationships',
    'group_migration_status'   => 'migrationStatus',

    // Options page
    'group_site_config' => 'siteConfiguration',
];

/*
 * The flags are read from three places, because WP-CLI does not forward
 * a `--write` flag to `eval-file` (it rejects it as an unknown parameter).
 */
$argv        = isset($argv) ? $argv : [];
$cli_args    = array_merge($argv, $_SERVER['argv'] ?? []);
$env_mode    = strtolower((string) (getenv('AUTOSP_GQL_NAMES') ?: ''));
$write       = $env_mode === 'write' || in_array('--write', $cli_args, true);
$report_only = $env_mode === 'report' || in_array('--report', $cli_args, true);

echo "=================================================\n";
echo $write
    ? "Applying GraphQL field group names\n"
    : "Reporting GraphQL field group exposure (read-only)\n";
echo "=================================================\n\n";

if (!function_exists('acf_get_field_groups')) {
    echo "ACF is not loaded - is the plugin active?\n";
    exit(1);
}

$groups = acf_get_field_groups();

if (empty($groups)) {
    echo "No ACF field groups found.\n";
    echo "Import them first: wp eval-file acf-json/import-field-groups.php\n";
    exit(0);
}

echo "Field groups found: " . count($groups) . "\n";
echo "Expected: " . count($group_graphql_names) . "\n\n";

$changed_groups = 0;
$changed_fields = 0;
$missing        = [];

foreach ($groups as $group) {
    $key = $group['key'] ?? '';

    if ($key === '') continue;

    $expected = $group_graphql_names[$key] ?? null;
    $current  = $group['graphql_field_group_name'] ?? '(unset)';
    $exposed  = !empty($group['show_in_graphql']);
    $title    = $group['title'] ?? $key;

    if ($expected === null) {
        $missing[] = $key;
        echo "  ? {$title} [{$key}] - no name in the map, left alone\n";
        continue;
    }

    $problems = [];
    if (!$exposed) $problems[] = 'not exposed';
    if ($current !== $expected) $problems[] = "named '{$current}' instead of '{$expected}'";

    if (empty($problems)) {
        echo "  = {$title} -> {$expected}\n";
        continue;
    }

    if (!$write) {
        echo "  ! {$title} -> {$expected} (" . implode(', ', $problems) . ")\n";
        continue;
    }

    $group['show_in_graphql']          = 1;
    $group['graphql_field_group_name'] = $expected;

    acf_update_field_group($group);

    $changed_groups++;
    echo "  + {$title} -> {$expected}\n";

    /* The individual fields carry their own "Show in GraphQL" toggle. */
    $fields = acf_get_fields(['parent' => $group['ID']]);

    foreach ($fields as $field) {
        if (!empty($field['show_in_graphql'])) continue;

        $field['show_in_graphql'] = 1;
        acf_update_field($field);

        $changed_fields++;
    }
}

if (!empty($missing)) {
    echo "\nGroups without a name in the map (left alone):\n";
    foreach ($missing as $key) echo "  - {$key}\n";
}

echo "\n=================================================\n";
if ($write) {
    echo "Groups renamed: {$changed_groups}\n";
    echo "Fields exposed:  {$changed_fields}\n";

    /* WPGraphQL caches the schema; drop it so the new names take effect. */
    delete_transient('wpgraphql_schema');
    delete_option('wpgraphql_schema');

    echo "\nSchema cache cleared. Also clear it in WP Admin -> GraphQL -> Settings.\n";
} else {
    echo "Nothing was written. Re-run with AUTOSP_GQL_NAMES=write to apply.\n";
}
echo "=================================================\n";

if ($report_only) {
    echo "\nNext: verify with the probes in docs/cms-restore-checklist.md\n";
}
