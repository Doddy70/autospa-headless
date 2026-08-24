<?php
/**
 * Plugin Name: AutoSP CPT Registration
 * Description: Register Custom Post Types for AutoSP AJakarta Headless WordPress
 * Version: 1.0.0
 * Author: AutoSP AJakarta
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Custom Post Types
 */
function autosp_register_post_types() {

    // ========================================
    // 1. SERVICE CPT
    // ========================================
    register_post_type('service', [
        'labels' => [
            'name'                  => 'Services',
            'singular_name'         => 'Service',
            'menu_name'             => 'Services',
            'name_admin_bar'        => 'Service',
            'add_new'               => 'Add New',
            'add_new_item'          => 'Add New Service',
            'edit_item'             => 'Edit Service',
            'new_item'              => 'New Service',
            'view_item'             => 'View Service',
            'search_items'          => 'Search Services',
            'not_found'             => 'No services found',
            'not_found_in_trash'    => 'No services found in trash',
        ],
        'description'           => 'AutoSP Services - Ceramic Coating, PPF, Detailing, Wash',
        'public'               => true,
        'show_in_graphql'      => true,
        'graphql_single_name'   => 'Service',
        'graphql_plural_name'   => 'Services',
        'hierarchical'         => false,
        'exclude_from_search'  => false,
        'show_ui'              => true,
        'show_in_menu'         => true,
        'menu_position'        => 25,
        'menu_icon'            => 'dashicons-car',
        'capability_type'      => 'post',
        'capabilities'         => [
            'edit_post'          => 'edit_post',
            'read_post'          => 'read_post',
            'delete_post'        => 'delete_post',
            'edit_posts'         => 'edit_posts',
            'edit_others_posts'  => 'edit_others_posts',
            'publish_posts'      => 'publish_posts',
            'read_private_posts' => 'read_private_posts',
        ],
        'supports' => [
            'title',
            'editor',
            'thumbnail',
            'excerpt',
            'custom-fields',
            'author',
        ],
        'has_archive'          => 'services',
        'rewrite' => [
            'slug'       => 'services',
            'with_front' => false,
            'feeds'      => false,
            'pages'      => true,
        ],
        'taxonomies'          => [],
        'show_in_rest'        => true,
    ]);

    // ========================================
    // 2. LOCATION CPT
    // ========================================
    register_post_type('location', [
        'labels' => [
            'name'                  => 'Locations',
            'singular_name'         => 'Location',
            'menu_name'             => 'Locations',
            'name_admin_bar'        => 'Location',
            'add_new'               => 'Add New',
            'add_new_item'          => 'Add New Location',
            'edit_item'             => 'Edit Location',
            'new_item'              => 'New Location',
            'view_item'             => 'View Location',
            'search_items'          => 'Search Locations',
            'not_found'             => 'No locations found',
            'not_found_in_trash'    => 'No locations found in trash',
        ],
        'description'           => 'AutoSP Locations - Physical service locations',
        'public'               => true,
        'show_in_graphql'      => true,
        'graphql_single_name'   => 'Location',
        'graphql_plural_name'   => 'Locations',
        'hierarchical'         => false,
        'exclude_from_search'   => false,
        'show_ui'              => true,
        'show_in_menu'         => true,
        'menu_position'        => 26,
        'menu_icon'            => 'dashicons-location',
        'capability_type'      => 'post',
        'capabilities'         => [
            'edit_post'          => 'edit_post',
            'read_post'          => 'read_post',
            'delete_post'        => 'delete_post',
            'edit_posts'         => 'edit_posts',
            'edit_others_posts'  => 'edit_others_posts',
            'publish_posts'      => 'publish_posts',
            'read_private_posts' => 'read_private_posts',
        ],
        'supports' => [
            'title',
            'editor',
            'thumbnail',
            'excerpt',
            'custom-fields',
            'author',
        ],
        'has_archive'          => 'locations',
        'rewrite' => [
            'slug'       => 'locations',
            'with_front' => false,
            'feeds'      => false,
            'pages'      => true,
        ],
        'taxonomies'          => [],
        'show_in_rest'        => true,
    ]);

    // ========================================
    // 3. PROJECT CPT
    // ========================================
    register_post_type('project', [
        'labels' => [
            'name'                  => 'Projects',
            'singular_name'         => 'Project',
            'menu_name'             => 'Projects',
            'name_admin_bar'        => 'Project',
            'add_new'               => 'Add New',
            'add_new_item'          => 'Add New Project',
            'edit_item'             => 'Edit Project',
            'new_item'              => 'New Project',
            'view_item'             => 'View Project',
            'search_items'          => 'Search Projects',
            'not_found'             => 'No projects found',
            'not_found_in_trash'    => 'No projects found in trash',
        ],
        'description'           => 'AutoSP Projects - Portfolio of completed work',
        'public'               => true,
        'show_in_graphql'      => true,
        'graphql_single_name'   => 'Project',
        'graphql_plural_name'   => 'Projects',
        'hierarchical'         => false,
        'exclude_from_search'   => false,
        'show_ui'              => true,
        'show_in_menu'         => true,
        'menu_position'        => 27,
        'menu_icon'            => 'dashicons-images-alt',
        'capability_type'      => 'post',
        'capabilities'         => [
            'edit_post'          => 'edit_post',
            'read_post'          => 'read_post',
            'delete_post'        => 'delete_post',
            'edit_posts'         => 'edit_posts',
            'edit_others_posts'  => 'edit_others_posts',
            'publish_posts'      => 'publish_posts',
            'read_private_posts' => 'read_private_posts',
        ],
        'supports' => [
            'title',
            'editor',
            'thumbnail',
            'custom-fields',
            'author',
        ],
        'has_archive'          => 'projects',
        'rewrite' => [
            'slug'       => 'projects',
            'with_front' => false,
            'feeds'      => false,
            'pages'      => true,
        ],
        'taxonomies'          => [],
        'show_in_rest'        => true,
    ]);

    // ========================================
    // 4. FAQ CPT
    // ========================================
    register_post_type('faq', [
        'labels' => [
            'name'                  => 'FAQs',
            'singular_name'         => 'FAQ',
            'menu_name'             => 'FAQs',
            'name_admin_bar'        => 'FAQ',
            'add_new'               => 'Add New',
            'add_new_item'          => 'Add New FAQ',
            'edit_item'             => 'Edit FAQ',
            'new_item'              => 'New FAQ',
            'view_item'             => 'View FAQ',
            'search_items'          => 'Search FAQs',
            'not_found'             => 'No FAQs found',
            'not_found_in_trash'    => 'No FAQs found in trash',
        ],
        'description'           => 'AutoSP FAQs - Frequently Asked Questions',
        'public'               => true,
        'show_in_graphql'      => true,
        'graphql_single_name'   => 'FAQ',
        'graphql_plural_name'   => 'FAQs',
        'hierarchical'         => false,
        'exclude_from_search'   => false,
        'show_ui'              => true,
        'show_in_menu'         => true,
        'menu_position'        => 28,
        'menu_icon'            => 'dashicons-editor-help',
        'capability_type'      => 'post',
        'capabilities'         => [
            'edit_post'          => 'edit_post',
            'read_post'          => 'read_post',
            'delete_post'        => 'delete_post',
            'edit_posts'         => 'edit_posts',
            'edit_others_posts'  => 'edit_others_posts',
            'publish_posts'      => 'publish_posts',
            'read_private_posts' => 'read_private_posts',
        ],
        'supports' => [
            'title',
            'editor',
            'custom-fields',
        ],
        'has_archive'          => false,
        'rewrite' => [
            'slug'       => 'faq',
            'with_front' => false,
            'feeds'      => false,
            'pages'      => false,
        ],
        'taxonomies'          => [],
        'show_in_rest'        => true,
    ]);

    // ========================================
    // 5. TESTIMONIAL CPT
    // ========================================
    register_post_type('testimonial', [
        'labels' => [
            'name'                  => 'Testimonials',
            'singular_name'         => 'Testimonial',
            'menu_name'             => 'Testimonials',
            'name_admin_bar'        => 'Testimonial',
            'add_new'               => 'Add New',
            'add_new_item'          => 'Add New Testimonial',
            'edit_item'             => 'Edit Testimonial',
            'new_item'              => 'New Testimonial',
            'view_item'             => 'View Testimonial',
            'search_items'          => 'Search Testimonials',
            'not_found'             => 'No testimonials found',
            'not_found_in_trash'    => 'No testimonials found in trash',
        ],
        'description'           => 'AutoSP Testimonials - Customer reviews and testimonials',
        'public'               => true,
        'show_in_graphql'      => true,
        'graphql_single_name'   => 'Testimonial',
        'graphql_plural_name'   => 'Testimonials',
        'hierarchical'         => false,
        'exclude_from_search'   => false,
        'show_ui'              => true,
        'show_in_menu'         => true,
        'menu_position'        => 29,
        'menu_icon'            => 'dashicons-testimonial',
        'capability_type'      => 'post',
        'capabilities'         => [
            'edit_post'          => 'edit_post',
            'read_post'          => 'read_post',
            'delete_post'        => 'delete_post',
            'edit_posts'         => 'edit_posts',
            'edit_others_posts'  => 'edit_others_posts',
            'publish_posts'      => 'publish_posts',
            'read_private_posts' => 'read_private_posts',
        ],
        'supports' => [
            'title',
            'thumbnail',
            'custom-fields',
        ],
        'has_archive'          => false,
        'rewrite' => [
            'slug'       => 'testimonial',
            'with_front' => false,
            'feeds'      => false,
            'pages'      => false,
        ],
        'taxonomies'          => [],
        'show_in_rest'        => true,
    ]);

}
add_action('init', 'autosp_register_post_types');

/**
 * Flush rewrite rules on activation/deactivation
 */
function autosp_flush_rewrite_rules() {
    autosp_register_post_types();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'autosp_flush_rewrite_rules');
register_deactivation_hook(__FILE__, 'flush_rewrite_rules');
