<?php
/**
 * Re-import ACF Field Groups from JSON files (Fixed)
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

echo "=================================================\n";
echo "Re-importing ACF Field Groups from JSON\n";
echo "=================================================\n\n";

$json_dir = '/www/wwwroot/backend.autospajakarta.com/acf-json/';
$json_files = [
    'group_service.json',
    'group_location.json',
    'group_project.json',
    'group_faq.json',
    'group_testimonial.json',
    'group_post.json',
    'group_site_config.json',
];

$imported = 0;
$errors = 0;

foreach ($json_files as $file) {
    $file_path = $json_dir . $file;

    if (!file_exists($file_path)) {
        echo "✗ File not found: $file\n";
        $errors++;
        continue;
    }

    echo "Processing: $file\n";

    $json = file_get_contents($file_path);
    $data = json_decode($json, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "  ✗ JSON parse error: " . json_last_error_msg() . "\n";
        $errors++;
        continue;
    }

    // Handle both array and object formats
    $field_groups = [];
    if (isset($data[0]) && is_array($data[0])) {
        // Array of field groups
        $field_groups = $data;
    } elseif (isset($data['key'])) {
        // Single field group
        $field_groups = [$data];
    } elseif (is_array($data)) {
        // Might be wrapped differently
        $field_groups = array_values($data);
    }

    echo "  Found " . count($field_groups) . " field group(s)\n";

    foreach ($field_groups as $group) {
        if (!isset($group['key'])) {
            echo "  → Skipping (no key): " . ($group['title'] ?? 'unknown') . "\n";
            continue;
        }

        echo "  Importing: {$group['title']} ({$group['key']})\n";

        // Check if group already exists
        $existing = acf_get_field_group($group['key']);

        if ($existing) {
            // Get all fields in this group and delete them
            $existing_fields = acf_get_fields($existing);
            foreach ($existing_fields as $field) {
                acf_delete_field($field['ID']);
            }
            // Delete the group
            acf_delete_field_group($existing['ID']);
            echo "    → Deleted existing group\n";
        }

        // Import the field group
        $result = acf_import_field_group($group);

        if ($result) {
            echo "    ✓ Imported successfully\n";
            $imported++;
        } else {
            echo "    ✗ Import failed\n";
            $errors++;
        }
    }

    echo "\n";
}

echo "=================================================\n";
echo "Summary:\n";
echo "  Groups imported: $imported\n";
echo "  Errors: $errors\n";
echo "=================================================\n\n";

// Re-enable GraphQL on all field groups
echo "Re-enabling GraphQL on all field groups...\n\n";

$field_groups = acf_get_field_groups();
$graphql_enabled = 0;

foreach ($field_groups as $group) {
    $group = acf_get_field_group($group['key']);
    $group['show_in_graphql'] = 1;
    $group['graphql_field_group_name'] = preg_replace('/\s+/', '', $group['title']);
    acf_update_field_group($group);
    $graphql_enabled++;
}

echo "Enabled GraphQL on $graphql_enabled field groups\n\n";

// Verify specific problematic fields
echo "Verifying critical field structures...\n\n";

$check_fields = [
    'field_packages' => 'repeater',
    'field_benefits' => 'repeater',
    'field_process' => 'repeater',
    'field_vehicle_sizes' => 'repeater',
    'field_opening_hours' => 'repeater',
    'field_gallery' => 'repeater',
];

$all_correct = true;
foreach ($check_fields as $field_key => $expected) {
    $field = acf_get_field($field_key);

    if ($field) {
        $status = ($field['type'] === $expected) ? '✓' : '✗';
        $actual = $field['type'];
        if ($field['type'] !== $expected) {
            $all_correct = false;
        }
        echo "$status $field_key: $actual (expected: $expected)\n";
    } else {
        echo "✗ $field_key: NOT FOUND\n";
        $all_correct = false;
    }
}

echo "\n";
if ($all_correct) {
    echo "✓ All critical fields are correct!\n";
} else {
    echo "✗ Some fields still have issues.\n";
}

echo "\nDone! Clear GraphQL cache and test again.\n";
