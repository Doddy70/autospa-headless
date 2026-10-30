<?php
/**
 * Repair the media library so WPGraphQL can resolve its attachments.
 *
 * WHAT THIS DOES
 *
 * WPGraphQL hides an attachment when its parent post is of a type that is
 * not exposed in the schema. The attachment inherits the visibility of its
 * parent, and a parent it cannot resolve means the attachment is treated as
 * private - `mediaItem(id: ...)` answers null and every ACF image field that
 * points at it resolves to null as well.
 *
 * The staging install inherited its media library from the old production
 * theme. Those attachments are still attached to the leftovers of that
 * theme - `portfolio` (41), `tcg_teb` (13), `metform-form` (1) and
 * `elementor_library` (1) - and none of those types is registered with
 * WPGraphQL. That is why the hero image of five of the six services was
 * empty even though the attachment existed and the file was on disk.
 *
 * This script detaches them: `post_parent` becomes 0, the state every
 * standalone library image has. Nothing is deleted, no file is touched and
 * the attachment keeps its id, so every field that already points at it
 * starts resolving.
 *
 * It only touches attachments whose parent type is NOT exposed in the
 * GraphQL schema, so the images that are attached to a page or a post - and
 * therefore already visible - are left alone.
 *
 * USAGE
 *
 *   wp eval-file acf-json/repair-media-parents.php
 *
 *   or, with a dry run:
 *   AUTOSP_SEED=dry wp eval-file acf-json/repair-media-parents.php
 *
 * The script is idempotent: an attachment that is already detached is
 * skipped.
 */

if (!defined('ABSPATH')) {
    require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';
}

error_reporting(E_ERROR | E_PARSE);

define('AUTOSP_SEED_DRY', strtolower((string) (getenv('AUTOSP_SEED') ?: '')) === 'dry');

echo "=================================================\n";
echo AUTOSP_SEED_DRY ? "Repairing media parents (DRY RUN)\n" : "Repairing media parents\n";
echo "=================================================\n\n";

/**
 * The post types WPGraphQL exposes.
 *
 * WPGraphQL flags the types it registers with `show_in_graphql`, so this
 * list follows the schema instead of a hard coded guess.
 */
$exposed = get_post_types(['show_in_graphql' => true], 'names');

echo "Exposed post types: " . implode(', ', $exposed) . "\n\n";

/**
 * Every attachment that is attached to a parent the schema cannot see.
 */
global $wpdb;

$exposed_list = array_values($exposed);
$placeholders = implode(',', array_fill(0, count($exposed_list), '%s'));

$rows = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT p.ID AS attachment_id, p.post_title, p.post_parent,
                pp.post_type AS parent_type, pp.post_status AS parent_status
         FROM {$wpdb->posts} p
         INNER JOIN {$wpdb->posts} pp ON pp.ID = p.post_parent
         WHERE p.post_type = 'attachment'
           AND pp.post_type NOT IN ({$placeholders})
         ORDER BY pp.post_type, p.ID",
        $exposed_list
    ),
    ARRAY_A
);

if (empty($rows)) {
    echo "Nothing to repair.\n";
    echo "=================================================\n";
    return;
}

/* A short summary per parent type. */
$by_type = [];
foreach ($rows as $row) {
    $by_type[$row['parent_type']][] = $row;
}

foreach ($by_type as $type => $items) {
    echo "{$type}: " . count($items) . " attachment(s)\n";
}
echo "\n";

$repaired = 0;

foreach ($rows as $row) {
    $id = (int) $row['attachment_id'];

    if (AUTOSP_SEED_DRY) {
        echo "    ~ would detach: {$row['post_title']} (attachment {$id}, parent {$row['post_parent']} of type {$row['parent_type']})\n";
        continue;
    }

    $result = $wpdb->update(
        $wpdb->posts,
        ['post_parent' => 0],
        ['ID' => $id],
        ['%d'],
        ['%d']
    );

    if ($result === false) {
        echo "    ! could not detach attachment {$id}: " . $wpdb->last_error . "\n";
        continue;
    }

    $repaired += (int) $result;
    echo "    + detached: {$row['post_title']} (attachment {$id})\n";
}

echo "\n=================================================\n";
echo AUTOSP_SEED_DRY
    ? "DRY RUN - nothing was written\n"
    : "Detached: {$repaired} attachment(s)\n";
echo "=================================================\n";
