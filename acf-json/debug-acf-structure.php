<?php
/**
 * Debug ACF Field Structure
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

echo "=================================================\n";
echo "ACF Field Structure Debug\n";
echo "=================================================\n\n";

// Check a few field groups
$field_groups = acf_get_field_groups();

foreach ($field_groups as $group) {
    echo "Field Group: {$group['title']} (ID: {$group['ID']})\n";

    $fields = acf_get_fields($group);

    foreach ($fields as $field) {
        echo "  Field: {$field['label']} ({$field['name']})\n";
        echo "    Type: " . (isset($field['type']) ? $field['type'] : 'MISSING') . "\n";
        echo "    Key: " . (isset($field['key']) ? $field['key'] : 'MISSING') . "\n";
        echo "    Has 'type' key: " . (isset($field['type']) ? 'YES' : 'NO') . "\n";

        // Check for nested fields (repeater)
        if (isset($field['sub_fields']) && is_array($field['sub_fields'])) {
            echo "    Sub-fields:\n";
            foreach ($field['sub_fields'] as $sub_field) {
                echo "      - {$sub_field['label']}: " . (isset($sub_field['type']) ? $sub_field['type'] : 'MISSING') . "\n";
            }
        }
    }
    echo "\n";
}

echo "=================================================\n";
echo "Checking wpgraphql-acf raw_field structure...\n";
echo "=================================================\n\n";

// Get a specific field and check its structure
$test_field = acf_get_field('field_faq_question');

echo "Field from acf_get_field('field_faq_question'):\n";
echo "  type: " . (isset($test_field['type']) ? $test_field['type'] : 'MISSING') . "\n";
echo "  key: " . (isset($test_field['key']) ? $test_field['key'] : 'MISSING') . "\n";
echo "  name: " . (isset($test_field['name']) ? $test_field['name'] : 'MISSING') . "\n";
echo "  label: " . (isset($test_field['label']) ? $test_field['label'] : 'MISSING') . "\n";
echo "  All keys: " . implode(', ', array_keys($test_field)) . "\n";
