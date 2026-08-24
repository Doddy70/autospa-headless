<?php
/**
 * AutoSP AJakarta - Create Test Relationship Data
 *
 * Creates test posts with bidirectional ACF relationship fields
 * to verify data structure and prepare for Phase 2D.6 (GraphQL testing)
 *
 * Run: wp eval-file create-test-relationships.php
 * WP-CLI: /www/server/php/82/bin/php /tmp/wp-cli.phar --path=/www/wwwroot/backend.autospajakarta.com --allow-root eval-file
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

echo "=================================================\n";
echo "AutoSP AJakarta - Test Relationship Data Creator\n";
echo "=================================================\n\n";

$WPA = 'wpa_'; // Database prefix

/**
 * Create a test Service post
 */
function create_test_service($title, $slug, $category) {
    // Check if exists
    $existing = get_page_by_path($slug, OBJECT, 'service');
    if ($existing) {
        echo "  → Service '$title' already exists (ID: {$existing->ID})\n";
        return $existing->ID;
    }

    $post_id = wp_insert_post([
        'post_type'    => 'service',
        'post_title'   => $title,
        'post_status'  => 'publish',
        'post_name'    => $slug,
        'post_content' => 'Test service content for ' . $title . '. Professional automotive detailing and protection services.',
    ]);

    if (is_wp_error($post_id)) {
        echo "  ✗ Error creating service: " . $post_id->get_error_message() . "\n";
        return null;
    }

    // Set ACF fields
    update_post_meta($post_id, 'short_description', 'Professional ' . $title . ' service with premium quality.');
    update_post_meta($post_id, 'service_category', $category);
    update_post_meta($post_id, 'seo_title', $title . ' | AutoSP Jakarta');
    update_post_meta($post_id, 'seo_description', 'Get the best ' . strtolower($title) . ' at AutoSP Jakarta.');

    echo "  ✓ Created Service: $title (ID: $post_id)\n";
    return $post_id;
}

/**
 * Create a test Location post
 */
function create_test_location($title, $slug, $city = 'Jakarta Utara') {
    // Check if exists
    $existing = get_page_by_path($slug, OBJECT, 'location');
    if ($existing) {
        echo "  → Location '$title' already exists (ID: {$existing->ID})\n";
        return $existing->ID;
    }

    $post_id = wp_insert_post([
        'post_type'    => 'location',
        'post_title'   => $title,
        'post_status'  => 'publish',
        'post_name'    => $slug,
        'post_content' => 'Welcome to ' . $title . ', your trusted auto detailing partner.',
    ]);

    if (is_wp_error($post_id)) {
        echo "  ✗ Error creating location: " . $post_id->get_error_message() . "\n";
        return null;
    }

    // Set ACF fields
    update_post_meta($post_id, 'location_status', 'active');
    update_post_meta($post_id, 'location_phone', '021-12345678');
    update_post_meta($post_id, 'location_whatsapp', '6281234567890');
    update_post_meta($post_id, 'address_street', 'Jl. Test AutoSP No. ' . substr($post_id, -2));
    update_post_meta($post_id, 'address_district', 'Test District');
    update_post_meta($post_id, 'address_city', $city);
    update_post_meta($post_id, 'address_province', 'DKI Jakarta');
    update_post_meta($post_id, 'address_postal_code', '14440');
    update_post_meta($post_id, 'geo_latitude', '-6.1' . rand(1000, 9999) / 10000);
    update_post_meta($post_id, 'geo_longitude', '106.8' . rand(1000, 9999) / 10000);

    echo "  ✓ Created Location: $title (ID: $post_id)\n";
    return $post_id;
}

/**
 * Create a test Project post
 */
function create_test_project($title, $slug, $brand, $model) {
    // Check if exists
    $existing = get_page_by_path($slug, OBJECT, 'project');
    if ($existing) {
        echo "  → Project '$title' already exists (ID: {$existing->ID})\n";
        return $existing->ID;
    }

    $post_id = wp_insert_post([
        'post_type'    => 'project',
        'post_title'   => $title,
        'post_status'  => 'publish',
        'post_name'    => $slug,
        'post_content' => 'Completed ' . $title . ' project.',
    ]);

    if (is_wp_error($post_id)) {
        echo "  ✗ Error creating project: " . $post_id->get_error_message() . "\n";
        return null;
    }

    // Set ACF fields
    update_post_meta($post_id, 'vehicle_brand', $brand);
    update_post_meta($post_id, 'vehicle_model', $model);
    update_post_meta($post_id, 'vehicle_year', '2024');
    update_post_meta($post_id, 'vehicle_color', 'Black');
    update_post_meta($post_id, 'project_challenge', 'Customer needed protection for new vehicle.');
    update_post_meta($post_id, 'project_solution', 'Applied professional ceramic coating.');
    update_post_meta($post_id, 'project_result', 'Excellent finish with long-lasting protection.');
    update_post_meta($post_id, 'completed_at', date('Y-m-d'));

    echo "  ✓ Created Project: $title (ID: $post_id)\n";
    return $post_id;
}

/**
 * Create a test FAQ post
 */
function create_test_faq($title, $slug, $question) {
    // Check if exists
    $existing = get_page_by_path($slug, OBJECT, 'faq');
    if ($existing) {
        echo "  → FAQ '$title' already exists (ID: {$existing->ID})\n";
        return $existing->ID;
    }

    $post_id = wp_insert_post([
        'post_type'    => 'faq',
        'post_title'   => $title,
        'post_status'  => 'publish',
        'post_name'    => $slug,
        'post_content' => $question . ' - Test answer content.',
    ]);

    if (is_wp_error($post_id)) {
        echo "  ✗ Error creating FAQ: " . $post_id->get_error_message() . "\n";
        return null;
    }

    // Set ACF fields
    update_post_meta($post_id, 'faq_question', $question);
    update_post_meta($post_id, 'faq_category', 'general');
    update_post_meta($post_id, 'faq_order', rand(1, 100));

    echo "  ✓ Created FAQ: $title (ID: $post_id)\n";
    return $post_id;
}

/**
 * Create a test Testimonial post
 */
function create_test_testimonial($title, $slug, $name, $quote) {
    // Check if exists
    $existing = get_page_by_path($slug, OBJECT, 'testimonial');
    if ($existing) {
        echo "  → Testimonial '$title' already exists (ID: {$existing->ID})\n";
        return $existing->ID;
    }

    $post_id = wp_insert_post([
        'post_type'    => 'testimonial',
        'post_title'   => $title,
        'post_status'  => 'publish',
        'post_name'    => $slug,
        'post_content' => $quote,
    ]);

    if (is_wp_error($post_id)) {
        echo "  ✗ Error creating testimonial: " . $post_id->get_error_message() . "\n";
        return null;
    }

    // Set ACF fields
    update_post_meta($post_id, 'customer_name', $name);
    update_post_meta($post_id, 'customer_role', 'Customer');
    update_post_meta($post_id, 'customer_quote', $quote);
    update_post_meta($post_id, 'testimonial_source', 'website');
    update_post_meta($post_id, 'testimonial_featured', 1);

    echo "  ✓ Created Testimonial: $title (ID: $post_id)\n";
    return $post_id;
}

/**
 * Link Service to Location (bidirectional)
 */
function link_service_to_location($service_id, $location_id) {
    // Update Service's related_locations
    $service_locations = get_post_meta($service_id, 'related_locations', true);
    if (empty($service_locations)) {
        $service_locations = [];
    }
    if (!is_array($service_locations)) {
        $service_locations = [$service_locations];
    }
    if (!in_array($location_id, $service_locations)) {
        $service_locations[] = $location_id;
        update_post_meta($service_id, 'related_locations', $service_locations);
    }

    // Update Location's location_services
    $location_services = get_post_meta($location_id, 'location_services', true);
    if (empty($location_services)) {
        $location_services = [];
    }
    if (!is_array($location_services)) {
        $location_services = [$location_services];
    }
    if (!in_array($service_id, $location_services)) {
        $location_services[] = $service_id;
        update_post_meta($location_id, 'location_services', $location_services);
    }

    echo "    ↔ Linked Service $service_id ↔ Location $location_id\n";
}

/**
 * Link Service to Project (bidirectional)
 */
function link_service_to_project($service_id, $project_id) {
    // Update Service's related_projects
    $service_projects = get_post_meta($service_id, 'related_projects', true);
    if (empty($service_projects)) {
        $service_projects = [];
    }
    if (!is_array($service_projects)) {
        $service_projects = [$service_projects];
    }
    if (!in_array($project_id, $service_projects)) {
        $service_projects[] = $project_id;
        update_post_meta($service_id, 'related_projects', $service_projects);
    }

    // Update Project's project_service
    update_post_meta($project_id, 'project_service', $service_id);

    echo "    ↔ Linked Service $service_id ↔ Project $project_id\n";
}

/**
 * Link Service to FAQ (bidirectional)
 */
function link_service_to_faq($service_id, $faq_id) {
    // Update Service's related_faqs
    $service_faqs = get_post_meta($service_id, 'related_faqs', true);
    if (empty($service_faqs)) {
        $service_faqs = [];
    }
    if (!is_array($service_faqs)) {
        $service_faqs = [$service_faqs];
    }
    if (!in_array($faq_id, $service_faqs)) {
        $service_faqs[] = $faq_id;
        update_post_meta($service_id, 'related_faqs', $service_faqs);
    }

    // Update FAQ's faq_service
    update_post_meta($faq_id, 'faq_service', $service_id);

    echo "    ↔ Linked Service $service_id ↔ FAQ $faq_id\n";
}

/**
 * Link Location to FAQ (bidirectional)
 */
function link_location_to_faq($location_id, $faq_id) {
    // Update Location's location_faqs
    $location_faqs = get_post_meta($location_id, 'location_faqs', true);
    if (empty($location_faqs)) {
        $location_faqs = [];
    }
    if (!is_array($location_faqs)) {
        $location_faqs = [$location_faqs];
    }
    if (!in_array($faq_id, $location_faqs)) {
        $location_faqs[] = $faq_id;
        update_post_meta($location_id, 'location_faqs', $location_faqs);
    }

    // Update FAQ's faq_location
    update_post_meta($faq_id, 'faq_location', $location_id);

    echo "    ↔ Linked Location $location_id ↔ FAQ $faq_id\n";
}

/**
 * Link Testimonial to Service and Location (bidirectional)
 */
function link_testimonial($testimonial_id, $service_id, $location_id) {
    // Update Testimonial's testimonial_service
    update_post_meta($testimonial_id, 'testimonial_service', $service_id);

    // Update Testimonial's testimonial_location
    update_post_meta($testimonial_id, 'testimonial_location', $location_id);

    // Update Location's location_testimonials
    $location_testimonials = get_post_meta($location_id, 'location_testimonials', true);
    if (empty($location_testimonials)) {
        $location_testimonials = [];
    }
    if (!is_array($location_testimonials)) {
        $location_testimonials = [$location_testimonials];
    }
    if (!in_array($testimonial_id, $location_testimonials)) {
        $location_testimonials[] = $testimonial_id;
        update_post_meta($location_id, 'location_testimonials', $location_testimonials);
    }

    echo "    ↔ Linked Testimonial $testimonial_id → Service $service_id, Location $location_id\n";
}

// ============================================================
// MAIN EXECUTION
// ============================================================

echo "\n[1/5] Creating Services...\n";
$service_ids = [];

// Create 3 test services
$service_ids['ceramic'] = create_test_service(
    'Nano Ceramic Coating',
    'test-nano-ceramic-coating',
    'coating'
);

$service_ids['ppf'] = create_test_service(
    'Paint Protection Film',
    'test-paint-protection-film',
    'protection'
);

$service_ids['detailing'] = create_test_service(
    'Auto Detailing Premium',
    'test-auto-detailing-premium',
    'detailing'
);

echo "\n[2/5] Creating Locations...\n";
$location_ids = [];

// Create 2 test locations
$location_ids['pluit'] = create_test_location(
    'AutoSP Pluit',
    'test-autosp-pluit',
    'Jakarta Utara'
);

$location_ids['pik'] = create_test_location(
    'AutoSP PIK 2',
    'test-autosp-pik2',
    'Jakarta Utara'
);

echo "\n[3/5] Creating Projects...\n";
$project_ids = [];

// Create 2 test projects
$project_ids['alphard'] = create_test_project(
    'Toyota Alphard Ceramic',
    'test-toyota-alphard-ceramic',
    'Toyota',
    'Alphard'
);

$project_ids['civic'] = create_test_project(
    'Honda Civic PPF',
    'test-honda-civic-ppf',
    'Honda',
    'Civic'
);

echo "\n[4/5] Creating FAQs...\n";
$faq_ids = [];

// Create 3 test FAQs
$faq_ids['harga'] = create_test_faq(
    'Berapa Harga Ceramic Coating?',
    'test-harga-ceramic-coating',
    'Berapa harga layanan ceramic coating di AutoSP?'
);

$faq_ids['durasi'] = create_test_faq(
    'Berapa Lama Proses Coating?',
    'test-durasi-proses-coating',
    'Berapa lama proses ceramic coating selesai?'
);

$faq_ids['garansi'] = create_test_faq(
    'Apakah Ada Garansi?',
    'test-garansi-coating',
    'Apakah AutoSP memberikan garansi untuk layanan coating?'
);

echo "\n[5/5] Creating Testimonials...\n";
$testimonial_ids = [];

// Create 2 test testimonials
$testimonial_ids['john'] = create_test_testimonial(
    'John Doe - Alphard Owner',
    'test-john-doe-alphard',
    'John Doe',
    'Pelayanan sangat profesional. Alphard saya langsung terlihat like new setelah ceramic coating!'
);

$testimonial_ids['jane'] = create_test_testimonial(
    'Jane Smith - Civic Owner',
    'test-jane-smith-civic',
    'Jane Smith',
    'PPF yang dipasang di AutoSP sangat rapi. Worth every penny!'
);

echo "\n=================================================\n";
echo "Creating Relationships (Bidirectional Links)...\n";
echo "=================================================\n\n";

// Service → Location (Ceramic → Pluit & PIK)
echo "[S1] Linking Ceramic Service to Locations...\n";
link_service_to_location($service_ids['ceramic'], $location_ids['pluit']);
link_service_to_location($service_ids['ceramic'], $location_ids['pik']);

// Service → Location (PPF → PIK only)
echo "\n[S2] Linking PPF Service to Location...\n";
link_service_to_location($service_ids['ppf'], $location_ids['pik']);

// Service → Location (Detailing → Pluit)
echo "\n[S3] Linking Detailing Service to Location...\n";
link_service_to_location($service_ids['detailing'], $location_ids['pluit']);

// Service → Project
echo "\n[P1] Linking Services to Projects...\n";
link_service_to_project($service_ids['ceramic'], $project_ids['alphard']);
link_service_to_project($service_ids['ppf'], $project_ids['civic']);

// Service → FAQ
echo "\n[F1] Linking Services to FAQs...\n";
link_service_to_faq($service_ids['ceramic'], $faq_ids['harga']);
link_service_to_faq($service_ids['ceramic'], $faq_ids['durasi']);
link_service_to_faq($service_ids['ceramic'], $faq_ids['garansi']);
link_service_to_faq($service_ids['ppf'], $faq_ids['garansi']);

// Location → FAQ
echo "\n[F2] Linking Locations to FAQs...\n";
link_location_to_faq($location_ids['pluit'], $faq_ids['harga']);
link_location_to_faq($location_ids['pluit'], $faq_ids['durasi']);
link_location_to_faq($location_ids['pik'], $faq_ids['garansi']);

// Testimonials
echo "\n[T1] Linking Testimonials...\n";
link_testimonial($testimonial_ids['john'], $service_ids['ceramic'], $location_ids['pluit']);
link_testimonial($testimonial_ids['jane'], $service_ids['ppf'], $location_ids['pik']);

// Related Services (self-reference for similar services)
echo "\n[R1] Linking Related Services...\n";
$related_services = [$service_ids['ceramic'], $service_ids['ppf']];
update_post_meta($service_ids['ceramic'], 'related_services', $related_services);
update_post_meta($service_ids['ppf'], 'related_services', [$service_ids['ceramic']]);
echo "    ↔ Service {$service_ids['ceramic']} ↔ Services (self)\n";
echo "    ↔ Service {$service_ids['ppf']} ↔ Service {$service_ids['ceramic']}\n";

// ============================================================
// VERIFICATION
// ============================================================

echo "\n=================================================\n";
echo "Verification - Querying Relationship Data...\n";
echo "=================================================\n\n";

$relationships_to_check = [
    'service' => [
        'related_locations',
        'related_projects',
        'related_faqs',
        'related_services',
        'service_category'
    ],
    'location' => [
        'location_services',
        'location_testimonials',
        'location_faqs'
    ],
    'project' => [
        'project_service',
        'project_location'
    ],
    'faq' => [
        'faq_service',
        'faq_location'
    ],
    'testimonial' => [
        'testimonial_service',
        'testimonial_location'
    ]
];

foreach ($relationships_to_check as $cpt => $fields) {
    echo "[$cpt] Relationship Fields:\n";

    $post_id_key = $cpt . '_ids';
    $ids = $$post_id_key;
    $sample_id = reset($ids);

    foreach ($fields as $field) {
        $value = get_post_meta($sample_id, $field, true);
        if (!empty($value)) {
            if (is_array($value)) {
                echo "  ✓ $field: " . implode(', ', $value) . "\n";
            } else {
                echo "  ✓ $field: $value\n";
            }
        } else {
            echo "  ○ $field: (empty)\n";
        }
    }
    echo "\n";
}

echo "=================================================\n";
echo "Test Data Creation Complete!\n";
echo "=================================================\n";
echo "\nCreated Posts:\n";
echo "  Services:     " . implode(', ', $service_ids) . "\n";
echo "  Locations:     " . implode(', ', $location_ids) . "\n";
echo "  Projects:      " . implode(', ', $project_ids) . "\n";
echo "  FAQs:          " . implode(', ', $faq_ids) . "\n";
echo "  Testimonials:  " . implode(', ', $testimonial_ids) . "\n";
echo "\nNext Steps:\n";
echo "  1. Test GraphQL queries (Phase 2D.6 requires wp-graphql-acf plugin)\n";
echo "  2. Verify bidirectional relationships in GraphQL schema\n";
echo "  3. Proceed to Phase 2D.6 for ACF GraphQL integration\n";
echo "\n";
