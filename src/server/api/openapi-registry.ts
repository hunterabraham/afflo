import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

interface RouteDefinition {
  path: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  summary: string;
  tags: string[];
  operationId?: string;
  requestBody?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  responses: {
    [statusCode: number]: {
      schema: z.ZodTypeAny;
      description?: string;
    };
  };
  security?: boolean;
}

const routes: RouteDefinition[] = [];

/**
 * Register a route with OpenAPI metadata
 */
export function createRoute(
  path: string,
  method: "get" | "post" | "put" | "delete" | "patch",
  config: {
    summary: string;
    tags: string[];
    operationId?: string;
    requestBody?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    responses: {
      [statusCode: number]: {
        schema: z.ZodTypeAny;
        description?: string;
      };
    };
    security?: boolean;
  }
) {
  routes.push({
    path,
    method,
    ...config,
  });
}

/**
 * Generate OpenAPI spec document from registered routes
 */
export function generateOpenAPISpec() {
  const paths: Record<string, any> = {};

  for (const route of routes) {
    const pathKey = route.path.replace(/{([^}]+)}/g, "{$1}");
    
    if (!paths[pathKey]) {
      paths[pathKey] = {};
    }

    const pathItem: any = {
      summary: route.summary,
      tags: route.tags,
      responses: {},
    };

    // Add operationId if provided
    if (route.operationId) {
      pathItem.operationId = route.operationId;
    }

    // Add request body
    if (route.requestBody) {
      pathItem.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: zodToJsonSchema(route.requestBody, { target: "openApi3" }),
          },
        },
      };
    }

    // Add parameters
    if (route.params) {
      const paramSchema = zodToJsonSchema(route.params, { target: "openApi3" }) as any;
      const properties = paramSchema.properties || {};
      pathItem.parameters = Object.keys(properties).map((key) => ({
        name: key,
        in: "path",
        required: true,
        schema: properties[key],
        description: properties[key]?.description,
      }));
    }

    if (route.query) {
      const querySchema = zodToJsonSchema(route.query, { target: "openApi3" }) as any;
      const properties = querySchema.properties || {};
      const required = querySchema.required || [];
      const queryParams = Object.keys(properties).map((key) => ({
        name: key,
        in: "query",
        required: required.includes(key),
        schema: properties[key],
        description: properties[key]?.description,
      }));
      pathItem.parameters = [...(pathItem.parameters || []), ...queryParams];
    }

    // Add responses
    for (const [status, response] of Object.entries(route.responses)) {
      pathItem.responses[status] = {
        description: response.description || `Response ${status}`,
        content: {
          "application/json": {
            schema: zodToJsonSchema(response.schema, { target: "openApi3" }),
          },
        },
      };
    }

    // Add security
    if (route.security) {
      pathItem.security = [{ cookieAuth: [] }];
    }

    paths[pathKey][route.method] = pathItem;
  }

  return {
    openapi: "3.0.0",
    info: {
      title: "Afflo API",
      version: "1.0.0",
      description: "API documentation for Afflo application",
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "next-auth.session-token",
          description: "Session cookie from NextAuth",
        },
      },
    },
    paths,
  };
}
