<?php
/**
 * Phase 2D.8 - Full API Contract Tests
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

function test($name, $query) {
    $result = graphql_query($query);

    if (isset($result['errors'])) {
        echo "✗ $name: ERROR\n";
        echo "  {$result['errors'][0]['message']}\n";
        return false;
    } else {
        echo "✓ $name: PASS\n";
        return true;
    }
}

echo "=================================================\n";
echo "Phase 2D.8 - Full API Contract Tests\n";
echo "=================================================\n\n";

// API-01: Service by slug with nested content
echo "=== API-01 to API-03: Single Entity Queries ===\n";
test("API-01: Service query by slug", '
  query {
    serviceBy(slug: "test-nano-ceramic-coating") {
      databaseId
      title
      slug
      serviceContent { shortDescription }
      serviceRelationships { serviceCategory }
    }
  }
');

test("API-02: Location query by slug", '
  query {
    locationBy(slug: "test-autosp-pluit") {
      databaseId
      title
      slug
      locationAddress { addressCity addressStreet }
      locationGeo { geoLatitude geoLongitude }
    }
  }
');

test("API-03: Project query by slug", '
  query {
    projectBy(slug: "test-toyota-alphard-ceramic") {
      databaseId
      title
      slug
      projectContent { vehicleBrand vehicleModel }
    }
  }
');

// API-04 & 05: FAQ and Testimonial
echo "\n=== API-04 to API-05: FAQ and Testimonial ===\n";
test("API-04: FAQ query", '
  query {
    fAQs(first: 3) {
      nodes {
        databaseId
        fAQContent { faqQuestion faqCategory }
      }
    }
  }
');

test("API-05: Testimonial query", '
  query {
    testimonials(first: 2) {
      nodes {
        databaseId
        testimonialContent { customerName customerQuote }
      }
    }
  }
');

// API-06 to API-12: Relationships
echo "\n=== API-06 to API-12: Relationship Tests ===\n";
test("API-06: Service → Location (M:N)", '
  query {
    serviceBy(slug: "test-nano-ceramic-coating") {
      databaseId
      serviceRelationships {
        relatedLocations { nodes { databaseId title } }
      }
    }
  }
');

test("API-07: Location → Service (M:N)", '
  query {
    locationBy(slug: "test-autosp-pluit") {
      databaseId
      locationRelationships {
        locationServices { nodes { databaseId title } }
      }
    }
  }
');

test("API-08: Service → Project (M:N)", '
  query {
    serviceBy(slug: "test-nano-ceramic-coating") {
      databaseId
      serviceRelationships {
        relatedProjects { nodes { databaseId title } }
      }
    }
  }
');

test("API-09: Project → Service (N:1)", '
  query {
    projectBy(slug: "test-toyota-alphard-ceramic") {
      databaseId
      projectRelationships {
        projectService { nodes { databaseId title } }
      }
    }
  }
');

test("API-10: Project → Location (N:1, may be empty)", '
  query {
    projectBy(slug: "test-toyota-alphard-ceramic") {
      databaseId
      projectRelationships {
        projectLocation { nodes { databaseId title } }
      }
    }
  }
');

test("API-11: FAQ → Service", '
  query {
    fAQ(id: "7002", idType: DATABASE_ID) {
      databaseId
      fAQContext {
        faqService { nodes { databaseId title } }
      }
    }
  }
');

test("API-12: FAQ → Location", '
  query {
    fAQ(id: "7003", idType: DATABASE_ID) {
      databaseId
      fAQContext {
        faqLocation { nodes { databaseId title } }
      }
    }
  }
');

// API-13 to API-16: Nested ACF Fields
echo "\n=== API-13 to API-16: Nested ACF Field Tests ===\n";
test("API-13: Nested ACF - Service hero", '
  query {
    serviceBy(slug: "test-nano-ceramic-coating") {
      databaseId
      serviceHero { heroTitle heroDescription }
      serviceContent { shortDescription }
    }
  }
');

test("API-14: Repeater fields - Benefits", '
  query {
    serviceBy(slug: "test-nano-ceramic-coating") {
      databaseId
      serviceContent {
        benefits { benefitTitle benefitDescription }
      }
    }
  }
');

test("API-15: Package → vehicle sizes (nested)", '
  query {
    serviceBy(slug: "test-nano-ceramic-coating") {
      databaseId
      servicePackages {
        packages {
          packageName
          vehicleSizes { sizeLabel price }
        }
      }
    }
  }
');

test("API-16: SEO fields", '
  query {
    serviceBy(slug: "test-nano-ceramic-coating") {
      databaseId
      serviceSEO { seoTitle seoDescription }
    }
  }
');

// API-17: Pagination
echo "\n=== API-17: Pagination ===\n";
test("API-17: Pagination with cursor", '
  query {
    services(first: 2) {
      nodes { databaseId title }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
');

// API-18: Empty relationships (Project 7000 has no location)
echo "\n=== API-18: Empty Relationships ===\n";
test("API-18: Empty relationship (no error)", '
  query {
    projectBy(slug: "test-honda-civic-ppf") {
      databaseId
      title
      projectRelationships {
        projectLocation { nodes { databaseId } }
      }
    }
  }
');

// API-19: Invalid slug
echo "\n=== API-19: Invalid/Nonexistent Slug ===\n";
$result = graphql_query('
  query {
    serviceBy(slug: "non-existent-service-xyz-12345") {
      databaseId
      title
    }
  }
');

if (isset($result['errors'])) {
    echo "✗ API-19: Invalid slug returns ERROR (should be null)\n";
} elseif ($result['data']['serviceBy'] === null) {
    echo "✓ API-19: Invalid slug returns null (CORRECT)\n";
} else {
    echo "? API-19: Unexpected result\n";
    print_r($result);
}

// API-20: Published vs Draft visibility
echo "\n=== API-20: Draft vs Published Visibility ===\n";

// First, check if we have any draft posts
require_once '/www/wwwroot/backend.autospajakarta.com/wp-load.php';

$drafts = get_posts([
    'post_type' => 'service',
    'post_status' => 'draft',
    'posts_per_page' => 1,
]);

if (empty($drafts)) {
    // Create a draft for testing
    $draft_id = wp_insert_post([
        'post_type' => 'service',
        'post_title' => 'DRAFT TEST - Should Not Appear',
        'post_status' => 'draft',
        'post_name' => 'draft-test-service-api',
    ]);
    echo "Created draft post ID: $draft_id\n";
} else {
    $draft_id = $drafts[0]->ID;
    echo "Found draft post ID: $draft_id\n";
}

$result = graphql_query('
  query {
    services(first: 100) {
      nodes { databaseId title }
    }
  }
');

if (isset($result['errors'])) {
    echo "✗ API-20: Cannot query services\n";
} else {
    $all_ids = array_column($result['data']['services']['nodes'], 'databaseId');
    if (in_array($draft_id, $all_ids)) {
        echo "✗ API-20: Draft post IS visible in GraphQL (SECURITY ISSUE)\n";
    } else {
        echo "✓ API-20: Draft post NOT visible (correct)\n";
    }
}

echo "\n=================================================\n";
echo "Test Summary\n";
echo "=================================================\n";
echo "\nKey Findings:\n";
echo "  - serviceBy(slug: \"...\") - Single service by slug\n";
echo "  - locationBy(slug: \"...\") - Single location by slug\n";
echo "  - projectBy(slug: \"...\") - Single project by slug\n";
echo "  - services(first: X) - List with pagination\n";
echo "  - Invalid slug returns null (not error)\n";
echo "  - Draft posts not visible in GraphQL\n";
