import { OpenAPI } from "./index";

/**
 * Configure the OpenAPI client for use in the React application
 */
export function configureApiClient() {
  // Use relative URLs to leverage Vite proxy in development
  // This avoids CORS issues and direct Docker connectivity problems
  // In production, set VITE_API_URL to the full API URL
  const apiUrl = import.meta.env.VITE_API_URL;

  if (apiUrl) {
    // If VITE_API_URL is set, use it (for production)
    OpenAPI.BASE = apiUrl;
  } else {
    // In development, use relative URL to leverage Vite proxy
    // The proxy will forward /api requests to http://localhost:8080
    OpenAPI.BASE = "";
  }

  // Enable credentials for cookie-based authentication
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = "include";
}

// Auto-configure when this module is imported
configureApiClient();
