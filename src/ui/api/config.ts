import { OpenAPI } from "./index";

/**
 * Configure the OpenAPI client for use in the React application
 */
export function configureApiClient() {
  // Set the base URL from environment or default to localhost:8080
  // The server runs on port 8080 (configured in docker-server.yml)
  OpenAPI.BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // Enable credentials for cookie-based authentication
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = "include";
}

// Export the API base URL for NextAuth configuration
export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:8080";
};

// Auto-configure when this module is imported
configureApiClient();
