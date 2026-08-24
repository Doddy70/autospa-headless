<?php
/**
 * Fix ACF Field Group Locations - Direct Database Update
 * Fixes double-serialized location data
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

global $wpdb;

// Mapping of field group keys to CPTs
$mapping = [
    'service' => [
        'group_service_hero',
        'group_service_content',
        'group_service_packages',
        'group_service_media',
        'group_service_relationships',
        'group_service_seo',
    ],
    'location' => [
        'group_location_identity',
        'group_location_address',
        'group_location_geo',
        'group_location_business',
        'group_location_content',
        'group_location_relationships',
        'group_location_gallery',
    ],
    'project' => [
        'group_project_content',
        'group_project_media',
        'group_project_relationships',
    ],
    'faq' => [
        'group_faq_content',
        'group_faq_context',
    ],
    'testimonial' => [
        'group_testimonial_content',
        'group_testimonial_media',
        'group_testimonial_context',
    ],
    'post' => [
        'group_post_relationships',
        'group_migration_status',
    ],
];

echo "Fixing ACF Field Group Locations...\n";
echo str_repeat('=', 50) . "\n\n";

// Location structure for post_type
$location_template = [
    [
        [
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'post'
        ]
    ]
];

$updated = 0;

foreach ($mapping as $cpt => $keys) {
    echo "CPT: $cpt\n";

    foreach ($keys as $key) {
        // Find the field group by key
        $group_id = $wpdb->get_var($wpdb->prepare(
            "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_key' AND meta_value = %s LIMIT 1",
            $key
        ));

        if ($group_id) {
            // Create the correct location for this CPT
            $location = [
                [
                    [
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => $cpt
                    ]
                ]
            ];

            // Serialize once
            $serialized = maybe_serialize($location);

            // Update directly in database
            $wpdb->update(
                $wpdb->postmeta,
                ['meta_value' => $serialized],
                [
                    'post_id' => $group_id,
                    'meta_key' => '_location'
                ]
            );

            echo "  ✓ Fixed: $key -> $cpt\n";
            $updated++;
        } else {
            echo "  ✗ Not found: $key\n";
        }
    }
    echo "\n";
}

// Clear caches
wp_cache_flush();

echo str_repeat('=', 50) . "\n";
echo "Done! Updated $updated field groups.\n";
