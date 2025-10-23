# Authentication Setup Guide

This project includes a comprehensive authentication system with multiple sign-in options and company setup flow.

## Features

- **Multiple Authentication Methods**:
  - Google OAuth
  - Shopify OAuth (configurable)
  - Username/Password (Credentials)

- **Company Setup Flow**:
  - New users are prompted to create a company/partner entry
  - Required information: Company name, domain, optional Shopify secret
  - Automatic admin role assignment

- **Route Protection**:
  - Middleware protects authenticated routes
  - Automatic redirects based on authentication status
  - Company setup completion check

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database (Required)
DATABASE_URL="postgresql://username:password@localhost:5432/afflo"

# NextAuth.js (Optional - only required if you want OAuth)
AUTH_SECRET="your-secret-key-here"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Shopify OAuth (Optional)
AUTH_SHOPIFY_ID="your-shopify-client-id"
AUTH_SHOPIFY_SECRET="your-shopify-client-secret"

# Environment
NODE_ENV="development"
```

**Note**: OAuth credentials are optional. If not provided, only username/password authentication will be available.

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### Shopify OAuth

1. Create a Shopify app in your partner dashboard
2. Configure OAuth settings
3. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/shopify` (development)
   - `https://yourdomain.com/api/auth/callback/shopify` (production)

## Database Schema

The authentication system uses the following tables:

- `users` - User accounts
- `accounts` - OAuth account links
- `sessions` - User sessions
- `verification_tokens` - Email verification
- `partners` - Company/partner entities
- `admins` - User-partner admin relationships

## Usage

### Sign Up Flow

1. User visits `/auth/login`
2. Chooses sign-up tab
3. Enters credentials or uses OAuth
4. Redirected to `/auth/setup-company`
5. Completes company information
6. Redirected to `/dashboard`

### Sign In Flow

1. User visits `/auth/login`
2. Enters credentials or uses OAuth
3. Redirected to `/dashboard` (or company setup if incomplete)

## API Endpoints

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/setup-company` - Complete company setup
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers

## Components

- `LoginPage` - Main authentication page with tabs for sign in/up
- `SetupCompanyPage` - Company information form
- `Providers` - Session and toast providers wrapper
- `DashboardPage` - Protected dashboard with sign-out functionality

## Security Features

- Password hashing with bcrypt
- CSRF protection via NextAuth.js
- Route protection middleware
- Input validation with Zod
- Secure session management
