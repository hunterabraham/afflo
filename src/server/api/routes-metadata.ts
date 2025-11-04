import { z } from "zod";
import { createRoute, generateOpenAPISpec } from "./openapi-registry.js";

// Import schemas from route files
import { signupSchema, setupCompanySchema } from "./routes/auth.js";
import {
  createPartnerSchema,
  getByIdSchema as partnerGetByIdSchema,
} from "./routes/partner.js";
import { createAffiliateSchema } from "./routes/affiliate.js";
import {
  createAffiliateEventSchema,
  getByIdSchema as affiliateEventGetByIdSchema,
} from "./routes/affiliate-event.js";
import { getByUserIdSchema } from "./routes/admin.js";

/**
 * Register all API routes with OpenAPI metadata
 * This extracts schemas from route files and defines response types
 */
export function registerAllRoutes() {
  // Auth routes
  createRoute("/api/auth/signup", "post", {
    summary: "Create a new user account",
    tags: ["auth"],
    requestBody: signupSchema,
    responses: {
      201: {
        schema: z.object({
          message: z.string(),
          user: z.object({
            id: z.string(),
            email: z.string(),
          }),
        }),
        description: "User created successfully",
      },
      400: {
        schema: z.object({
          message: z.string(),
        }),
        description: "User already exists",
      },
    },
  });

  createRoute("/api/auth/setup-company", "post", {
    summary: "Setup company for authenticated user",
    tags: ["auth"],
    security: true,
    requestBody: setupCompanySchema,
    responses: {
      201: {
        schema: z.object({
          message: z.string(),
          partner: z.object({
            id: z.string(),
            name: z.string(),
            domain: z.string(),
          }),
        }),
        description: "Company setup completed successfully",
      },
      400: {
        schema: z.object({
          message: z.string(),
        }),
        description: "User already has a company setup",
      },
      401: {
        schema: z.object({
          message: z.string(),
        }),
        description: "Unauthorized",
      },
    },
  });

  // Partner routes
  createRoute("/api/partner", "post", {
    summary: "Create a new partner",
    tags: ["partner"],
    security: true,
    requestBody: createPartnerSchema,
    responses: {
      200: {
        schema: z.object({
          partner: z.any(),
          success: z.boolean(),
        }),
        description: "Partner created successfully",
      },
    },
  });

  createRoute("/api/partner/{id}", "get", {
    summary: "Get partner by ID",
    tags: ["partner"],
    security: true,
    params: partnerGetByIdSchema,
    responses: {
      200: {
        schema: z.any(),
        description: "Partner found",
      },
      404: {
        schema: z.object({
          message: z.string(),
        }),
        description: "Partner not found",
      },
    },
  });

  createRoute("/api/partner", "get", {
    summary: "Get current user's partner",
    tags: ["partner"],
    security: true,
    responses: {
      200: {
        schema: z.any().nullable(),
        description: "Partner information",
      },
    },
  });

  // Affiliate routes
  createRoute("/api/affiliate", "post", {
    summary: "Create a new affiliate",
    tags: ["affiliate"],
    security: true,
    requestBody: createAffiliateSchema,
    responses: {
      200: {
        schema: z.object({
          affiliate: z.any(),
          success: z.boolean(),
        }),
        description: "Affiliate created successfully",
      },
    },
  });

  createRoute("/api/affiliate/{id}", "get", {
    summary: "Get affiliate by ID",
    tags: ["affiliate"],
    security: true,
    params: z.object({ id: z.string() }),
    responses: {
      200: {
        schema: z.any(),
        description: "Affiliate found",
      },
      404: {
        schema: z.object({
          message: z.string(),
        }),
        description: "Affiliate not found",
      },
    },
  });

  // Affiliate Event routes
  createRoute("/api/affiliate-event", "post", {
    summary: "Create a new affiliate event",
    tags: ["affiliate-event"],
    operationId: "createAffiliateEvent",
    security: true,
    requestBody: createAffiliateEventSchema,
    responses: {
      200: {
        schema: z.object({
          affiliate_events: z.array(z.any()),
          success: z.boolean(),
        }),
        description: "Affiliate event created successfully",
      },
    },
  });

  createRoute("/api/affiliate-event/{id}", "get", {
    summary: "Get affiliate event by ID",
    tags: ["affiliate-event"],
    operationId: "getAffiliateEventById",
    security: true,
    params: affiliateEventGetByIdSchema,
    responses: {
      200: {
        schema: z.any(),
        description: "Affiliate event found",
      },
      404: {
        schema: z.object({
          message: z.string(),
        }),
        description: "Affiliate event not found",
      },
    },
  });

  createRoute("/api/affiliate-event", "get", {
    summary: "Get all affiliate events for current partner",
    tags: ["affiliate-event"],
    operationId: "listAffiliateEvents",
    security: true,
    responses: {
      200: {
        schema: z.array(z.any()),
        description: "List of affiliate events",
      },
    },
  });

  // Admin routes
  createRoute("/api/admin/user/{user_id}", "get", {
    summary: "Get admin by user ID",
    tags: ["admin"],
    security: true,
    params: getByUserIdSchema,
    responses: {
      200: {
        schema: z.any().nullable(),
        description: "Admin information",
      },
    },
  });

  // Health check
  createRoute("/health", "get", {
    summary: "Health check endpoint",
    tags: [],
    responses: {
      200: {
        schema: z.object({
          status: z.string(),
        }),
        description: "Server is healthy",
      },
    },
  });
}

export { generateOpenAPISpec };
