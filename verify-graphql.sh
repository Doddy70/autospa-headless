#!/bin/bash

echo "================================================="
echo "Phase 2D.7 - GraphQL Verification"
echo "================================================="
echo ""

echo "1. PROJECT 6999: Vehicle + Service Relationship"
curl -s backend.autospajakarta.com/graphql -H 'Content-Type: application/json' \
  -d '{"query":"{ project(id: \"6999\", idType: DATABASE_ID) { databaseId title projectContent { vehicleBrand vehicleModel } projectRelationships { projectService { nodes { databaseId } } completedAt } }"}' | jq '.'

echo ""
echo "2. FAQ 7001: GLOBAL (no relationships)"
curl -s backend.autospajakarta.com/graphql -H 'Content-Type: application/json' \
  -d '{"query":"{ fAQ(id: \"7001\", idType: DATABASE_ID) { databaseId faqContent { faqQuestion faqCategory } faqContext { faqService { nodes { databaseId } } faqLocation { nodes { databaseId } } } }"}' | jq '.'

echo ""
echo "3. FAQ 7002: SERVICE-SPECIFIC"
curl -s backend.autospajakarta.com/graphql -H 'Content-Type: application/json' \
  -d '{"query":"{ fAQ(id: \"7002\", idType: DATABASE_ID) { databaseId faqContent { faqQuestion faqCategory } faqContext { faqService { nodes { databaseId } } } }"}' | jq '.'

echo ""
echo "4. FAQ 7003: LOCATION-SPECIFIC"
curl -s backend.autospajakarta.com/graphql -H 'Content-Type: application/json' \
  -d '{"query":"{ fAQ(id: \"7003\", idType: DATABASE_ID) { databaseId faqContent { faqQuestion faqCategory } faqContext { faqLocation { nodes { databaseId } } } }"}' | jq '.'

echo ""
echo "5. TESTIMONIAL 7004: Service + Location Relationships"
curl -s backend.autospajakarta.com/graphql -H 'Content-Type: application/json' \
  -d '{"query":"{ testimonial(id: \"7004\", idType: DATABASE_ID) { databaseId testimonialContent { customerName customerQuote } testimonialContext { testimonialService { nodes { databaseId } } testimonialLocation { nodes { databaseId } } } }"}' | jq '.'

echo ""
echo "================================================="
echo "Verification Complete"
echo "================================================="
