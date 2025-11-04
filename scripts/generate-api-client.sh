#!/bin/bash

# Generate TypeScript API client from OpenAPI spec
if [ ! -f "./openapi.json" ]; then
  echo "❌ openapi.json not found. Please run 'npm run generate:openapi' first."
  exit 1
fi

echo "🔄 Generating TypeScript API client..."
npx openapi-typescript-codegen \
  --input ./openapi.json \
  --output ./src/ui/api \
  --client axios \
  --useOptions \
  --useUnionTypes

echo "✅ API client generated successfully at ./src/ui/api"

