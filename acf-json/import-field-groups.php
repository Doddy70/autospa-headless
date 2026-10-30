<?php
/**
 * Import the ACF field groups from the JSON exports.
 *
 * WHY THIS FILE EXISTS
 *
 * The import scripts that shipped with the project (`acf-json/import-acf.php`,
 * `cpt/import-acf-v2.php`, `acf-json/reimport-acf-fields.php`) are corrupted:
 * they contain stray `}` blocks in the middle of their function bodies, so
 * they cannot even be parsed. This script replaces them.
 *
 * It uses ACF's own API - `acf_import_field_group()` - which is the same
 * function the ACF admin "Import Field Groups" screen calls, so the result
 * is identical to a manual import.
 *
 * The JSON exports carry their own field keys (`field_*`), so re-running this
 * script UPDATES the existing groups instead of creating duplicates.
 *
 * USAGE
 *
 *   wp eval-file acf-json/import-field-groups.php
 *
 *   or standalone:
 *   php acf-json/import-field-groups.php
 *
 * Afterwards run `fix-graphql-group-names.php --write` to expose the groups
 * under the GraphQL names the frontend queries.
 */

if (!defined('ABSPATH')) {
    require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';
}

error_reporting(E_ERROR | E_PARSE);

/**
 * Where the JSON exports live on the server.
 *
 * The files are copied into the WordPress root by the deploy step; the
 * directory is also tried relative to the plugin folder, so the script works
 * from either location.
 */
$json_dir = '/www/wwwroot/backend.autospajakarta.com/acf-json';

if (!is_dir($json_dir)) {
    echo "No JSON directory at {$json_dir}\n";
    echo "Copy the group_*.json files there first.\n";
    exit(1);
}

$files = glob($json_dir . '/group_*.json');

if (empty($files)) {
    echo "No group_*.json files in {$json_dir}\n";
    exit(1);
}

echo "=================================================\n";
echo "Importing ACF field groups\n";
echo "=================================================\n\n";
echo "Files found: " . count($files) . "\n\n";

$imported = 0;
$updated  = 0;
$failed   = 0;

foreach ($files as $file) {
    $name = basename($file);

    $raw = file_get_contents($file);

    if ($raw === false) {
        echo "  x {$name}: could not read the file\n";
        $failed++;
        continue;
    }

    $decoded = json_decode($raw, true);

    if (!is_array($decoded)) {
        echo "  x {$name}: invalid JSON - " . json_last_error_msg() . "\n";
        $failed++;
        continue;
    }

    /* A single export file can hold one group or a list of groups. */
    $groups = isset($decoded['key']) ? [$decoded] : $decoded;

    foreach ($groups as $group) {
        if (!is_array($group) || empty($group['key'])) {
            echo "  x {$name}: a group without a key\n";
            $failed++;
            continue;
        }

        $key   = $group['key'];
        $title = $group['title'] ?? $key;

        /* Does the group already exist? */
        $existing = acf_get_field_group($key);
        $action   = $existing ? 'updated' : 'imported';

        $result = acf_import_field_group($group);

        if (is_wp_error($result)) {
            echo "  x {$title} [{$key}]: " . $result->get_error_message() . "\n";
            $failed++;
            continue;
        }

        if ($existing) {
            $updated++;
        } else {
            $imported++;
        }

        /* Report what ACF stored, so a mismatch is visible right away. */
        $stored = acf_get_field_group($key);
        $gql    = $stored['graphql_field_group_name'] ?? '(unset)';
        $shown  = !empty($stored['show_in_graphql']) ? 'exposed' : 'not exposed';

        echo "  + {$title} [{$key}] {$action} - graphql='{$gql}', {$shown}\n";
    }
}

echo "\n=================================================\n";
echo "Imported: {$imported}\n";
echo "Updated:  {$updated}\n";
echo "Failed:   {$failed}\n";
echo "=================================================\n";

if ($failed === 0) {
    echo "\nNext: set the GraphQL names and exposure.\n";
    echo "  wp eval-file acf-json/fix-graphql-group-names.php --write\n";
}
