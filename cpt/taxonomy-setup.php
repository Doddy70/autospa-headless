<?php
/**
 * Plugin Name: AutoSP Taxonomy Setup
 * Description: Setup WordPress Taxonomies for AutoSP AJakarta Headless WordPress
 * Version: 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Custom Taxonomies (if needed in future)
 * Currently using WordPress native Category and Tag
 */
function autosp_register_taxonomies() {

    // Note: Topic is a custom field (text), not a taxonomy
    // Service Areas is a repeater field in Location CPT
    // Location relationships are handled via ACF relationship fields

}
add_action('init', 'autosp_register_taxonomies');

/**
 * Set default category for posts
 */
function autosp_set_default_category($post_id) {
    // Ensure posts have a category
    $categories = get_the_category($post_id);

    if (empty($categories)) {
        // Set to "Tips & Insight" as default
        $default_category = get_term_by('slug', 'tips-and-insight', 'category');
        if ($default_category) {
            wp_set_post_categories($post_id, array($default_category->term_id));
        }
    }
}
add_action('save_post', 'autosp_set_default_category');

/**
 * Register REST API fields for taxonomy data
 */
function autosp_register_taxonomy_rest() {
    // Register category and tag in REST API (enabled by default in WP 4.7+)
    // No additional registration needed
}
add_action('init', 'autosp_register_taxonomy_rest');
