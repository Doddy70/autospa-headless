<?php
/**
 * Check ACF field key mappings
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

echo "Checking ACF field structure for Service...\n\n";

// Get Service Content field group
$group = acf_get_field_group('group_service_relationships');
echo "Field Group: {$group['title']}\n";

$fields = acf_get_fields($group);
foreach ($fields as $field) {
    echo "Field: {$field['label']} ({$field['name']})\n";
    echo "  Type: {$field['type']}\n";
    echo "  Key: {$field['key']}\n";
    if (isset($field['post_type'])) {
        echo "  Post Types: " . implode(', ', $field['post_type']) . "\n";
    }
    echo "\n";
}

// Check the meta key vs field name
echo "Checking meta for Service 6994:\n";
$meta = get_post_meta(6994);
foreach ($meta as $key => $value) {
    if (strpos($key, 'related') !== false || strpos($key, 'location') !== false) {
        $decoded = is_serialized($value[0]) ? unserialize($value[0]) : $value[0];
        echo "  Meta key: $key = " . json_encode($decoded) . "\n";
    }
}
