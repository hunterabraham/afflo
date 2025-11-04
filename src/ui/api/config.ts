import { OpenAPI } from "./index";

/**
 * Configure the OpenAPI client for use in the React application
 */
export function configureApiClient() {
  // Set the base URL from environment or default to localhost
  OpenAPI.BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
  
  // Enable credentials for cookie-based authentication
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = "include";
}

// Auto-configure when this module is imported
configureApiClient();

