# API Client

This directory contains the auto-generated TypeScript API client based on the OpenAPI specification.

## Usage

The API client is automatically configured when the app loads. You can import and use the services directly:

```typescript
import { AuthService, PartnerService } from "~/ui/api";

// Example: Sign up a new user
const response = await AuthService.postApiAuthSignup({
  requestBody: {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
});

// Example: Get current partner
const partner = await PartnerService.getApiPartner();

// Example: Create an affiliate event
const event = await AffiliateEventService.postApiAffiliateEvent({
  requestBody: {
    type: "click",
    data: { url: "https://example.com" },
    affiliate_id: "affiliate-id",
  },
});
```

## Regenerating the API Client

When you make changes to your Express routes and add/update JSDoc comments, regenerate the API client:

```bash
npm run generate:types
```

This command will:
1. Generate the OpenAPI spec from your route files
2. Generate the TypeScript client from the OpenAPI spec

## Configuration

The API client is configured in `config.ts`. You can customize the base URL by setting the `VITE_API_URL` environment variable.

## Services

- `AuthService` - Authentication endpoints
- `PartnerService` - Partner management
- `AffiliateService` - Affiliate management
- `AffiliateEventService` - Affiliate event tracking
- `AdminService` - Admin operations
- `DefaultService` - Default/health endpoints

