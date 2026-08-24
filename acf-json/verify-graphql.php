<?php
/**
 * Phase 2D.7 - GraphQL Verification Script
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

echo "=================================================\n";
echo "Phase 2D.7 - GraphQL Verification\n";
echo "=================================================\n\n";

// Test FAQ queries
echo "1. FAQ 7001 - GLOBAL (no relationships)\n";
$result = query('{ fAQ(id: "7001", idType: DATABASE_ID) { databaseId fAQContent { faqQuestion faqCategory } fAQContext { faqService { nodes { databaseId } } faqLocation { nodes { databaseId } } } }');
echo json_encode($result, JSON_PRETTY_PRINT) . "\n\n";

echo "2. FAQ 7002 - SERVICE-SPECIFIC\n";
$result = query('{ fAQ(id: "7002", idType: DATABASE_ID) { databaseId fAQContent { faqQuestion faqCategory } fAQContext { faqService { nodes { databaseId } } } }');
echo json_encode($result, JSON_PRETTY_PRINT) . "\n\n";

echo "3. FAQ 7003 - LOCATION-SPECIFIC\n";
$result = query('{ fAQ(id: "7003", idType: DATABASE_ID) { databaseId fAQContent { faqQuestion faqCategory } fAQContext { faqLocation { nodes { databaseId } } } }');
echo json_encode($result, JSON_PRETTY_PRINT) . "\n\n";

// Test Project
echo "4. PROJECT 6999 - Vehicle + Service\n";
$result = query('{ project(id: "6999", idType: DATABASE_ID) { databaseId title projectContent { vehicleBrand vehicleModel vehicleYear } projectRelationships { projectService { nodes { databaseId } } completedAt } } }');
echo json_encode($result, JSON_PRETTY_PRINT) . "\n\n";

// Test Testimonial
echo "5. TESTIMONIAL 7004 - Service + Location\n";
$result = query('{ testimonial(id: "7004", idType: DATABASE_ID) { databaseId testimonialContent { customerName customerQuote } testimonialContext { testimonialService { nodes { databaseId } } testimonialLocation { nodes { databaseId } } } }');
echo json_encode($result, JSON_PRETTY_PRINT) . "\n\n";

echo "=================================================\n";
echo "Verification Complete\n";
echo "=================================================\n";
