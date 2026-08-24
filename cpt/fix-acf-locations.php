<?php
/**
 * Fix ACF Field Group Locations
 * Run once to associate field groups with CPTs
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

// Mapping of CPT names to their field groups
$cpt_mapping = [
    'service' => [
        'Service Hero',
        'Service Content',
        'Service Packages',
        'Service Gallery',
        'Service Relationships',
        'Service SEO',
    ],
    'location' => [
        'Location Identity',
        'Location Address',
        'Location Geo',
        'Business Hours',
        'Location Content',
        'Location Relationships',
        'Location Gallery',
    ],
    'project' => [
        'Project Content',
        'Project Media',
        'Project Relationships',
    ],
    'faq' => [
        'FAQ Content',
        'FAQ Context',
    ],
    'testimonial' => [
        'Testimonial Content',
        'Testimonial Media',
        'Testimonial Context',
    ],
    'post' => [
        'Post Relationships',
        'Migration Status',
    ],
];

echo "Fixing ACF Field Group Locations...\n";
echo str_repeat('=', 50) . "\n\n";

$updated = 0;
$errors = 0;

foreach ($cpt_mapping as $cpt => $group_names) {
    echo "Processing CPT: $cpt\n";

    foreach ($group_names as $group_name) {
        $posts = get_posts([
            'post_type' => 'acf-field-group',
            'title' => $group_name,
            'posts_per_page' => 1,
        ]);

        if ($posts) {
            $group_id = $posts[0]->ID;
            $location = [
                [
                    [
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => $cpt,
                    ]
                ]
            ];

            update_post_meta($group_id, '_location', maybe_serialize($location));
            echo "  ✓ Updated: $group_name\n";
            $updated++;
        } else {
            echo "  ✗ Not found: $group_name\n";
            $errors++;
        }
    }
    echo "\n";
}

echo str_repeat('=', 50) . "\n";
echo "Done!\n";
echo "Updated: $updated field groups\n";
echo "Errors: $errors\n";
