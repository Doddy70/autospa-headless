<?php
/**
 * Enable Show in GraphQL for all ACF field groups
 * Run: wp eval-file enable-graphql-all-groups.php
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

echo "=================================================\n";
echo "Enabling Show in GraphQL for All Field Groups\n";
echo "=================================================\n\n";

$field_groups = get_posts([
    'post_type' => 'acf-field-group',
    'posts_per_page' => -1,
    'post_status' => 'publish',
]);

echo "Found " . count($field_groups) . " field groups\n\n";

$updated = 0;
$errors = 0;

foreach ($field_groups as $group) {
    echo "Processing: {$group->post_title} (ID: {$group->ID})\n";

    $settings = maybe_unserialize($group->post_content);

    if (!is_array($settings)) {
        echo "  ✗ Error: Could not parse settings\n";
        $errors++;
        continue;
    }

    // Check if already enabled
    if (isset($settings['show_in_graphql']) && $settings['show_in_graphql'] == 1) {
        echo "  → Already enabled\n";
        continue;
    }

    // Enable GraphQL
    $settings['show_in_graphql'] = 1;

    // Generate GraphQL field name (use post_name or sanitize title)
    $graphql_field_group_name = !empty($group->post_name)
        ? ucwords(str_replace(['-', '_'], ' ', $group->post_name))
        : $group->post_title;

    // Remove spaces for field group name
    $graphql_field_group_name = preg_replace('/\s+/', '', $graphql_field_group_name);

    $settings['graphql_field_group_name'] = $graphql_field_group_name;

    // Update post
    $result = wp_update_post([
        'ID' => $group->ID,
        'post_content' => maybe_serialize($settings),
    ]);

    if (is_wp_error($result)) {
        echo "  ✗ Error: " . $result->get_error_message() . "\n";
        $errors++;
    } else {
        echo "  ✓ Enabled (GraphQL name: {$graphql_field_group_name})\n";
        $updated++;
    }
}

echo "\n=================================================\n";
echo "Summary:\n";
echo "  Field groups processed: " . count($field_groups) . "\n";
echo "  Updated: $updated\n";
echo "  Errors: $errors\n";
echo "=================================================\n";

// Also check individual fields
echo "\nChecking individual field settings...\n\n";

$fields = get_posts([
    'post_type' => 'acf-field',
    'posts_per_page' => -1,
    'post_status' => 'publish',
]);

$fields_updated = 0;
foreach ($fields as $field) {
    $settings = maybe_unserialize($field->post_content);

    if (!is_array($settings)) {
        continue;
    }

    // Set default show_in_graphql for fields
    if (!isset($settings['show_in_graphql'])) {
        $settings['show_in_graphql'] = 1;
        wp_update_post([
            'ID' => $field->ID,
            'post_content' => maybe_serialize($settings),
        ]);
        $fields_updated++;
    }
}

echo "Individual fields checked: " . count($fields) . "\n";
echo "Fields updated: $fields_updated\n";
echo "\nDone! Clear GraphQL cache in WP Admin → GraphQL → Settings\n";
