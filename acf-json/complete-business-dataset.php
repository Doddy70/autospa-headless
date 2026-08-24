<?php
/**
 * AutoSP AJakarta - Complete Business Dataset
 * Phase 2D.7: Test Data Entry
 *
 * WARNING: TEST DATA ONLY
 * ENVIRONMENT: STAGING
 * DATA: TEST
 *
 * This script populates the canonical test entities (IDs 6994-7005)
 * with complete business field data to prove the Content Model works.
 */

require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

echo "=================================================\n";
echo "AutoSP AJakarta - Complete Business Dataset\n";
echo "Phase 2D.7: Test Data Entry\n";
echo "=================================================\n";
echo "\n⚠️  ENVIRONMENT: STAGING\n⚠️  DATA: TEST ONLY\n⚠️  DO NOT USE FOR PRODUCTION\n\n";

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function update_safe($post_id, $field, $value) {
    update_post_meta($post_id, $field, $value);
}

function update_serialized($post_id, $field, $array_value) {
    update_post_meta($post_id, $field, $array_value);
}

// ============================================================
// SERVICE 6994: Nano Ceramic Coating (COMPLETE)
// ============================================================

echo "[SERVICE 6994] Nano Ceramic Coating - Complete Dataset\n";
echo str_repeat("-", 50) . "\n";

$service_6994 = 6994;

// Basic Content
update_safe($service_6994, 'hero_title', 'Nano Ceramic Coating Jakarta - Protection & Gloss');
update_safe($service_6994, 'hero_description', 'Lindungi cat mobil Anda dengan teknologi nano ceramic coating terbaru. Hasil gloss maksimal dengan durabilitas hingga 5 tahun.');

// Content
update_safe($service_6994, 'short_description', 'Nano Ceramic Coating adalah solusi perlindungan cat teradvance dengan teknologi nano particles yang membentuk lapisan proteksi keras dan gloss tinggi. Cocok untuk kendaraan baru atau yang sudah mengalami penurunan gloss.');
update_safe($service_6994, 'description', '<h2>Apa itu Nano Ceramic Coating?</h2><p>Nano Ceramic Coating adalah teknologi perlindungan cat kendaraan yang menggunakan partikel nano silika/sio2 untuk membentuk lapisan proteksi permanent pada permukaan cat. Berbeda dengan wax atau sealant tradisional, ceramic coating chemically bond dengan cat dan tidak wash off.</p><h3>Keunggulan:</h3><ul><li>Durabilitas 3-5 tahun</li><li>Gloss like new permanently</li><li>Hydrophobic effect (air langsung beaded)</li><li>Proteksi terhadap UV, acid rain, bird droppings</li><li>Easy maintenance - mudah dibersihkan</li></ul>');

// SEO
update_safe($service_6994, 'seo_title', 'Nano Ceramic Coating Jakarta | AutoSP Professional {title}');
update_safe($service_6994, 'seo_description', 'AutoSP Jakarta spesialis Nano Ceramic Coating dengan teknologi terbaru. Durabilitas hingga 5 tahun, gloss maksimal. Booking sekarang!');
update_safe($service_6994, 'seo_focus_keyword', 'nano ceramic coating jakarta');
update_safe($service_6994, 'seo_robots', ['index', 'follow']);

// Benefits (repeater)
$benefits = [
    ['benefit_title' => 'Gloss Permanen', 'benefit_description' => 'Cat kendaraan terlihat seperti baru dengan gloss tinggi yang bertahan bertahun-tahun tanpa perlu polishing.'],
    ['benefit_title' => 'Proteksi Komprehensif', 'benefit_description' => 'Lapisan pelindung terhadap sinar UV, hujan asam, burung, dan kontaminasi lingkungan.'],
    ['benefit_title' => ' hydrophobic Effect', 'benefit_description' => 'Air langsung beaded dan mobilize, kotoran sulit menempel sehingga mobil lebih mudah dibersihkan.'],
    ['benefit_title' => 'Durabilitas 3-5 Tahun', 'benefit_description' => 'Satu kali aplikasi, perlindungan jangka panjang tanpa perlu retouch rutin.'],
    ['benefit_title' => 'Mudah Perawatan', 'benefit_description' => 'Cuci mobil lebih mudah karena kotoran dan lumpur tidak mudah menempel pada permukaan.'],
];
update_serialized($service_6994, 'benefits', $benefits);

// Process (repeater)
$process = [
    ['step_number' => 1, 'step_title' => 'Inspection & Paint Correction', 'step_description' => 'Tim kami melakukan inspeksi detail kondisi cat kendaraan. Tahap ini termasuk paint correction untuk menghilangkan swirl marks, holograms, dan micro scratches sebelum coating.'],
    ['step_number' => 2, 'step_title' => 'Paint Preparation (Decontamination)', 'step_description' => 'Proses decontamination untuk menghilangkan iron particles, tar, dan kontaminasi lain yang tidak bisa dihilangkan dengan clay bar biasa.'],
    ['step_number' => 3, 'step_title' => 'Surface Preparation', 'step_description' => 'Panel sanding dengan grit yang sesuai, followed by thorough wiping dengan IPA untuk memastikan permukaan benar-benar bersih dan siap coating.'],
    ['step_number' => 4, 'step_title' => 'Ceramic Coating Application', 'step_description' => 'Aplikasi nano ceramic coating dengan teknik yang tepat. Setiap panel diaplikasikan secara sistematis dengan overlap yang benar.'],
    ['step_number' => 5, 'step_title' => 'Curing & Quality Check', 'step_description' => 'Proses curing pada kondisi terkontrol, followed by quality inspection untuk memastikan coverage dan finish yang sempurna.'],
];
update_serialized($service_6994, 'process', $process);

// Technology (repeater)
$technology = [
    ['technology_name' => 'SiO2 (Silica Dioxide)'],
    ['technology_name' => 'Nano Particles Technology'],
    ['technology_name' => 'Hydrophobic Coating'],
];
update_serialized($service_6994, 'technology', $technology);

// Packages (repeater with nested vehicle_sizes)
$packages = [
    [
        'package_name' => 'Starter Package',
        'package_tier' => 'basic',
        'package_description' => 'Single layer ceramic coating untuk pemula yang ingin merasakan manfaat ceramic coating.',
        'package_recommended' => 0,
        'vehicle_sizes' => [
            ['size_label' => 'small', 'price' => 2500000],
            ['size_label' => 'medium', 'price' => 3500000],
            ['size_label' => 'large', 'price' => 4500000],
            ['size_label' => 'xlarge', 'price' => 5500000],
            ['size_label' => 'super', 'price' => 6500000],
        ],
        'package_features' => ['Single layer ceramic', 'Basic protection', '6 months durability'],
        'package_durability' => '6-12 bulan',
        'package_maintenance' => 'Tidak termasuk',
        'package_workmanship' => '1-2 hari',
    ],
    [
        'package_name' => 'Premium Package',
        'package_tier' => 'premium',
        'package_description' => 'Double layer ceramic coating dengan durability lebih panjang dan gloss yang lebih intens.',
        'package_recommended' => 1,
        'vehicle_sizes' => [
            ['size_label' => 'small', 'price' => 4500000],
            ['size_label' => 'medium', 'price' => 6000000],
            ['size_label' => 'large', 'price' => 7500000],
            ['size_label' => 'xlarge', 'price' => 9000000],
            ['size_label' => 'super', 'price' => 10500000],
        ],
        'package_features' => ['Double layer ceramic', 'Enhanced gloss', '12-18 months durability', 'Hydrophobic effect'],
        'package_durability' => '12-18 bulan',
        'package_maintenance' => '1x maintenance gratis',
        'package_workmanship' => '2-3 hari',
    ],
    [
        'package_name' => 'Ultimate Package',
        'package_tier' => 'ultimate',
        'package_description' => 'Triple layer ceramic coating untuk perlindungan maximum dengan warranty terpanjang.',
        'package_recommended' => 0,
        'vehicle_sizes' => [
            ['size_label' => 'small', 'price' => 7500000],
            ['size_label' => 'medium', 'price' => 9500000],
            ['size_label' => 'large', 'price' => 11500000],
            ['size_label' => 'xlarge', 'price' => 13500000],
            ['size_label' => 'super', 'price' => 15500000],
        ],
        'package_features' => ['Triple layer ceramic', 'Maximum protection', '3-5 years durability', 'Full maintenance included', ' warranty'],
        'package_durability' => '3-5 tahun',
        'package_maintenance' => '2 tahun maintenance gratis',
        'package_workmanship' => '4-5 hari',
    ],
];
update_serialized($service_6994, 'packages', $packages);

// Gallery (repeater)
$gallery = [
    ['gallery_caption' => 'Before ceramic coating', 'gallery_type' => 'before'],
    ['gallery_caption' => 'After ceramic coating - gloss result', 'gallery_type' => 'after'],
    ['gallery_caption' => 'Hydrophobic effect test', 'gallery_type' => 'process'],
    ['gallery_caption' => 'Final finish - side view', 'gallery_type' => 'general'],
];
update_serialized($service_6994, 'gallery', $gallery);

// Category
update_safe($service_6994, 'service_category', 'coating');

echo "  ✓ Hero, Content, SEO, Benefits, Process, Technology, Packages, Gallery populated\n";

// ============================================================
// SERVICE 6995: Paint Protection Film (Partial)
// ============================================================

echo "\n[SERVICE 6995] Paint Protection Film - Partial Dataset\n";
echo str_repeat("-", 50) . "\n";

$service_6995 = 6995;

update_safe($service_6995, 'hero_title', 'Paint Protection Film (PPF) - Ultimate Paint Protection');
update_safe($service_6995, 'hero_description', 'Proteksi maximum untuk cat kendaraan Anda dengan Paint Protection Film berkualitas tinggi. Anti scratch, self-healing, dan tidak menguning.');
update_safe($service_6995, 'short_description', 'Paint Protection Film (PPF) adalah lapisan pelindung transparan yang diaplikasikan pada permukaan cat kendaraan untuk melindungi dari stone chips, goresan, dan kerusakan akibat batu yang terbang.');
update_safe($service_6995, 'seo_title', 'Paint Protection Film (PPF) Jakarta | AutoSP');
update_safe($service_6995, 'seo_description', 'AutoSP Jakarta spesialis Paint Protection Film premium. Anti scratch, self-healing, 10 years warranty. Lindungi investasi kendaraan Anda.');
update_safe($service_6995, 'service_category', 'protection');

$ppf_packages = [
    [
        'package_name' => 'Front Package',
        'package_tier' => 'basic',
        'package_description' => 'PPF pada area depan: hood, fenders, mirrors, dan front bumper.',
        'package_recommended' => 0,
        'vehicle_sizes' => [
            ['size_label' => 'small', 'price' => 8000000],
            ['size_label' => 'medium', 'price' => 10000000],
            ['size_label' => 'large', 'price' => 12000000],
            ['size_label' => 'xlarge', 'price' => 14000000],
            ['size_label' => 'super', 'price' => 16000000],
        ],
        'package_features' => ['Hood', 'Fenders', 'Mirrors', 'Front bumper', '5 years warranty'],
        'package_durability' => '5-7 tahun',
        'package_maintenance' => 'Tidak termasuk',
        'package_workmanship' => '1-2 hari',
    ],
    [
        'package_name' => 'Full Front',
        'package_tier' => 'premium',
        'package_description' => 'PPF full front + rocker panels untuk proteksi komprehensif area depan.',
        'package_recommended' => 1,
        'vehicle_sizes' => [
            ['size_label' => 'small', 'price' => 15000000],
            ['size_label' => 'medium', 'price' => 18000000],
            ['size_label' => 'large', 'price' => 21000000],
            ['size_label' => 'xlarge', 'price' => 24000000],
            ['size_label' => 'super', 'price' => 27000000],
        ],
        'package_features' => ['All front areas', '+ Rocker panels', '+ Headlights', 'Self-healing', '10 years warranty'],
        'package_durability' => '10 tahun',
        'package_maintenance' => '1x free inspection',
        'package_workmanship' => '2-3 hari',
    ],
];
update_serialized($service_6995, 'packages', $ppf_packages);

echo "  ✓ Hero, Content, SEO, Packages populated\n";

// ============================================================
// SERVICE 6996: Auto Detailing Premium (Partial)
// ============================================================

echo "\n[SERVICE 6996] Auto Detailing Premium - Partial Dataset\n";
echo str_repeat("-", 50) . "\n";

$service_6996 = 6996;

update_safe($service_6996, 'hero_title', 'Auto Detailing Premium Jakarta - Interior & Exterior');
update_safe($service_6996, 'hero_description', 'Layanan detailing lengkap untuk mengembalikan kondisi kendaraan seperti baru. Interior deep cleaning hingga exterior polish profesional.');
update_safe($service_6996, 'short_description', 'Auto Detailing Premium adalah layanan cleaning dan restoration komprehensif yang mencakup interior dan exterior kendaraan untuk mengembalikan kondisi seperti baru.');
update_safe($service_6996, 'service_category', 'detailing');

echo "  ✓ Hero, Content populated\n";

// ============================================================
// LOCATION 6997: AutoSP Pluit (COMPLETE)
// ============================================================

echo "\n[LOCATION 6997] AutoSP Pluit - Complete Dataset\n";
echo str_repeat("-", 50) . "\n";

$location_6997 = 6997;

// Identity
update_safe($location_6997, 'location_status', 'active');
update_safe($location_6997, 'location_phone', '021-66678777');
update_safe($location_6997, 'location_whatsapp', '6281312345678');
update_safe($location_6997, 'location_email', 'pluit@autospajakarta.com');

// Address
update_safe($location_6997, 'address_street', 'Jl. Pluit Karang Ayu Barat No.16');
update_safe($location_6997, 'address_district', 'Pluit');
update_safe($location_6997, 'address_city', 'Jakarta Utara');
update_safe($location_6997, 'address_province', 'DKI Jakarta');
update_safe($location_6997, 'address_postal_code', '14450');
update_safe($location_6997, 'address_country', 'Indonesia');

// Geo
update_safe($location_6997, 'geo_latitude', '-6.1089');
update_safe($location_6997, 'geo_longitude', '106.7889');
update_safe($location_6997, 'google_maps_url', 'https://maps.google.com/?q=-6.1089,106.7889');
update_safe($location_6997, 'google_place_id', 'ChIJAQAAAI_06y4RRmCNUBiVewM');

// Opening Hours (repeater)
$opening_hours = [
    ['day_name' => 'monday', 'is_closed' => 0, 'open_time' => '08:00', 'close_time' => '17:00'],
    ['day_name' => 'tuesday', 'is_closed' => 0, 'open_time' => '08:00', 'close_time' => '17:00'],
    ['day_name' => 'wednesday', 'is_closed' => 0, 'open_time' => '08:00', 'close_time' => '17:00'],
    ['day_name' => 'thursday', 'is_closed' => 0, 'open_time' => '08:00', 'close_time' => '17:00'],
    ['day_name' => 'friday', 'is_closed' => 0, 'open_time' => '08:00', 'close_time' => '17:00'],
    ['day_name' => 'saturday', 'is_closed' => 0, 'open_time' => '08:00', 'close_time' => '16:00'],
    ['day_name' => 'sunday', 'is_closed' => 1, 'open_time' => '', 'close_time' => ''],
];
update_serialized($location_6997, 'opening_hours', $opening_hours);

// Content
update_safe($location_6997, 'location_tagline', 'Spesialis Ceramic Coating & PPF sejak 2014');
update_safe($location_6997, 'location_description', '<p>AutoSP Pluit adalah workshop utama kami yang telah beroperasi sejak 2014. Dengan lokasi strategis di kawasan Pluit, Jakarta Utara, kami melayani pelanggan dari seluruh Jabodetabek.</p><p>Fasilitas kami mencakup:</p><ul><li>Workshop tertutup dengan AC</li><li>Lighting system profesional</li><li>Paint booth untuk coating application</li><li>Customer lounge dengan WiFi</li></ul>');

// Highlights (repeater)
$highlights = [
    ['highlight' => 'Sudah beroperasi sejak 2014'],
    ['highlight' => '10+ tahun pengalaman'],
    ['highlight' => '5000+ kendaraan terlayani'],
    ['highlight' => 'Teknisi bersertifikasi'],
];
update_serialized($location_6997, 'location_highlights', $highlights);

// Facilities (repeater)
$facilities = [
    ['facility' => 'Workshop tertutup dengan AC'],
    ['facility' => 'Paint booth standar internasional'],
    ['facility' => 'Customer lounge dengan WiFi'],
    ['facility' => 'Area tunggu nyaman'],
    ['facility' => 'Free parking'],
];
update_serialized($location_6997, 'location_facilities', $facilities);

// Service Areas (repeater)
$service_areas = [
    ['area_name' => 'Jakarta Utara'],
    ['area_name' => 'Jakarta Pusat'],
    ['area_name' => 'Jakarta Barat'],
    ['area_name' => 'Tangerang'],
    ['area_name' => 'Bekasi'],
    ['area_name' => 'Depok'],
];
update_serialized($location_6997, 'service_areas', $service_areas);

// Gallery (repeater)
$location_gallery = [
    ['gallery_caption' => 'Workshop AutoSP Pluit - Exterior', 'gallery_type' => 'exterior'],
    ['gallery_caption' => 'Paint booth untuk coating', 'gallery_type' => 'facility'],
    ['gallery_caption' => 'Customer lounge', 'gallery_type' => 'facility'],
    ['gallery_caption' => 'Team AutoSP Pluit', 'gallery_type' => 'team'],
];
update_serialized($location_6997, 'location_gallery', $location_gallery);

// Google Business
update_safe($location_6997, 'location_google_business_url', 'https://business.google.com/locations/auto-sp-pluit');

echo "  ✓ Identity, Address, Geo, Hours, Content, Highlights, Facilities, Areas, Gallery populated\n";

// ============================================================
// LOCATION 6998: AutoSP PIK 2 (Partial)
// ============================================================

echo "\n[LOCATION 6998] AutoSP PIK 2 - Partial Dataset\n";
echo str_repeat("-", 50) . "\n";

$location_6998 = 6998;

update_safe($location_6998, 'location_status', 'active');
update_safe($location_6998, 'location_phone', '021-66678888');
update_safe($location_6998, 'location_whatsapp', '6281312345679');
update_safe($location_6998, 'location_email', 'pik2@autospajakarta.com');
update_safe($location_6998, 'address_street', 'Jl. PIK 2 Golf Boulevard Blok C No.1');
update_safe($location_6998, 'address_district', ' Kamal Muara');
update_safe($location_6998, 'address_city', 'Jakarta Utara');
update_safe($location_6998, 'address_province', 'DKI Jakarta');
update_safe($location_6998, 'address_postal_code', '14460');
update_safe($location_6998, 'geo_latitude', '-6.1025');
update_safe($location_6998, 'geo_longitude', '106.7450');
update_safe($location_6998, 'location_tagline', 'Premium Detailing Studio di PIK 2');
update_safe($location_6998, 'service_category', 'detailing');

echo "  ✓ Identity, Address, Geo, Content populated\n";

// ============================================================
// PROJECT 6999: Toyota Alphard Ceramic (COMPLETE)
// ============================================================

echo "\n[PROJECT 6999] Toyota Alphard Ceramic - Complete Dataset\n";
echo str_repeat("-", 50) . "\n";

$project_6999 = 6999;

// Vehicle Info
update_safe($project_6999, 'vehicle_brand', 'Toyota');
update_safe($project_6999, 'vehicle_model', 'Alphard');
update_safe($project_6999, 'vehicle_year', '2023');
update_safe($project_6999, 'vehicle_color', 'Pearl White');

// Project Content
update_safe($project_6999, 'project_challenge', 'Customer memiliki Toyota Alphard baru berwarna Pearl White yang ingin mendapatkan perlindungan cat maximum sejak awal. Alphard sering digunakan untuk perjalanan jauh dan shuttle keluarga, sehingga cat membutuhkan proteksi extra.');
update_safe($project_6999, 'project_solution', 'Direkomendasikan Ultimate Ceramic Coating Package untuk proteksi maximum. Proses dimulai dengan paint correction untuk menghilangkan transport swirls dari pabrik, followed by triple layer ceramic coating application. Customer juga memilih untuk menambahkan PPF pada area depan untuk proteksi terhadap stone chips.');
update_safe($project_6999, 'project_result', 'Hasilnya memuaskan - gloss Pearl White menjadi sangat deep dan wet look yang membuat Alphard terlihat lebih premium dari showroom. Lapisan ceramic memberikan hydrophobic effect yang kuat, sehingga noda air dan kotoran mudah dibersihkan. Customer sangat puas dengan hasil dan perlindungan jangka panjang yang didapat.');
update_safe($project_6999, 'completed_at', '2024-03-15');

// Project Relationships already set:
echo "  ✓ Vehicle, Content populated (relationships pre-set)\n";

// ============================================================
// PROJECT 7000: Honda Civic PPF (Partial)
// ============================================================

echo "\n[PROJECT 7000] Honda Civic PPF - Partial Dataset\n";
echo str_repeat("-", 50) . "\n";

$project_7000 = 7000;

update_safe($project_7000, 'vehicle_brand', 'Honda');
update_safe($project_7000, 'vehicle_model', 'Civic');
update_safe($project_7000, 'vehicle_year', '2024');
update_safe($project_7000, 'vehicle_color', 'Crystal Black Pearl');
update_safe($project_7000, 'project_challenge', 'Honda Civic RS Turbo Black Pearl baru customer beli. Karena warna hitam sangat rentan terhadap swirl marks dan scratches, customer ingin proteksi preventif sebelum first wash.');
update_safe($project_7000, 'project_solution', 'Direkomendasikan Full Front PPF untuk proteksi area depan yang paling rentan stone chips. PPF dengan self-healing properties dipilih untuk scratch resistance maximum.');
update_safe($project_7000, 'project_result', 'PPF yang diaplikasikan tidak terlihat sama sekali - finish tetap glossy dan warna hitam tetap deep. Customer tenang membawa mobil untuk daily commute tanpa khawatir stone chips.');

echo "  ✓ Vehicle, Content populated\n";

// ============================================================
// FAQ 7001: Global FAQ (Pricing) - NO contextual relationship
// ============================================================

echo "\n[FAQ 7001] Berapa Harga Ceramic Coating? - GLOBAL\n";
echo str_repeat("-", 50) . "\n";

$faq_7001 = 7001;

// No service or location relationship - this is GLOBAL
delete_post_meta($faq_7001, 'faq_service');
delete_post_meta($faq_7001, 'faq_location');

update_safe($faq_7001, 'faq_question', 'Berapa harga layanan ceramic coating di AutoSP?');
update_safe($faq_7001, 'faq_answer', '<p>Harga ceramic coating di AutoSP bervariasi tergantung pada package dan ukuran kendaraan:</p><ul><li><strong>Starter Package:</strong> Mulai dari Rp 2.500.000 untuk city car</li><li><strong>Premium Package:</strong> Mulai dari Rp 4.500.000 untuk city car</li><li><strong>Ultimate Package:</strong> Mulai dari Rp 7.500.000 untuk city car</li></ul><p>Harga sudah termasuk paint correction ringan dan maintenance. Untuk harga pasti kendaraan Anda, silakan hubungi kami via WhatsApp.</p>');
update_safe($faq_7001, 'faq_category', 'pricing');
update_safe($faq_7001, 'faq_order', 1);
update_safe($faq_7001, 'faq_featured', 1);

echo "  ✓ Global FAQ - NO contextual relationship\n";

// ============================================================
// FAQ 7002: Service-Specific FAQ - Links to Service 6994
// ============================================================

echo "\n[FAQ 7002] Berapa Lama Proses Coating? - SERVICE-SPECIFIC\n";
echo str_repeat("-", 50) . "\n";

$faq_7002 = 7002;

// Links to Service 6994 (Nano Ceramic Coating)
update_safe($faq_7002, 'faq_service', $service_6994);
delete_post_meta($faq_7002, 'faq_location');

update_safe($faq_7002, 'faq_question', 'Berapa lama proses ceramic coating selesai?');
update_safe($faq_7002, 'faq_answer', '<p>Lama proses ceramic coating tergantung pada package yang dipilih:</p><ul><li><strong>Starter Package:</strong> 1-2 hari kerja</li><li><strong>Premium Package:</strong> 2-3 hari kerja</li><li><strong>Ultimate Package:</strong> 4-5 hari kerja</li></ul><p>Proses termasuk paint correction, surface preparation, dan curing time. Vehicle tidak bisa diambil sebelum proses curing selesai untuk hasil optimal.</p>');
update_safe($faq_7002, 'faq_category', 'process');
update_safe($faq_7002, 'faq_order', 2);
update_safe($faq_7002, 'faq_featured', 0);

echo "  ✓ Service-Specific FAQ - Links to Service 6994\n";

// ============================================================
// FAQ 7003: Location-Specific FAQ - Links to Location 6998
// ============================================================

echo "\n[FAQ 7003] Apakah Ada Garansi? - LOCATION-SPECIFIC\n";
echo str_repeat("-", 50) . "\n";

$faq_7003 = 7003;

// Links to Location 6998 (AutoSP PIK 2)
delete_post_meta($faq_7003, 'faq_service');
update_safe($faq_7003, 'faq_location', $location_6998);

update_safe($faq_7003, 'faq_question', 'Apakah AutoSP memberikan garansi untuk layanan coating?');
update_safe($faq_7003, 'faq_answer', '<p>Ya, AutoSP memberikan garansi untuk layanan coating:</p><ul><li><strong>Starter:</strong> 6-12 bulan warranty</li><li><strong>Premium:</strong> 1-2 tahun warranty</li><li><strong>Ultimate:</strong> 3-5 tahun warranty (termasuk maintenance)</li></ul><p>Garansi mencakup peeling, bubbling, dan penurunan gloss yang abnormal. Tidak mencakup damage akibat kecelakaan atau chemical damage dari pembersihan yang tidak tepat.</p>');
update_safe($faq_7003, 'faq_category', 'general');
update_safe($faq_7003, 'faq_order', 3);
update_safe($faq_7003, 'faq_featured', 1);

echo "  ✓ Location-Specific FAQ - Links to Location 6998\n";

// ============================================================
// TESTIMONIAL 7004: John Doe - Complete
// ============================================================

echo "\n[TESTIMONIAL 7004] John Doe - Complete Dataset\n";
echo str_repeat("-", 50) . "\n";

$testimonial_7004 = 7004;

// Links to Service 6994 (Ceramic) and Location 6997
update_safe($testimonial_7004, 'testimonial_service', $service_6994);
update_safe($testimonial_7004, 'testimonial_location', $location_6997);

update_safe($testimonial_7004, 'customer_name', 'John Doe');
update_safe($testimonial_7004, 'customer_role', 'Business Owner');
update_safe($testimonial_7004, 'customer_company', 'PT.EXAMPLE INDONESIA');
update_safe($testimonial_7004, 'customer_quote', 'Pelayanan sangat profesional dari awal konsultasi sampai finish. Alphard saya langsung terlihat like new setelah ceramic coating - gloss-nya outstanding! Tim AutoSP juga sabar menjelaskan setiap proses. Worth every penny untuk investasi perlindungan mobil saya.');
update_safe($testimonial_7004, 'customer_vehicle', 'Toyota Alphard 2023 Pearl White');
update_safe($testimonial_7004, 'testimonial_source', 'website');
update_safe($testimonial_7004, 'testimonial_featured', 1);

echo "  ✓ Complete testimonial with relationships\n";

// ============================================================
// TESTIMONIAL 7005: Jane Smith - Complete
// ============================================================

echo "\n[TESTIMONIAL 7005] Jane Smith - Complete Dataset\n";
echo str_repeat("-", 50) . "\n";

$testimonial_7005 = 7005;

// Links to Service 6995 (PPF) and Location 6998
update_safe($testimonial_7005, 'testimonial_service', $service_6995);
update_safe($testimonial_7005, 'testimonial_location', $location_6998);

update_safe($testimonial_7005, 'customer_name', 'Jane Smith');
update_safe($testimonial_7005, 'customer_role', 'Product Manager');
update_safe($testimonial_7005, 'customer_company', 'Tech Startup');
update_safe($testimonial_7005, 'customer_quote', 'Saya pilih PPF untuk Civic Turbo karena sering pakai mobil untuk commuting. Hasilnya tidak terlihat ada film sama sekali - finish tetap OEM glossy. AutoSP PIK 2 lokasinya strategis dan prosesnya transparan. Sangat merekomendasikan!');
update_safe($testimonial_7005, 'customer_vehicle', 'Honda Civic RS 2024 Crystal Black');
update_safe($testimonial_7005, 'testimonial_source', 'google');
update_safe($testimonial_7005, 'testimonial_featured', 1);

echo "  ✓ Complete testimonial with relationships\n";

// ============================================================
// VERIFICATION
// ============================================================

echo "\n=================================================\n";
echo "Verification - Checking populated data\n";
echo "=================================================\n\n";

// Verify Service 6994
echo "[SERVICE 6994] Verification:\n";
echo "  Hero Title: " . get_post_meta($service_6994, 'hero_title', true) . "\n";
echo "  Short Description: " . substr(get_post_meta($service_6994, 'short_description', true), 0, 50) . "...\n";
echo "  Packages: " . count(get_post_meta($service_6994, 'packages', true)) . " packages\n";
echo "  Benefits: " . count(get_post_meta($service_6994, 'benefits', true)) . " items\n";
echo "  Process: " . count(get_post_meta($service_6994, 'process', true)) . " steps\n";
echo "  SEO Title: " . get_post_meta($service_6994, 'seo_title', true) . "\n";
echo "  Category: " . get_post_meta($service_6994, 'service_category', true) . "\n";

// Verify Location 6997
echo "\n[LOCATION 6997] Verification:\n";
echo "  Address: " . get_post_meta($location_6997, 'address_street', true) . "\n";
echo "  City: " . get_post_meta($location_6997, 'address_city', true) . "\n";
echo "  Lat/Lng: " . get_post_meta($location_6997, 'geo_latitude', true) . ", " . get_post_meta($location_6997, 'geo_longitude', true) . "\n";
echo "  Opening Hours: " . count(get_post_meta($location_6997, 'opening_hours', true)) . " days\n";
echo "  Facilities: " . count(get_post_meta($location_6997, 'location_facilities', true)) . " items\n";
echo "  Service Areas: " . count(get_post_meta($location_6997, 'service_areas', true)) . " areas\n";

// Verify Project 6999
echo "\n[PROJECT 6999] Verification:\n";
echo "  Vehicle: " . get_post_meta($project_6999, 'vehicle_brand', true) . " " . get_post_meta($project_6999, 'vehicle_model', true) . " " . get_post_meta($project_6999, 'vehicle_year', true) . "\n";
echo "  Challenge: " . substr(get_post_meta($project_6999, 'project_challenge', true), 0, 50) . "...\n";
echo "  Completed: " . get_post_meta($project_6999, 'completed_at', true) . "\n";

// Verify FAQ types
echo "\n[FAQ] Verification:\n";
echo "  FAQ 7001 (Global): Service=" . (get_post_meta($faq_7001, 'faq_service', true) ?: 'NULL') . ", Location=" . (get_post_meta($faq_7001, 'faq_location', true) ?: 'NULL') . "\n";
echo "  FAQ 7002 (Service-Specific): Service=" . get_post_meta($faq_7002, 'faq_service', true) . ", Location=" . (get_post_meta($faq_7002, 'faq_location', true) ?: 'NULL') . "\n";
echo "  FAQ 7003 (Location-Specific): Service=" . (get_post_meta($faq_7003, 'faq_service', true) ?: 'NULL') . ", Location=" . get_post_meta($faq_7003, 'faq_location', true) . "\n";

// Verify Testimonials
echo "\n[TESTIMONIALS] Verification:\n";
echo "  7004: Service=" . get_post_meta($testimonial_7004, 'testimonial_service', true) . ", Location=" . get_post_meta($testimonial_7004, 'testimonial_location', true) . "\n";
echo "  7005: Service=" . get_post_meta($testimonial_7005, 'testimonial_service', true) . ", Location=" . get_post_meta($testimonial_7005, 'testimonial_location', true) . "\n";

echo "\n=================================================\n";
echo "Phase 2D.7 - Test Data Entry COMPLETE\n";
echo "=================================================\n";
echo "\n✓ ENVIRONMENT: STAGING\n";
echo "✓ DATA: TEST ONLY\n";
echo "✓ All business fields populated\n";
echo "\nCanonical Test Dataset Ready for GraphQL Testing.\n";
