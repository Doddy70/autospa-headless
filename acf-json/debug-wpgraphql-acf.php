<?php
/**
 * Debug wpgraphql-acf field registration
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

echo "=================================================\n";
echo "WPGraphQL ACF Debug\n";
echo "=================================================\n\n";

// Check if wpgraphql-acf is active
echo "1. WPGraphQL ACF Plugin Status:\n";
if (class_exists('WPGraphQLAcf')) {
    echo "   ✓ WPGraphQL ACF class exists\n";
} else {
    echo "   ✗ WPGraphQL ACF class NOT found\n";
}

// Check field groups with GraphQL enabled
echo "\n2. Field Groups with show_in_graphql:\n";
$field_groups = acf_get_field_groups();
$graphql_groups = 0;

foreach ($field_groups as $group) {
    $group_data = acf_get_field_group($group['key']);
    if (isset($group_data['show_in_graphql']) && $group_data['show_in_graphql']) {
        echo "   ✓ {$group['title']} (show_in_graphql: 1)\n";
        $graphql_groups++;
    } else {
        echo "   ○ {$group['title']} (show_in_graphql: not set)\n";
    }
}

echo "\n   Total with GraphQL: $graphql_groups / " . count($field_groups) . "\n";

// Check specific field group
echo "\n3. Checking Service Relationships group:\n";
$service_rel = acf_get_field_group('group_service_relationships');
if ($service_rel) {
    echo "   ✓ Found group_service_relationships\n";
    echo "   show_in_graphql: " . ($service_rel['show_in_graphql'] ?? 'NOT SET') . "\n";

    $fields = acf_get_fields($service_rel);
    echo "   Fields in group:\n";
    foreach ($fields as $field) {
        echo "     - {$field['label']} ({$field['name']}) type: {$field['type']}\n";
    }
} else {
    echo "   ✗ group_service_relationships NOT FOUND\n";
}

// Check if WPGraphQL is detecting the groups
echo "\n4. WPGraphQL ACF Field Group Detection:\n";
if (function_exists('graphql_acf_field_group_is_allowed')) {
    foreach ($field_groups as $group) {
        $allowed = graphql_acf_field_group_is_allowed($group);
        echo "   " . ($allowed ? '✓' : '✗') . " {$group['title']}: " . ($allowed ? 'allowed' : 'blocked') . "\n";
    }
} else {
    echo "   graphql_acf_field_group_is_allowed() function not found\n";
}

// Check WPGraphQL ACF options
echo "\n5. WPGraphQL Settings:\n";
$graphql_settings = get_option('graphql_settings', []);
if (!empty($graphql_settings)) {
    echo "   Settings found:\n";
    foreach ($graphql_settings as $key => $value) {
        if (is_array($value)) {
            echo "     $key: " . json_encode($value) . "\n";
        } else {
            echo "     $key: $value\n";
        }
    }
} else {
    echo "   No custom settings found\n";
}

echo "\n=================================================\n";
