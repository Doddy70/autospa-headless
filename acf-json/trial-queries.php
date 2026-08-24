<?php
/**
 * Phase 2D.8 - Trial queries to find correct API names
 */

$graphql_url = 'https://backend.autospajakarta.com/graphql';

function graphql_query($query, $variables = []) {
    global $graphql_url;

    $ch = curl_init($graphql_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['query' => $query, 'variables' => $variables]));
    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

echo "=================================================\n";
echo "Phase 2D.8 - Finding Correct Query Names\n";
echo "=================================================\n\n";

$tests = [
    // Service by slug variations
    'serviceBy(slug:)' => '{ serviceBy(slug: "test-nano-ceramic-coating") { databaseId title } }',
    'serviceBy' => '{ serviceBy(slug: "test-nano-ceramic-coating") { databaseId title } }',
    'service(slug:)' => '{ service(slug: "test-nano-ceramic-coating") { databaseId title } }',
    'serviceBySlug' => '{ serviceBySlug(slug: "test-nano-ceramic-coating") { databaseId title } }',

    // Location by slug
    'locationBy' => '{ locationBy(slug: "test-autosp-pluit") { databaseId title } }',
    'location(slug:)' => '{ location(slug: "test-autosp-pluit") { databaseId title } }',

    // Project by slug
    'projectBy' => '{ projectBy(slug: "test-toyota-alphard-ceramic") { databaseId title } }',
    'project(slug:)' => '{ project(slug: "test-toyota-alphard-ceramic") { databaseId title } }',
];

echo "Testing query patterns:\n\n";

foreach ($tests as $name => $query) {
    $result = graphql_query($query);

    if (isset($result['errors'])) {
        $msg = $result['errors'][0]['message'] ?? 'Unknown error';
        if (strpos($msg, 'Cannot query') !== false || strpos($msg, 'not exist') !== false) {
            echo "✗ $name: Not found\n";
        } elseif (strpos($msg, 'Argument') !== false || strpos($msg, 'idType') !== false) {
            echo "? $name: Argument issue\n";
        } else {
            echo "? $name: $msg\n";
        }
    } else {
        echo "✓ $name: WORKS\n";
        if (isset($result['data'])) {
            print_r($result['data']);
        }
    }
}

echo "\n=================================================\n";

// Now test pagination
echo "Testing LIST queries with pagination:\n\n";

$list_tests = [
    'services(first:)' => '{ services(first: 3) { nodes { databaseId title } pageInfo { hasNextPage endCursor } } }',
    'locations(first:)' => '{ locations(first: 3) { nodes { databaseId title } pageInfo { hasNextPage endCursor } } }',
    'projects(first:)' => '{ projects(first: 3) { nodes { databaseId title } pageInfo { hasNextPage endCursor } } }',
    'fAQs(first:)' => '{ fAQs(first: 3) { nodes { databaseId } pageInfo { hasNextPage endCursor } } }',
    'testimonials(first:)' => '{ testimonials(first: 3) { nodes { databaseId } pageInfo { hasNextPage endCursor } } }',
];

foreach ($list_tests as $name => $query) {
    $result = graphql_query($query);

    if (isset($result['errors'])) {
        $msg = $result['errors'][0]['message'] ?? 'Unknown error';
        echo "✗ $name: $msg\n";
    } else {
        echo "✓ $name: WORKS\n";
        $data = $result['data'] ?? [];
        $keys = array_keys($data);
        if (!empty($keys)) {
            $key = $keys[0];
            $count = count($data[$key]['nodes'] ?? []);
            echo "  Found {$count} items\n";
        }
    }
}

echo "\n=================================================\n";
echo "Testing INVALID SLUG (should return null, not error):\n\n";

$invalid_tests = [
    'invalid service slug' => '{ serviceBy(slug: "this-does-not-exist-12345") { databaseId title } }',
    'invalid location slug' => '{ locationBy(slug: "non-existent-location-xyz") { databaseId title } }',
];

foreach ($invalid_tests as $name => $query) {
    $result = graphql_query($query);

    if (isset($result['errors'])) {
        echo "✗ $name: ERROR - {$result['errors'][0]['message']}\n";
    } else {
        $data = $result['data'] ?? [];
        $keys = array_keys($data);
        if (!empty($keys)) {
            $key = $keys[0];
            if ($data[$key] === null) {
                echo "✓ $name: Returns null (CORRECT)\n";
            } else {
                echo "? $name: Returns data (unexpected)\n";
                print_r($data);
            }
        }
    }
}
