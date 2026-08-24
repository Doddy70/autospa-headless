<?php
/**
 * Export and Re-import ACF Field Groups
 * This ensures fields are stored in the correct format for wpgraphql-acf
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

echo "=================================================\n";
echo "ACF Field Group Export/Re-import Script\n";
echo "=================================================\n\n";

// Get all field groups
$field_groups = acf_get_field_groups();

echo "Found " . count($field_groups) . " field groups\n\n";

$count = 0;
foreach ($field_groups as $group) {
    echo "Processing: {$group['title']} (ID: {$group['ID']})\n";

    // Get fields for this group
    $fields = acf_get_fields($group);

    // Export to JSON
    $json = acf_export_fields($fields);

    // Delete the field group
    acf_delete_field_group($group['ID']);

    // Import from JSON
    $imported = acf_import_fields($json);

    if ($imported) {
        echo "  ✓ Re-imported successfully\n";
        $count++;
    } else {
        echo "  ✗ Re-import failed\n";
    }
}

echo "\n=================================================\n";
echo "Summary: $count of " . count($field_groups) . " field groups re-imported\n";
echo "=================================================\n";
echo "\nClear GraphQL cache and test again.\n";
