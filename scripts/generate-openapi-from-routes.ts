import { writeFileSync } from "fs";
import { registerAllRoutes, generateOpenAPISpec } from "../src/server/api/routes-metadata.js";

const outputPath = "./openapi.json";

try {
  // Register all routes
  registerAllRoutes();
  
  // Generate the OpenAPI spec
  const spec = generateOpenAPISpec();
  
  // Write to file
  writeFileSync(outputPath, JSON.stringify(spec, null, 2), "utf-8");
  console.log(`✅ OpenAPI spec generated successfully at ${outputPath}`);
} catch (error) {
  console.error("❌ Error generating OpenAPI spec:", error);
  process.exit(1);
}
