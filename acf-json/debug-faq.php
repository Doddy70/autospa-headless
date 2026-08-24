<?php
/**
 * Debug FAQ field names
 */

$graphql_url = 'https://backend.autospajakarta.com/graphql';

function query($query) {
    global $graphql_url;

    $ch = curl_init($graphql_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['query' => $query]));
    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

echo "Testing FAQ field names:\n\n";

// Test different field combinations
$tests = [
    'FAQContent' => '{ fAQ(id: "7001", idType: DATABASE_ID) { databaseId FAQContent { faqQuestion } } }',
    'faqContent' => '{ fAQ(id: "7001", idType: DATABASE_ID) { databaseId faqContent { faqQuestion } } }',
    'Content' => '{ fAQ(id: "7001", idType: DATABASE_ID) { databaseId Content } }',
    'all fields' => '{ fAQ(id: "7001", idType: DATABASE_ID) { databaseId title content featuredImage { node { sourceUrl } } } }',
];

foreach ($tests as $name => $q) {
    echo "$name: ";
    $result = query($q);
    if (isset($result['errors'])) {
        echo "ERROR: " . $result['errors'][0]['message'] . "\n";
    } else {
        echo "OK\n";
        print_r($result['data']);
    }
    echo "\n";
}
