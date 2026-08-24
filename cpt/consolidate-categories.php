<?php
/**
 * AutoSP Category Consolidation Script
 *
 * This script merges categories per the taxonomy specification.
 * Run this during Phase 2D.9 Content Migration.
 *
 * Usage: wp eval-file consolidate-categories.php
 */

// Category merge mapping
$category_merges = [
    // Merge source => destination
    'Bengkel Detailing' => 'Auto Detailing',
    'Auto Detailing' => 'Auto Detailing', // Merge into same
    'Salon Mobil Jakarta' => 'Salon Mobil',
    'Coating Mobil' => 'Coating',
    'Nano Ceramic Coating' => 'Coating',
    'Interior Detailing' => 'Engine Detailing',
    'Eksterior Detailing' => 'Engine Detailing',
    'Glass Cleanning' => 'Car Wash',
    'Glass Cleaning' => 'Car Wash',
    'Experience' => 'Tips & Insight',
    'Autospa Pluit' => null, // Remove/uncategorize
];

// Categories to rename
$category_renames = [
    'Mudik Lebaran' => 'Mudik & Seasonal',
];

echo "AutoSP Category Consolidation\n";
echo str_repeat('=', 50) . "\n\n";

// Process merges
echo "1. Merging Categories:\n";
echo str_repeat('-', 30) . "\n";

foreach ($category_merges as $source => $destination) {
    $source_term = get_term_by('name', $source, 'category');

    if (!$source_term || is_wp_error($source_term)) {
        echo "  ⚠ {$source}: Not found\n";
        continue;
    }

    if ($destination === null) {
        // Remove category from posts
        $posts = get_posts([
            'post_type' => 'post',
            'category' => $source_term->term_id,
            'posts_per_page' => -1,
        ]);

        foreach ($posts as $post) {
            wp_remove_object_terms($post->ID, $source_term->term_id, 'category');
        }

        echo "  ✓ {$source}: Removed from " . count($posts) . " posts\n";
    } else {
        $dest_term = get_term_by('name', $destination, 'category');

        if (!$dest_term || is_wp_error($dest_term)) {
            // Create destination if doesn't exist
            $new_term = wp_insert_term($destination, 'category');
            if (!is_wp_error($new_term)) {
                $dest_term = get_term($new_term['term_id']);
            }
        }

        if ($dest_term) {
            // Update all posts from source to destination
            $posts = get_posts([
                'post_type' => 'post',
                'category' => $source_term->term_id,
                'posts_per_page' => -1,
            ]);

            foreach ($posts as $post) {
                // Remove source category
                wp_remove_object_terms($post->ID, $source_term->term_id, 'category');
                // Add destination category
                wp_add_object_terms($post->ID, $dest_term->term_id, 'category');
            }

            echo "  ✓ {$source} → {$destination}: " . count($posts) . " posts merged\n";
        }
    }
}

echo "\n2. Renaming Categories:\n";
echo str_repeat('-', 30) . "\n";

foreach ($category_renames as $old => $new) {
    $term = get_term_by('name', $old, 'category');

    if ($term && !is_wp_error($term)) {
        wp_update_term($term->term_id, 'category', [
            'name' => $new,
            'slug' => sanitize_title($new),
        ]);
        echo "  ✓ {$old} → {$new}\n";
    } else {
        echo "  ⚠ {$old}: Not found\n";
    }
}

echo "\n" . str_repeat('=', 50) . "\n";
echo "Category consolidation complete!\n";
