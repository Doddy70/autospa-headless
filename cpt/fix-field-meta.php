<?php
/**
 * Fix ACF Field Meta
 * Fixes missing _key, _name, _type meta for imported fields
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

echo "Fixing ACF Field Meta...\n";
echo str_repeat('=', 50) . "\n\n";

// Get all field posts
$fields = get_posts([
    'post_type' => 'acf-field',
    'posts_per_page' => -1,
]);

echo "Processing " . count($fields) . " fields...\n\n";

$fixed = 0;

foreach ($fields as $field) {
    // Get field data from post content
    $content = json_decode($field->post_content, true);

    if (!$content) {
        // Try to find the field in the JSON files
        $json_dir = '/www/wwwroot/backend.autospajakarta.com/acf-json';
        $files = glob($json_dir . '/*.json');

        foreach ($files as $file) {
            $json = file_get_contents($file);
            $field_groups = json_decode($json, true);

            if (is_array($field_groups)) {
                foreach ($field_groups as $fg) {
                    if (!empty($fg['fields'])) {
                        foreach ($fg['fields'] as $f) {
                            if ($f['label'] === $field->post_title || $f['key'] === get_post_meta($field->ID, '_key', true)) {
                                $content = $f;
                                break 3;
                            }
                        }
                    }
                }
            }
        }
    }

    if ($content) {
        // Update meta keys
        if (empty(get_post_meta($field->ID, '_key', true))) {
            update_post_meta($field->ID, '_key', $content['key'] ?? '');
        }
        if (empty(get_post_meta($field->ID, '_name', true))) {
            update_post_meta($field->ID, '_name', $content['name'] ?? '');
        }
        if (empty(get_post_meta($field->ID, '_type', true))) {
            update_post_meta($field->ID, '_type', $content['type'] ?? 'text');
        }

        // Update other properties
        $skip_keys = ['key', 'label', 'name', 'type', 'parent', 'menu_order'];
        foreach ($content as $prop => $value) {
            if (!in_array($prop, $skip_keys)) {
                $meta_key = $prop;
                update_post_meta($field->ID, $meta_key, $value);
            }
        }

        $fixed++;
        echo "  ✓ Fixed: {$field->post_title} ({$content['name']})\n";

        // Process sub fields
        if (!empty($content['sub_fields'])) {
            $sub_fields = get_posts([
                'post_type' => 'acf-field',
                'post_parent' => $field->ID,
                'posts_per_page' => -1,
            ]);

            foreach ($sub_fields as $sub_field) {
                foreach ($content['sub_fields'] as $sub_content) {
                    if ($sub_content['label'] === $sub_field->post_title) {
                        update_post_meta($sub_field->ID, '_key', $sub_content['key'] ?? '');
                        update_post_meta($sub_field->ID, '_name', $sub_content['name'] ?? '');
                        update_post_meta($sub_field->ID, '_type', $sub_content['type'] ?? 'text');

                        foreach ($sub_content as $prop => $value) {
                            if (!in_array($prop, $skip_keys)) {
                                update_post_meta($sub_field->ID, $prop, $value);
                            }
                        }

                        echo "    + Sub: {$sub_field->post_title} ({$sub_content['name']})\n";
                        break;
                    }
                }
            }
        }
    } else {
        echo "  ⚠ Could not find data for: {$field->post_title}\n";
    }
}

echo "\n" . str_repeat('=', 50) . "\n";
echo "Fixed: {$fixed} fields\n";

// Clear cache
wp_cache_flush();
