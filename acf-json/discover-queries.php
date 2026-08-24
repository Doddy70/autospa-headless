<?php
/**
 * Phase 2D.8 - Discover GraphQL Query Names
 * Uses introspection to find actual query names
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
echo "Phase 2D.8 - GraphQL API Discovery\n";
echo "=================================================\n\n";

// Introspection: Get all root query fields
$introspection = graphql_query('
{
  __schema {
    queryType {
      fields {
        name
        description
        type {
          name
          kind
        }
        args {
          name
          type {
            name
            kind
          }
        }
      }
    }
  }
}
');

if (isset($introspection['errors'])) {
    echo "ERROR: Introspection may be disabled\n";
    print_r($introspection['errors']);
    exit;
}

echo "Root Query Fields:\n";
echo str_repeat("-", 60) . "\n";

$query_fields = $introspection['data']['__schema']['queryType']['fields'];

$relevant_fields = ['service', 'location', 'project', 'faq', 'testimonial', 'post'];

foreach ($query_fields as $field) {
    $name = $field['name'];

    // Check if it's a CPT-related field
    $is_cpt = false;
    foreach ($relevant_fields as $cpt) {
        if (stripos($name, $cpt) !== false) {
            $is_cpt = true;
            break;
        }
    }

    if ($is_cpt) {
        echo "\nField: {$name}\n";
        echo "Description: " . ($field['description'] ?: 'none') . "\n";
        echo "Type: " . ($field['type']['name'] ?: $field['type']['kind']) . "\n";

        if (!empty($field['args'])) {
            echo "Arguments:\n";
            foreach ($field['args'] as $arg) {
                echo "  - {$arg['name']} ({$arg['type']['name']})\n";
            }
        }
    }
}

echo "\n=================================================\n";
echo "All Query Fields:\n";
echo str_repeat("-", 60) . "\n";

foreach ($query_fields as $field) {
    echo "{$field['name']}\n";
}
