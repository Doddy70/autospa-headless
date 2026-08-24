<?php
/**
 * Enable GraphQL introspection temporarily
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

echo "Enabling GraphQL public introspection...\n";

$settings = get_option('graphql_settings', []);

if (!is_array($settings)) {
    $settings = [];
}

// Enable public introspection
$settings['public_introspection'] = true;

// Save settings
update_option('graphql_settings', $settings);

echo "Settings updated.\n";
echo "Current settings:\n";
print_r($settings);
