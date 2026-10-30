<?php
/**
 * Seed the Service CPT from the published production content.
 *
 * WHAT THIS DOES
 *
 * The staging install had no `service` records at all - the CPT was never
 * registered, and the Phase 2D.7 test dataset is gone. This script creates
 * the six published services, the ten service FAQs and the one branch, using
 * the content that the production site publishes (the same content the
 * frontend mirrors in `src/data/services.ts`).
 *
 * Nothing is invented: every string comes from the published production
 * pages. Where production publishes no price, no price is written.
 *
 * The media is imported into the WordPress library first, so the ACF image
 * fields point at real attachment IDs instead of bare URLs.
 *
 * USAGE
 *
 *   wp eval-file acf-json/seed-service-content.php
 *
 *   or, with a dry run:
 *   AUTOSP_SEED=dry wp eval-file acf-json/seed-service-content.php
 *
 * The script is idempotent: it matches on the slug and updates in place.
 *
 * IMPORTANT - the relationship writes
 *
 * An ACF `relationship` field stores an ARRAY of post IDs. Writing a bare
 * scalar makes the field resolve to `null` in GraphQL - that was finding 1
 * of the Phase 2D.9 report. `write_relation()` below always writes an
 * array, and it also writes the `_<field>` reference meta, without which
 * the wp-admin editor cannot find the value and the next manual update
 * erases it.
 */

if (!defined('ABSPATH')) {
    require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';
}

error_reporting(E_ERROR | E_PARSE);

/*
 * The mode is kept in a constant, not in a variable.
 *
 * `wp eval-file` includes the file inside a method, so a top level
 * `$dry_run = true` is a LOCAL variable of that include - and a `global
 * $dry_run` inside a helper function cannot see it. That made the dry run
 * write anyway. A constant is visible everywhere, so the guard works.
 */
define('AUTOSP_SEED_DRY', strtolower((string) (getenv('AUTOSP_SEED') ?: '')) === 'dry');

echo "=================================================\n";
echo AUTOSP_SEED_DRY ? "Seeding service content (DRY RUN)\n" : "Seeding service content\n";
echo "=================================================\n\n";

/**
 * The published services.
 *
 * Source: the production service pages, mirrored in
 * `src/data/services.ts` of the frontend repository.
 */
$services = [
    [
        'slug'        => 'premium-wash',
        'title'       => 'Premium Wash',
        'category'    => 'wash',
        'tagline'     => 'A car wash service that uses high-quality products and procedures to thoroughly clean the car, both exterior and interior.',
        'description' => 'A more thorough and detailed car wash service compared to a regular car wash. The Premium Wash focuses on a thorough exterior, interior and undercarriage refresh, using a two-bucket wash method with a pH-balanced shampoo that is 100% safe for ceramic-coated cars.',
        'hero'        => '2025/07/Premium-Car-Wash-Hero4.jpg',
        'highlights'  => [
            'Wash takes between 30 to 60 minutes',
            'Add-ons: interior and exterior detailing, window water-spot removal, express spray sealant',
            'Two-bucket method avoids swirl marks and does not degrade paint protection',
        ],
        'packages'    => [
            ['Premium Wash', '+ Undercarriage Wash', ['Thorough exterior, interior and undercarriage refresh', 'Two-bucket wash method with pH-balanced shampoo', 'Coating-safe chemicals - 100% safe for ceramic-coated cars']],
            ['Full Detox', '', []],
            ['Light Detox', '', []],
        ],
        'gallery'     => ['2025/07/Premium-Car-Wash-Hero4.jpg', '2026/10/washme.jpg', '2026/05/24.jpg'],
        'faqs'        => [
            ['How long does the wash process take?', 'The process typically takes between 30 to 60 minutes. This duration allows our team to meticulously clean your vehicle’s exterior, including a thorough undercarriage cleaning, while still being highly efficient with your valuable time.'],
            ['How often should I get a Premium Wash?', 'To maintain your car’s pristine condition, we highly recommend a Premium Wash minimal every weekly. Regular washing is crucial to prevent dirt buildup, and it ensures your vehicle always looks fresh and glossy as if it just rolled out of the spa.'],
            ['Can I customize the Premium Wash service?', 'While the Premium Wash focuses on a thorough exterior, interior and undercarriage refresh, you can easily upgrade your visit. We offer excellent add-ons such as interior and exterior detailing, window water-spot removal, or an express spray sealant application. Just ask our Service Advisor upon arrival!'],
            ['What’s the difference between the Premium Wash and a regular wash?', 'Unlike a standard street wash that often uses harsh detergents, our Premium Wash strictly utilizes a two-bucket wash method and a pH-balanced shampoo specially formulated to be 100% safe for ceramic-coated cars. Furthermore, our service includes a dedicated undercarriage cleaning, ensuring your vehicle is deeply refreshed from top to bottom without risking swirl marks or degrading your paint protection.'],
            ['Is the Premium Wash worth the investment?', 'Definitely. Think of it as the ultimate routine maintenance for your vehicle. You get the absolute peace of mind knowing your car is washed using coating-safe chemicals, proper scratch-free techniques, and detailed attention to the undercarriage. It is the smartest and most affordable way to safely maintain your car’s daily shine.'],
        ],
    ],
    [
        'slug'        => 'premium-detailing',
        'title'       => 'Premium Detailing',
        'category'    => 'detailing',
        'tagline'     => 'We provide a Premium Service & produce Premium Results.',
        'description' => 'A comprehensive car treatment that includes deep cleaning, polishing, and exterior and interior protection. Experience a complete transformation inside and out: we meticulously restore your exterior paint’s flawless gloss and perform a deep interior cleaning, leaving your vehicle looking and feeling brand new.',
        'hero'        => '2024/08/Slider-3.jpg',
        'highlights'  => [
            'Recommended every 3 to 6 months',
            'High-quality, environmentally friendly and non-toxic products',
            'Regular detailing helps maintain resale value',
        ],
        'packages'    => [
            ['Interior Detailing', 'Deep clean of carpets, plastics and leather', ['Cleaning, removing dirt and maintaining the condition of the interior', 'Includes carpets, plastics and leather', 'Aims to restore the interior to a like-new condition']],
            ['Exterior Detailing', 'Paint correction and gloss restoration', ['Deep clean of the exterior, polishing and protecting the surfaces', 'Paint correction, waxing and scratch-free techniques']],
            ['Full Detailing', 'Inside and out - usually 4 to 7 hours', ['Cleaning and refreshing the outside and the inside of the vehicle', 'Changing the oil and the filters, and repainting', 'Typically takes between 4 to 7 hours, depending on the condition of the car']],
        ],
        'gallery'     => ['2024/08/Slider-3.jpg', '2024/08/Slider-45.jpg', '2026/05/24.jpg'],
        'faqs'        => [
            ['What is auto detailing?', 'Auto detailing is a thorough cleaning and restoration of both the interior and exterior of your vehicle. It goes beyond a regular car wash and includes deep cleaning, polishing, and protecting your car’s surfaces.'],
            ['How long does it typically take you to detail my vehicle?', 'That depends on a few things such as size of the vehicle, condition, package selection & any add on service you may choose. We will give you an estimate of how long it takes.'],
            ['What is the difference between a car wash and a detailing?', 'A car wash typically involves a basic exterior wash and may include a quick cleaning of the interior. It’s a fast, surface-level clean meant to remove dirt and debris. A detailing, on the other hand, is a comprehensive cleaning and restoration process. It includes a deep clean of both the interior and exterior, such as paint correction, waxing, upholstery conditioning, and other services aimed at restoring your vehicle’s appearance and protecting its surfaces.'],
            ['How often should I get my car detailed?', 'It depends on how often you use your car and the conditions it’s exposed to. Typically, we recommend a thorough detailing every 3-6 months, but if you drive often or in harsh conditions, more frequent detailing may be necessary.'],
            ['Are the products you use safe for my vehicle?', 'Yes, all of the products we use are high-quality, safe, and specifically designed for automotive use. We choose environmentally friendly and non-toxic options whenever possible.'],
            ['Will detailing my car improve its resale value?', 'Yes! Regular detailing helps maintain your car’s appearance and condition, which can positively affect its resale value. A clean, well-maintained car is always more attractive to potential buyers.'],
        ],
    ],
    [
        'slug'        => 'premium-coating',
        'title'       => 'Premium Coating',
        'category'    => 'coating',
        'tagline'     => 'Add years of protection with hydrophobic ceramic coating. Shields against UV rays, dirt, and scratches - making your car easier to clean and stay glossy longer.',
        'description' => 'A coating technology that uses nanoparticles to protect against scratches, stains, water, dust, UV rays, and other environmental elements. Car coating protects your car from ultra violet rays, preventing your car paint from dulling and fading.',
        'hero'        => '2024/08/Slider-45.jpg',
        'highlights'  => [
            'Hydrophobic surface - easier to clean and stays glossy longer',
            'Protects against UV rays, dirt, dust, water and stains',
            'Layer count grows with the package: 2, 3, 5, 7 up to 10 layers',
        ],
        'packages'    => [
            ['Light Package', 'Double Layer Nano Ceramic Coating Package', ['Full Car Detailing (Kolong, Mesin, Interior, Body, Velg, Kaca)', 'Full Body Coating (9H), Windshield Coating (kaca depan)', '1 year Member Maintenance']],
            ['Bronze Package', 'Double Layer Nano Ceramic Coating Package', ['Full Car Detailing (Undercarriage, Engine, Interior, Body, Wheel, Glass)', 'Full Body Coating (9H), Full Window Coating, Plastic Coating, Velg Coating', '2 year Member Maintenance']],
            ['Silver Package', 'Nano Ceramic Coating Triple Layer Package', ['Full Car Detailing (Undercarriage, Engine, Interior, Body, Wheel, Glass)', 'Full Body Coating (9H+), Full Window Coating, Plastic Coating, Velg Coating', '3 year Member Maintenance']],
            ['Gold Package', 'Nano Ceramic Coating 5 Layers package', ['Full Car Detailing (Undercarriage, Engine, Interior, Body, Wheel, Glass)', 'Full Body Coating (10H), Full Window Coating, Plastic Coating, Velg Coating', '4 year Member Maintenance']],
            ['Diamond Package', 'Nano Ceramic Coating 7 Layers package', ['Full Car Detailing (Undercarriage, Engine, Interior, Body, Wheel, Glass)', 'Full Body Coating (10H+), Full Window Coating, Plastic Coating, Velg Coating', 'Full Leather Coating and Interior Coating', '5 year Member Maintenance']],
            ['Platinum Package', 'Nano Ceramic Coating 10 Layers package', ['Full Car Detailing (Undercarriage, Engine, Interior, Body, Wheel, Glass)', 'Full Body Coating (10H+), Full Window Coating, Plastic Coating, Velg Coating', 'Full Leather Coating and Interior Coating', 'Lifetime Member Maintenance']],
        ],
        'gallery'     => ['2024/08/Slider-45.jpg', '2025/11/Auto-Detailing-1.jpg', '2026/05/5-1.jpg'],
        'faqs'        => [
            ['What is a nano ceramic coating?', 'Nano ceramic coating is a special protective coating for vehicle surfaces made of nano-technological particles. It provides long-term protection from dirt, dust and contaminants, and enhances the appearance of your vehicle.'],
            ['How long does a paint protection film last?', 'The lifespan of a paint protection film depends on the weather conditions and the quality of the film. Generally, PPF lasts for 5-8 years.'],
        ],
    ],
    [
        'slug'        => 'premium-360-ppf',
        'title'       => 'Premium 360° PPF',
        'category'    => 'protection',
        'tagline'     => 'Our Premium 360° PPF provides the ultimate armor for your vehicle. We meticulously wrap the entire exterior with a high-gloss, self-healing transparent film, safeguarding your factory paint against rock chips, deep scratches, and harsh elements.',
        'description' => 'Wrapping the entire exterior of a vehicle with a clear, self-healing film to protect the paint from various types of damage. A clear protective coating that covers the entire surface of the car body, providing maximum protection against scratches, gravel, stains, and UV damage.',
        'hero'        => '2026/05/PPF.jpg',
        'highlights'  => [
            'Full Body Car Detailing (Undercarriage, Machine, Interior, Body, Velg & Glass)',
            'Full Window Coating, Plastic Coating & Velg Coating',
            'Full Leather Coating & Interior Coating',
        ],
        'packages'    => [
            ['Daily PPF Package', '170 Micron Thickness & Self Curing', ['Up to 2 years Membership Maintenance', 'TPU Made in PRC', 'Durability Up to 3 years (depend on care & use)']],
            ['Premium PPF Package', '200 Micron Thickness & Self Curing', ['Up to 5 years Membership Maintenance', 'High Grade TPU Made in USA', 'Durability Up to 7 years (depend on care & use)']],
            ['Ultimate PPF Package', '230 Micron Thickness & Self Curing', ['Up to 8 years Membership Maintenance', 'High Grade TPU Made in USA', 'Durability Up to 10 years (depend on care & use)']],
        ],
        'gallery'     => ['2026/05/PPF.jpg', '2025/07/choose-1.png', '2026/05/6_1.jpg'],
        'faqs'        => [
            ['What is a paint protection film (PPF)?', 'Paint Protection Film (PPF) is a protective coating for your car’s surface designed to protect against scratches, dirt and sun damage. It is applied precisely over the surface of your vehicle to protect the color from the elements.'],
            ['How long does a paint protection film last?', 'The lifespan of a paint protection film depends on the weather conditions and the quality of the film. Generally, PPF lasts for 5-8 years.'],
            ['How do I clean paint protection film?', 'You can clean the PPF by using car soap and water. Use a soft sponge and don’t forget to moisten the sponge with water before cleaning the PPF. You can also use special products to maintain and clean the PPF.'],
        ],
    ],
    [
        'slug'        => 'engine-glass',
        'title'       => 'Engine & Glass',
        'category'    => 'other',
        'tagline'     => 'Restore your visibility and under-hood aesthetics. We thoroughly remove stubborn water spots from all windows and meticulously degrease your engine bay, finishing with a premium dressing for a fresh, like-new look.',
        'description' => 'Engine & Glass is the refresh service for the two areas that take the most abuse: the engine bay and the glass. It is listed on production as part of the service lineup and as an additional service that can be added to a wash or detailing visit.',
        'hero'        => '2026/05/Engine-BAy.jpg',
        'highlights'  => [
            'Removal of stubborn water spots from all windows',
            'Meticulous degreasing of the engine bay',
            'Premium finishing dressing for a fresh, like-new look',
        ],
        'packages'    => [],
        'gallery'     => ['2026/05/Engine-BAy.jpg', '2026/05/6-1.jpg', '2026/05/6-2.jpg'],
        'faqs'        => [],
    ],
    [
        'slug'        => 'rust-protection',
        'title'       => 'Rust Protection',
        'category'    => 'other',
        'tagline'     => 'Our rust protection uses a water-based rubber material - not Flintkote or asphalt - ensuring it is completely odor-free.',
        'description' => 'Rust protection from AutoSPA Jakarta is applied with a water-based rubber material rather than Flintkote or asphalt, so the vehicle stays completely odor-free. Regular treatment prevents rust from forming and keeps the underbody protected.',
        'hero'        => '2026/05/Anti-Rust-1.jpg',
        'highlights'  => [
            'Water-based rubber material',
            'Completely odor-free - not Flintkote or asphalt',
            'Prevents rust from forming on the underbody',
        ],
        'packages'    => [],
        'gallery'     => ['2026/05/Anti-Rust-1.jpg', '2026/05/5-4.jpg', '2026/05/6-2.jpg'],
        'faqs'        => [],
    ],
];

/**
 * The one branch the production site publishes.
 *
 * Source: the production contact page (mirrored in `src/data/contact.ts`).
 */
$location = [
    'slug'        => 'autosp-jakarta',
    'title'       => 'AutoSPA Jakarta',
    'status'      => 'active',
    'phone'       => '0877-1777-3888',
    'whatsapp'    => '628177773888',
    'email'       => 'info@autospajakarta.com',
    'street'      => 'Jl. Pluit Karang Ayu Barat No.16',
    'district'    => 'Pluit',
    'city'        => 'Jakarta Utara',
    'province'    => 'DKI Jakarta',
    'postal_code' => '14440',
    'country'     => 'Indonesia',
    'tagline'     => 'Premium car detailing & paint protection in Jakarta',
    'hours'       => [
        ['monday', '08:00', '18:00', false],
        ['tuesday', '08:00', '18:00', false],
        ['wednesday', '08:00', '18:00', false],
        ['thursday', '08:00', '18:00', false],
        ['friday', '08:00', '18:00', false],
        ['saturday', '08:00', '18:00', false],
        ['sunday', '08:00', '18:00', false],
    ],
];

/* ------------------------------------------------------------- helpers ---- */

$uploads = wp_upload_dir();
$upload_base = $uploads['baseurl'];
$upload_path = $uploads['path'];

/**
 * Imports an image into the media library, or returns the existing
 * attachment ID when it is already there.
 *
 * @param string $relative Path below the uploads directory, e.g. "2026/05/PPF.jpg".
 * @return int Attachment ID, or 0 when the file is missing.
 */
function seed_attachment($relative) {
    global $upload_base, $upload_path;

    /* Already in the library? */
    $existing = get_posts([
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'posts_per_page' => 1,
        'fields'         => 'ids',
        'meta_query'     => [[
            'key'   => '_wp_attached_file',
            'value' => ltrim($relative, '/'),
        ]],
    ]);

    if (!empty($existing)) return (int) $existing[0];

    $file = $upload_path . '/' . ltrim($relative, '/');

    if (!file_exists($file)) {
        echo "    ! missing file: {$relative}\n";
        return 0;
    }

    if (AUTOSP_SEED_DRY) {
        echo "    ~ would import: {$relative}\n";
        return 0;
    }

    $id = media_sideload_image($upload_base . '/' . ltrim($relative, '/'), 0, null, 'src');

    if (is_wp_error($id)) {
        echo "    ! sideload failed for {$relative}: " . $id->get_error_message() . "\n";
        return 0;
    }

    echo "    + imported: {$relative} (attachment {$id})\n";

    return (int) $id;
}

/**
 * Creates or updates a post of the given type and returns its ID.
 */
function seed_post($type, $slug, $title) {
    $existing = get_posts([
        'post_type'      => $type,
        'post_status'    => 'any',
        'name'           => $slug,
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ]);

    if (!empty($existing)) {
        $id = (int) $existing[0];
        if (!AUTOSP_SEED_DRY) {
            wp_update_post(['ID' => $id, 'post_title' => $title]);
        }
        return $id;
    }

    if (AUTOSP_SEED_DRY) {
        echo "    ~ would create: {$type} /{$slug}\n";
        return 0;
    }

    $id = wp_insert_post([
        'post_type'    => $type,
        'post_status'  => 'publish',
        'post_title'   => $title,
        'post_name'    => $slug,
        'post_author'  => 1,
    ], true);

    if (is_wp_error($id)) {
        echo "    ! could not create {$type} /{$slug}: " . $id->get_error_message() . "\n";
        return 0;
    }

    echo "    + created: {$type} /{$slug} ({$id})\n";

    return (int) $id;
}

/**
 * Writes an ACF repeater field.
 */
function seed_repeater($post_id, $field, $rows) {

    if (empty($rows)) return;

    if (!AUTOSP_SEED_DRY) {
        update_field($field, $rows, $post_id);
    }
}

/**
 * Writes an ACF relationship field.
 *
 * ALWAYS an array - a scalar makes the field resolve to `null` in GraphQL
 * (finding 1 of the Phase 2D.9 report). The `_<field>` reference meta is
 * written too, so the wp-admin editor can find the value.
 */
function write_relation($post_id, $field, $target_ids) {

    $ids = array_values(array_unique(array_map('intval', $target_ids)));

    if (AUTOSP_SEED_DRY) {
        echo "    ~ relation {$field} -> [" . implode(',', $ids) . "]\n";
        return;
    }

    update_field($field, $ids, $post_id);
    update_post_meta($post_id, '_' . $field, 'field_' . $field);
}

/**
 * Writes a plain ACF field.
 */
function seed_field($post_id, $field, $value) {

    if (AUTOSP_SEED_DRY) return;

    update_field($field, $value, $post_id);
}

/* ------------------------------------------------------------- seeding ---- */

echo "--- Location ---\n";
$location_id = seed_post('location', $location['slug'], $location['title']);

if ($location_id) {
    seed_field($location_id, 'location_status', $location['status']);
    seed_field($location_id, 'location_phone', $location['phone']);
    seed_field($location_id, 'location_whatsapp', $location['whatsapp']);
    seed_field($location_id, 'location_email', $location['email']);

    seed_field($location_id, 'address_street', $location['street']);
    seed_field($location_id, 'address_district', $location['district']);
    seed_field($location_id, 'address_city', $location['city']);
    seed_field($location_id, 'address_province', $location['province']);
    seed_field($location_id, 'address_postal_code', $location['postal_code']);
    seed_field($location_id, 'address_country', $location['country']);

    seed_field($location_id, 'location_tagline', $location['tagline']);

    $hours = [];
    foreach ($location['hours'] as $hour) {
        $hours[] = [
            'day_name'  => $hour[0],
            'is_closed' => $hour[3],
            'open_time' => $hour[1],
            'close_time' => $hour[2],
        ];
    }
    seed_repeater($location_id, 'opening_hours', $hours);
}

$service_ids = [];
$faq_ids     = [];

foreach ($services as $service) {
    echo "\n--- Service: {$service['slug']} ---\n";

    $service_id = seed_post('service', $service['slug'], $service['title']);

    if (!$service_id) continue;

    $service_ids[$service['slug']] = $service_id;

    /* Hero */
    $hero_id = seed_attachment($service['hero']);

    seed_field($service_id, 'hero_title', $service['title']);
    seed_field($service_id, 'hero_description', $service['tagline']);

    if ($hero_id) {
        seed_field($service_id, 'hero_image', $hero_id);
        set_post_thumbnail($service_id, $hero_id);
    }

    /* Content */
    seed_field($service_id, 'short_description', $service['tagline']);
    seed_field($service_id, 'description', $service['description']);

    seed_repeater($service_id, 'benefits', array_map(function ($highlight) {
        return ['benefit_title' => $highlight, 'benefit_description' => ''];
    }, $service['highlights']));

    /* Relationships */
    seed_field($service_id, 'service_category', $service['category']);

    if ($location_id) {
        write_relation($service_id, 'related_locations', [$location_id]);
    }

    /* Packages */
    $package_rows = [];
    foreach ($service['packages'] as $index => $package) {
        $features = [];
        foreach ($package[2] as $feature) {
            $features[] = ['feature' => $feature];
        }

        $package_rows[] = [
            'package_name'        => $package[0],
            'package_tier'        => 'basic',
            'package_description' => $package[1],
            'package_recommended' => $index === 0 && count($service['packages']) > 1,
            'vehicle_sizes'       => [],
            'package_features'    => $features,
            'package_durability'  => '',
            'package_maintenance' => '',
            'package_workmanship' => '',
        ];
    }
    seed_repeater($service_id, 'packages', $package_rows);

    /* Gallery */
    $gallery_rows = [];
    foreach ($service['gallery'] as $index => $relative) {
        $attachment_id = seed_attachment($relative);
        if (!$attachment_id) continue;

        $gallery_rows[] = [
            'gallery_image'   => $attachment_id,
            'gallery_caption' => '',
            'gallery_type'    => $index === 0 ? 'general' : 'after',
        ];
    }
    seed_repeater($service_id, 'gallery', $gallery_rows);

    /* SEO */
    seed_field($service_id, 'seo_title', $service['title'] . ' | AutoSPA Jakarta');
    seed_field($service_id, 'seo_description', $service['tagline']);
    seed_field($service_id, 'seo_canonical', 'https://autospajakarta.com/services/' . $service['slug'] . '/');
    seed_field($service_id, 'seo_focus_keyword', strtolower($service['title']));
    seed_field($service_id, 'seo_robots', ['index']);

    /* FAQs */
    foreach ($service['faqs'] as $faq) {
        $faq_slug = sanitize_title($service['slug'] . '-' . $faq[0]);
        $faq_id   = seed_post('faq', $faq_slug, $faq[0]);

        if (!$faq_id) continue;

        $faq_ids[] = $faq_id;

        seed_field($faq_id, 'faq_question', $faq[0]);
        seed_field($faq_id, 'faq_answer', $faq[1]);
        seed_field($faq_id, 'faq_category', 'general');

        write_relation($faq_id, 'faq_service', [$service_id]);
        if ($location_id) {
            write_relation($faq_id, 'faq_location', [$location_id]);
        }
    }

    /* The service points back at its own FAQs. */
    $own_faqs = array_values(array_filter(
        $faq_ids,
        function ($id) use ($service) {
            $faq = get_post($id);
            return $faq && str_starts_with($faq->post_name, $service['slug'] . '-');
        }
    ));

    if (!empty($own_faqs)) {
        write_relation($service_id, 'related_faqs', $own_faqs);
    }
}

echo "\n=================================================\n";
echo "Services: " . count($service_ids) . "\n";
echo "FAQs:     " . count($faq_ids) . "\n";
echo "Location: " . ($location_id ?: 0) . "\n";
echo "=================================================\n";

if (AUTOSP_SEED_DRY) {
    echo "\nDry run - nothing was written.\n";
} else {
    delete_transient('wpgraphql_schema');
    delete_option('wpgraphql_schema');
    echo "\nSchema cache cleared.\n";
    echo "Next: verify with the GraphQL queries in docs/cms-restore-checklist.md\n";
}
