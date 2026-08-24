<?php
/**
 * ACF JSON Import Script
 * Run via WP-CLI: wp eval-file import-acf.php
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
$skipped = 0;

foreach ($files as $file) {
    $filename = basename($file);
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

        // Check if group already exists
        $existing = get_posts([
            'post_type' => 'acf-field-group',
            'meta_key' => '_key',
            'meta_value' => $key,
            'posts_per_page' => 1,
        ]);

        if (!empty($existing)) {
            echo "  ⚠️  Skipping '{$title}' (already exists)\n";
            $skipped++;
            continue;
        }

        // Create the field group post
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

        // Save field group settings
        update_post_meta($post_id, '_edit_lock', time() . ':1');
        update_post_meta($post_id, '_key', $key);
        update_post_meta($post_id, '_location', maybe_serialize($field_group['location'] ?? []));
        update_post_meta($post_id, '_settings', maybe_serialize([
            'hide_on_screen' => $field_group['hide_screen'] ?? '',
            'active' => $field_group['active'] ?? true,
            'description' => $field_group['description'] ?? '',
            'instruction_placement' => $field_group['instruction_placement'] ?? 'label',
            'label_placement' => $field_group['label_placement'] ?? 'top',
            'style' => $field_group['style'] ?? 'default',
            'position' => $field_group['position'] ?? 'normal',
        ]));

        // Create fields
        if (!empty($field_group['fields'])) {
            $fields_to_save = [];
            foreach ($field_group['fields'] as $field) {
                $field['parent'] = $post_id;
                $fields_to_save[] = $field;
            }

            // Use ACF function if available
            if (function_exists('acf_save_fields')) {
                acf_save_fields($fields_to_save);
            } else {
                // Manual field saving
                foreach ($fields_to_save as $field) {
                    $field_key = $field['key'];
                    $field['ID'] = null;
                    $field['post_parent'] = $post_id;
                    $field['post_status'] = 'publish';

                    $field_id = wp_insert_post($field);
                    if (!is_wp_error($field_id)) {
                        update_post_meta($field_id, '_key', $field_key);
                        update_post_meta($field_id, '_name', $field['name']);
                        update_post_meta($field_id, '_type', $field['type']);

                        // Save sub fields for repeaters etc
                        if (!empty($field['sub_fields'])) {
                            foreach ($field['sub_fields'] as $sub_field) {
                                $sub_field['parent'] = $field_id;
                                $sub_field['ID'] = null;
                                $sub_field['post_status'] = 'publish';
                                $sub_field_id = wp_insert_post($sub_field);
                                if (!is_wp_error($sub_field_id)) {
                                    update_post_meta($sub_field_id, '_key', $sub_field['key']);
                                    update_post_meta($sub_field_id, '_name', $sub_field['name']);
                                    update_post_meta($sub_field_id, '_type', $sub_field['type']);
                                }
                            }
                        }
                    }
                }
            }
        }

        echo "  ✅ Imported '{$title}' (ID: {$post_id})\n";
        $imported++;
    }
}

echo "\n" . str_repeat('=', 40) . "\n";
echo "Import complete!\n";
echo "Imported: {$imported}\n";
echo "Skipped: {$skipped}\n";
echo str_repeat('=', 40) . "\n";
