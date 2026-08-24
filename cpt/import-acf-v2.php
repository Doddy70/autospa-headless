<?php
/**
 * ACF Field Groups Import Script v2
 * Properly import JSON files with correct location rules
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

// Suppress warnings for cleaner output
error_reporting(E_ERROR | E_PARSE);

$json_dir = '/www/wwwroot/backend.autospajakarta.com/acf-json';
$files = glob($json_dir . '/*.json');

if (empty($files)) {
    echo "No JSON files found in {$json_dir}\n";
    exit(1);
}

echo "Found " . count($files) . " JSON files to import\n\n";

$imported = 0;
$updated = 0;
$skipped = 0;

foreach ($files as $file) {
    $filename = basename($file);
    if ($filename === 'README.md' || $filename === 'import-acf.php' || $filename === 'fix-acf-locations.php') {
        continue;
    }

    echo "Processing: {$filename}\n";

    $json = file_get_contents($file);
    $field_groups = json_decode($json, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "  ❌ Invalid JSON: " . json_last_error_msg() . "\n";
        continue;
    }

    if (!is_array($field_groups)) {
        echo "  ❌ Not a valid field group array\n";
        continue;
    }

    // Handle single group or array of groups
    if (isset($field_groups[0]['key'])) {
        $groups_to_import = $field_groups;
    } else {
        $groups_to_import = [$field_groups];
    }

    foreach ($groups_to_import as $field_group) {
        $key = $field_group['key'] ?? '';
        $title = $field_group['title'] ?? 'Untitled';

        if (empty($key)) {
            echo "  ⚠️  Skipping group without key\n";
            $skipped++;
            continue;
        }

        // Find existing group by key
        $existing = get_posts([
            'post_type' => 'acf-field-group',
            'meta_key' => '_key',
            'meta_value' => $key,
            'posts_per_page' => 1,
        ]);

        // Prepare location rules
        $location = $field_group['location'] ?? [];

        if (!empty($existing)) {
            // Update existing group
            $post_id = $existing[0]->ID;

            // Update the post
            wp_update_post([
                'ID' => $post_id,
                'post_title' => $title,
                'menu_order' => $field_group['menu_order'] ?? 0,
            ]);

            // Update location using ACF's internal format
            acf_update_location_rules($post_id, $location);

            // Update settings
            $settings = [
                'hide_on_screen' => $field_group['hide_on_screen'] ?? '',
                'active' => $field_group['active'] ?? true,
                'description' => $field_group['description'] ?? '',
                'instruction_placement' => $field_group['instruction_placement'] ?? 'label',
                'label_placement' => $field_group['label_placement'] ?? 'top',
                'style' => $field_group['style'] ?? 'default',
                'position' => $field_group['position'] ?? 'normal',
            ];
            update_post_meta($post_id, '_settings', maybe_serialize($settings));

            echo "  ✓ Updated '{$title}' (ID: {$post_id})\n";
            $updated++;
        } else {
            // Create new group
            $post_id = wp_insert_post([
                'post_type' => 'acf-field-group',
                'post_title' => $title,
                'post_status' => 'publish',
                'menu_order' => $field_group['menu_order'] ?? 0,
            ]);

            if (is_wp_error($post_id)) {
                echo "  ❌ Failed to create '{$title}': " . $post_id->get_error_message() . "\n";
                $skipped++;
                continue;
            }

            // Save metadata
            update_post_meta($post_id, '_key', $key);
            update_post_meta($post_id, '_edit_lock', time() . ':1');

            // Update location using ACF's internal format
            acf_update_location_rules($post_id, $location);

            // Update settings
            $settings = [
                'hide_on_screen' => $field_group['hide_on_screen'] ?? '',
                'active' => $field_group['active'] ?? true,
                'description' => $field_group['description'] ?? '',
                'instruction_placement' => $field_group['instruction_placement'] ?? 'label',
                'label_placement' => $field_group['label_placement'] ?? 'top',
                'style' => $field_group['style'] ?? 'default',
                'position' => $field_group['position'] ?? 'normal',
            ];
            update_post_meta($post_id, '_settings', maybe_serialize($settings));

            // Create fields recursively
            if (!empty($field_group['fields'])) {
                foreach ($field_group['fields'] as $field_order => $field) {
                    $field['parent'] = $post_id;
                    $field['menu_order'] = $field_order;
                    create_acf_field($field);
                }
            }

            echo "  ✅ Imported '{$title}' (ID: {$post_id})\n";
            $imported++;
        }
    }
}

function create_acf_field($field, $parent_id = 0) {
    $key = $field['key'] ?? 'field_' . uniqid();
    $name = $field['name'] ?? '';
    $type = $field['type'] ?? 'text';

    $post_id = wp_insert_post([
        'post_type' => 'acf-field',
        'post_title' => $field['label'] ?? $name,
        'post_status' => 'publish',
        'post_parent' => $parent_id,
        'menu_order' => $field['menu_order'] ?? 0,
    ]);

    if (is_wp_error($post_id)) {
        return null;
    }

    // Save field metadata
    update_post_meta($post_id, '_key', $key);
    update_post_meta($post_id, '_name', $name);
    update_post_meta($post_id, '_type', $type);

    // Save all field properties
    $skip_keys = ['ID', 'post_type', 'post_title', 'post_status', 'post_parent', 'menu_order', 'key', 'sub_fields', 'parent'];
    foreach ($field as $prop_key => $prop_value) {
        if (!in_array($prop_key, $skip_keys)) {
            update_post_meta($post_id, $prop_key, $prop_value);
        }
    }

    // Create sub-fields for repeaters etc
    if (!empty($field['sub_fields'])) {
        foreach ($field['sub_fields'] as $sub_order => $sub_field) {
            $sub_field['parent'] = $post_id;
            $sub_field['menu_order'] = $sub_order;
            create_acf_field($sub_field, $post_id);
        }
    }

    return $post_id;
}

function acf_update_location_rules($post_id, $location) {
    // ACF 6.x stores location in wp_postmeta
    // Format: a:1:{i:0;a:1:{i:0;a:3:{s:5:"param";s:9:"post_type";s:8:"operator";s:2:"==";s:5:"value";s:7:"service";}}}

    if (empty($location)) {
        $location = [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'post',
                ]
            ]
        ];
    }

    $serialized = serialize($location);
    update_post_meta($post_id, '_location', $serialized);
}

echo "\n" . str_repeat('=', 50) . "\n";
echo "Import complete!\n";
echo "Imported: {$imported}\n";
echo "Updated: {$updated}\n";
echo "Skipped: {$skipped}\n";
echo str_repeat('=', 50) . "\n";
