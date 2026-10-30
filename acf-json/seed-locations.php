<?php
/**
 * Seed the Location CPT with the ten published branches.
 *
 * WHAT THIS DOES
 *
 * The first seed (`seed-service-content.php`) created ONE location,
 * `autosp-jakarta`, whose content is the Pluit branch. The nine other
 * branches were never written, so the CMS could not answer the question the
 * site actually asks: "which branch is near me?".
 *
 * This script writes all ten branches, using the address, the phone number
 * and the opening hours that the production site publishes (the same data
 * the frontend mirrors in `src/data/contact.ts`).
 *
 * Nothing is invented. Every string comes from the published contact page.
 * Where production publishes no province, no postal code or no second phone
 * number, the field is left empty rather than filled with a plausible guess.
 *
 * THE SLUGS
 *
 * The slug of a branch is the slug the frontend already uses in
 * `src/data/contact.ts` (`pluit`, `depok-2`, `express-depok`, `pik-2`,
 * `ciledug`, `bekasi`, `kranji-bekasi`, `bogor`, `serpong`, `cikupa`), so the
 * CMS and the frontend address the same branch by the same name.
 *
 * The legacy record `autosp-jakarta` holds the Pluit branch. It is RENAMED
 * to `pluit` instead of being replaced, so the `related_locations` links of
 * the six services keep pointing at the same post ID.
 *
 * THE ADDRESS
 *
 * The published address is one line. The Location CPT splits it into street,
 * district, city, province and postal code, so the line is split here on the
 * separators the address itself uses. A city is shortened to its bare name
 * ("Kota Bekasi" -> "Bekasi", "Kabupaten Tangerang" -> "Tangerang").
 *
 * THE HOURS
 *
 * Every branch publishes "Every day HH.MM - HH.MM WIB", so the repeater gets
 * seven identical rows, one per weekday.
 *
 * THE RELATIONSHIPS
 *
 * The six services are brand level - the production service pages are not
 * tied to one branch - and every AutoSPA workshop is a full service
 * workshop, so each service relates to all ten locations and each location
 * relates to all six services. Adjust this in wp-admin if a branch ever
 * offers a different lineup.
 *
 * USAGE
 *
 *   wp eval-file acf-json/seed-locations.php
 *
 *   or, with a dry run:
 *   AUTOSP_SEED=dry wp eval-file acf-json/seed-locations.php
 *
 * The script is idempotent: it matches on the slug and updates in place.
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
echo AUTOSP_SEED_DRY ? "Seeding locations (DRY RUN)\n" : "Seeding locations\n";
echo "=================================================\n\n";

/**
 * The ten published branches.
 *
 * Source: the production contact page (mirrored in `src/data/contact.ts`).
 *
 * `phone` is the first published number of the branch - the one behind it is
 * the personal number of a service advisor. `whatsapp` is that same number
 * in the international format, exactly the way the frontend normalises it
 * (`branchWhatsapp()` in `src/data/contact.ts`).
 */
$branches = [
    [
        'slug'        => 'pluit',
        'title'       => 'Autospa Pluit',
        'phone'       => '0877 1777 3888',
        'whatsapp'    => '6287717773888',
        'street'      => 'Jl. Pluit Karang Ayu Barat No 16',
        'district'    => '',
        'city'        => 'Jakarta Utara',
        'province'    => 'DKI Jakarta',
        'postal_code' => '14440',
        'open'        => '08:30',
        'close'       => '18:00',
        'map_query'   => 'AutoSpa - Passion for Detail',
        'map_zoom'    => 16,
    ],
    [
        'slug'        => 'depok-2',
        'title'       => 'Autospa Depok 2',
        'phone'       => '0819-5888-7778',
        'whatsapp'    => '6281958887778',
        'street'      => 'Jl. Kemakmuran Raya No.12',
        'district'    => 'Mekar Jaya, Kec. Sukmajaya',
        'city'        => 'Depok',
        'province'    => 'Jawa Barat',
        'postal_code' => '16411',
        'open'        => '08:00',
        'close'       => '18:00',
        'map_query'   => 'AutoSpa Depok 2',
        'map_zoom'    => 16,
    ],
    [
        'slug'        => 'express-depok',
        'title'       => 'Autospa Express Depok',
        'phone'       => '0878 1777 3888',
        'whatsapp'    => '6287817773888',
        'street'      => 'Jl. Margonda No.268',
        'district'    => 'Kemiri Muka, Kecamatan Beji',
        'city'        => 'Depok',
        'province'    => 'Jawa Barat',
        'postal_code' => '16423',
        'open'        => '08:00',
        'close'       => '18:00',
        'map_query'   => 'AutoSpa Express Depok - Passion For Detail',
        'map_zoom'    => 18,
    ],
    [
        'slug'        => 'pik-2',
        'title'       => 'Autospa PIK 2',
        'phone'       => '0813 8883 7778',
        'whatsapp'    => '6281388837778',
        'street'      => 'Distrik Otomotif, Jl Jendral Sudirman Blok H No.10',
        'district'    => 'Salembaran, Kec. Teluknaga',
        'city'        => 'Tangerang',
        'province'    => 'Banten',
        'postal_code' => '15211',
        'open'        => '08:30',
        'close'       => '18:00',
        'map_query'   => 'Autospa PIK2 - Passion For Detail',
        'map_zoom'    => 16,
    ],
    [
        'slug'        => 'ciledug',
        'title'       => 'Autospa Ciledug',
        'phone'       => '0819 7777 3888',
        'whatsapp'    => '6281977773888',
        'street'      => 'Jl. Raden Saleh',
        'district'    => 'Karang Tengah, Kec. Karang Tengah',
        'city'        => 'Tangerang',
        'province'    => 'Banten',
        'postal_code' => '15157',
        'open'        => '08:00',
        'close'       => '17:00',
        'map_query'   => 'AutoSpa Tangerang Passion for Detail',
        'map_zoom'    => 18,
    ],
    [
        'slug'        => 'bekasi',
        'title'       => 'AutoSpa Bekasi',
        'phone'       => '0822 8888 1810',
        'whatsapp'    => '6282288881810',
        'street'      => 'Jl. Taman Galaxy Raya No.295',
        'district'    => 'RT.003/RW.010, Jaka Setia, Kec. Bekasi Sel.',
        'city'        => 'Bekasi',
        'province'    => 'Jawa Barat',
        'postal_code' => '17147',
        'open'        => '08:00',
        'close'       => '18:00',
        'map_query'   => 'AutoSpa Bekasi - Passion For Detail',
        'map_zoom'    => 16,
    ],
    [
        'slug'        => 'kranji-bekasi',
        'title'       => 'Autospa Kranji Bekasi',
        'phone'       => '+62 819-3777-3888',
        'whatsapp'    => '6281937773888',
        'street'      => 'Chery Arta Bekasi, Jl. Jend. Sudirman No.1',
        'district'    => 'Kranji, Kec. Bekasi Bar.',
        'city'        => 'Bekasi',
        'province'    => 'Jawa Barat',
        'postal_code' => '17135',
        'open'        => '08:00',
        'close'       => '18:00',
        'map_query'   => 'Autospa Kranji',
        'map_zoom'    => 18,
    ],
    [
        'slug'        => 'bogor',
        'title'       => 'Autospa Bogor',
        'phone'       => '+62 813-1010-823',
        'whatsapp'    => '628131010823',
        'street'      => 'Jl. Raya Semplak',
        'district'    => 'Semplak, Kec. Bogor Bar.',
        'city'        => 'Bogor',
        'province'    => 'Jawa Barat',
        'postal_code' => '16114',
        'open'        => '08:00',
        'close'       => '18:00',
        'map_query'   => 'AutoSpa Bogor',
        'map_zoom'    => 18,
    ],
    [
        'slug'        => 'serpong',
        'title'       => 'Autospa Serpong',
        'phone'       => '+62 819-3777-3888',
        'whatsapp'    => '6281937773888',
        'street'      => 'Chery Arta Serpong / iCar SM Grup, Jl. Raya Serpong Kilometer 7 No.KM.10',
        'district'    => 'Pd. Jagung, Serpong Utara',
        'city'        => 'Tangerang Selatan',
        'province'    => 'Banten',
        'postal_code' => '',
        'open'        => '08:00',
        'close'       => '18:00',
        'map_query'   => 'Chery Arta Serpong',
        'map_zoom'    => 16,
    ],
    [
        'slug'        => 'cikupa',
        'title'       => 'Autospa Cikupa',
        'phone'       => '+62 819-3777-3888',
        'whatsapp'    => '6281937773888',
        'street'      => 'Jl. Raya Serang No.km.15',
        'district'    => 'Cikupa, Kec. Cikupa',
        'city'        => 'Tangerang',
        'province'    => 'Banten',
        'postal_code' => '15710',
        'open'        => '08:00',
        'close'       => '18:00',
        'map_query'   => 'Jl. Raya Serang No.km.15 Cikupa Kabupaten Tangerang',
        'map_zoom'    => 16,
    ],
];

/**
 * The site wide email address.
 *
 * The branches publish no address of their own - the contact page publishes
 * this one for the whole workshop - so every branch carries it.
 */
$site_email = 'info@autospajakarta.com';

/** The seven weekdays, in the order the repeater stores them. */
$weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

/* ------------------------------------------------------------- helpers ---- */

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
 * Writes a plain ACF field.
 */
function seed_field($post_id, $field, $value) {
    if (AUTOSP_SEED_DRY) return;

    update_field($field, $value, $post_id);
}

/**
 * Writes an ACF repeater field.
 */
function seed_repeater($post_id, $field, $rows) {
    if (empty($rows)) return;

    if (AUTOSP_SEED_DRY) return;

    update_field($field, $rows, $post_id);
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
 * The embeddable Google Maps URL of a branch.
 *
 * The same URL the frontend builds in `branchMapUrl()` - `output=embed` is
 * what makes the map renderable inside an iframe.
 */
function branch_map_url($query, $zoom) {
    return 'https://maps.google.com/maps?q=' . rawurlencode($query)
        . '&t=m&z=' . (int) $zoom . '&output=embed&iwloc=near';
}

/* --------------------------------------------------------- the rename ---- */

/*
 * The first seed created the Pluit branch under the generic slug
 * `autosp-jakarta`. The branch keeps its identity when the slug is renamed
 * to `pluit`, and the `related_locations` links of the six services keep
 * pointing at the same post ID.
 */
$legacy = get_posts([
    'post_type'      => 'location',
    'post_status'    => 'any',
    'name'           => 'autosp-jakarta',
    'posts_per_page' => 1,
    'fields'         => 'ids',
]);

$pluit_exists = get_posts([
    'post_type'      => 'location',
    'post_status'    => 'any',
    'name'           => 'pluit',
    'posts_per_page' => 1,
    'fields'         => 'ids',
]);

if (!empty($legacy) && empty($pluit_exists)) {
    if (AUTOSP_SEED_DRY) {
        echo "    ~ would rename: location /autosp-jakarta -> /pluit (" . $legacy[0] . ")\n";
    } else {
        wp_update_post(['ID' => (int) $legacy[0], 'post_name' => 'pluit']);
        echo "    + renamed: location /autosp-jakarta -> /pluit (" . $legacy[0] . ")\n";
    }
} elseif (!empty($legacy) && !empty($pluit_exists)) {
    echo "    ! both /autosp-jakarta (" . $legacy[0] . ") and /pluit (" . $pluit_exists[0]
        . ") exist - the legacy record is left alone, please merge it by hand.\n";
}

/* ------------------------------------------------------------- seeding ---- */

echo "--- Branches ---\n";

$location_ids = [];

foreach ($branches as $branch) {
    $id = seed_post('location', $branch['slug'], $branch['title']);

    if (!$id) continue;

    $location_ids[$branch['slug']] = $id;

    seed_field($id, 'location_status', 'active');
    seed_field($id, 'location_phone', $branch['phone']);
    seed_field($id, 'location_whatsapp', $branch['whatsapp']);
    seed_field($id, 'location_email', $site_email);

    seed_field($id, 'address_street', $branch['street']);
    seed_field($id, 'address_district', $branch['district']);
    seed_field($id, 'address_city', $branch['city']);
    seed_field($id, 'address_province', $branch['province']);
    seed_field($id, 'address_postal_code', $branch['postal_code']);
    seed_field($id, 'address_country', 'Indonesia');

    seed_field($id, 'google_maps_url', branch_map_url($branch['map_query'], $branch['map_zoom']));

    $hours = [];
    foreach ($weekdays as $day) {
        $hours[] = [
            'day_name'  => $day,
            'is_closed' => false,
            'open_time' => $branch['open'],
            'close_time' => $branch['close'],
        ];
    }
    seed_repeater($id, 'opening_hours', $hours);

    echo "    - {$branch['slug']} ({$id})\n";
}

$all_location_ids = array_values($location_ids);

/*
 * The services are brand level and every workshop is a full service
 * workshop, so every service relates to every branch and the other way
 * round.
 */
echo "--- Service relations ---\n";

$services = get_posts([
    'post_type'      => 'service',
    'post_status'    => 'any',
    'posts_per_page' => -1,
    'fields'         => 'ids',
]);

foreach ($services as $service_id) {
    write_relation((int) $service_id, 'related_locations', $all_location_ids);
}

foreach ($all_location_ids as $location_id) {
    write_relation($location_id, 'location_services', array_map('intval', $services));
}

echo "=================================================\n";
echo "Locations: " . count($location_ids) . " / " . count($branches) . "\n";
echo "Services linked: " . count($services) . "\n";
echo AUTOSP_SEED_DRY ? "DRY RUN - nothing was written\n" : "Done\n";
echo "=================================================\n";
