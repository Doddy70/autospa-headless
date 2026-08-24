<?php
/**
 * Phase 2D.8 - Fix Relationship Queries with Fragments
 */

$graphql_url = 'https://backend.autospajakarta.com/graphql';

function graphql_query($query) {
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
echo "Phase 2D.8 - Relationship Queries with Fragments\n";
echo "=================================================\n\n";

// Test relationships using databaseId instead of title
$tests = [
    // API-06: Service → Location (M:N)
    'API-06: Service → Location' => '
      query {
        serviceBy(slug: "test-nano-ceramic-coating") {
          databaseId
          serviceRelationships {
            relatedLocations { nodes { databaseId } }
          }
        }
      }
    ',

    // API-07: Location → Service (M:N)
    'API-07: Location → Service' => '
      query {
        locationBy(slug: "test-autosp-pluit") {
          databaseId
          locationRelationships {
            locationServices { nodes { databaseId } }
          }
        }
      }
    ',

    // API-08: Service → Project (M:N)
    'API-08: Service → Project' => '
      query {
        serviceBy(slug: "test-nano-ceramic-coating") {
          databaseId
          serviceRelationships {
            relatedProjects { nodes { databaseId } }
          }
        }
      }
    ',

    // API-09: Project → Service (N:1)
    'API-09: Project → Service' => '
      query {
        projectBy(slug: "test-toyota-alphard-ceramic") {
          databaseId
          projectRelationships {
            projectService { nodes { databaseId } }
          }
        }
      }
    ',

    // API-10: Project → Location (N:1)
    'API-10: Project → Location (empty)' => '
      query {
        projectBy(slug: "test-toyota-alphard-ceramic") {
          databaseId
          projectRelationships {
            projectLocation { nodes { databaseId } }
          }
        }
      }
    ',

    // API-11: FAQ → Service
    'API-11: FAQ → Service' => '
      query {
        fAQ(id: "7002", idType: DATABASE_ID) {
          databaseId
          fAQContext {
            faqService { nodes { databaseId } }
          }
        }
      }
    ',

    // API-12: FAQ → Location
    'API-12: FAQ → Location' => '
      query {
        fAQ(id: "7003", idType: DATABASE_ID) {
          databaseId
          fAQContext {
            faqLocation { nodes { databaseId } }
          }
        }
      }
    ',

    // API-04: FAQ with content
    'API-04: FAQ with content' => '
      query {
        fAQ(id: "7001", idType: DATABASE_ID) {
          databaseId
          fAQContent { faqQuestion }
        }
      }
    ',
];

$passed = 0;
$failed = 0;

foreach ($tests as $name => $query) {
    $result = graphql_query($query);

    if (isset($result['errors'])) {
        echo "✗ $name: ERROR\n";
        echo "  {$result['errors'][0]['message']}\n";
        $failed++;
    } else {
        echo "✓ $name: PASS\n";
        $passed++;
    }
}

echo "\n=================================================\n";
echo "Results: $passed passed, $failed failed\n";

// Now verify the actual relationship values match database
echo "\nVerifying relationship values match database...\n\n";

$result = graphql_query('
  query {
    serviceBy(slug: "test-nano-ceramic-coating") {
      databaseId
      serviceRelationships {
        relatedLocations { nodes { databaseId } }
        relatedProjects { nodes { databaseId } }
      }
    }
  }
');

if (isset($result['data']['serviceBy'])) {
    $data = $result['data']['serviceBy'];
    echo "Service 6994 relationships:\n";
    echo "  Locations: " . json_encode(array_map(fn($n) => $n['databaseId'], $data['serviceRelationships']['relatedLocations']['nodes'] ?? [])) . "\n";
    echo "  Projects: " . json_encode(array_map(fn($n) => $n['databaseId'], $data['serviceRelationships']['relatedProjects']['nodes'] ?? [])) . "\n";

    echo "\nDatabase expects:\n";
    echo "  Locations: [6997, 6998]\n";
    echo "  Projects: [6999]\n";

    $locs = array_map(fn($n) => $n['databaseId'], $data['serviceRelationships']['relatedLocations']['nodes'] ?? []);
    $projs = array_map(fn($n) => $n['databaseId'], $data['serviceRelationships']['relatedProjects']['nodes'] ?? []);

    if ($locs == [6997, 6998] && $projs == [6999]) {
        echo "\n✓ Relationship values MATCH database!\n";
    } else {
        echo "\n✗ Relationship values DO NOT match database!\n";
    }
}
