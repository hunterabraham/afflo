# Migration from Next.js to React Router

This document summarizes the conversion of the application from Next.js to a standard React app with React Router.

## Major Changes

### 1. Build System

- **Removed**: Next.js build system
- **Added**: Vite as the build tool
- **New files**:
  - `vite.config.ts` - Vite configuration
  - `index.html` - HTML entry point
  - `src/main.tsx` - React application entry point
  - `src/App.tsx` - Main app component with React Router setup

### 2. Routing

- **Removed**: Next.js App Router (`src/app/` directory structure)
- **Added**: React Router v7
- **New structure**:
  - `src/pages/` - All page components
  - Routes are defined in `src/App.tsx` using React Router's `<Routes>` and `<Route>`

### 3. Pages Converted

All Next.js pages have been converted to React components:

- `src/pages/HomePage.tsx` - Home/root page with redirect logic
- `src/pages/LoginPage.tsx` - Authentication page
- `src/pages/SetupCompanyPage.tsx` - Company setup page
- `src/pages/DashboardPage.tsx` - Main dashboard (was server component, now client)
- `src/pages/SettingsPage.tsx` - Settings page (was server component, now client)

### 4. Authentication

- **Changed**: Server-side auth checks converted to client-side using `useSession()` hook
- **Added**: `src/components/ProtectedRoute.tsx` - Component to protect routes (replaces Next.js middleware)
- **Updated**: All protected routes now use the `<ProtectedRoute>` wrapper

### 5. Navigation

- **Removed**: `next/link` and `next/navigation`
- **Added**: `react-router-dom` `Link` and `useNavigate` hook
- **Updated components**:
  - `src/components/nav-main.tsx`
  - `src/components/nav-secondary.tsx`
  - `src/components/nav-documents.tsx`
  - `src/components/app-sidebar.tsx`

### 6. Server Components → Client Components

- All Next.js server components have been converted to client components
- Server-side `auth()` calls replaced with client-side `useSession()` from next-auth/react
- Server Actions removed (sign out now uses onClick handler)

### 7. Removed Next.js Specific Code

- Removed all `"use client"` directives (not needed in React)
- Removed `next/font/google` (Geist font) - now using system fonts
- Removed Next.js metadata exports
- Removed Next.js middleware (`src/middleware.ts`)

### 8. Configuration Files

- **Deleted**:
  - `next.config.js`
  - `next-env.d.ts`
  - `src/middleware.ts`
- **Updated**:
  - `package.json` - Removed Next.js dependencies, added Vite and React Router
  - `tsconfig.json` - Updated for React (removed Next.js plugin, updated JSX)
  - `src/styles/globals.css` - Removed Geist font variable

### 9. API & Backend

- **Unchanged**: The Express backend (`src/server.ts`) remains the same
- **Unchanged**: tRPC setup continues to work
- **Updated**: tRPC client now uses Vite environment variables (`VITE_API_URL`)
- **Note**: NextAuth API routes (`/api/auth/[...nextauth]`) are still handled by the Express backend

### 10. Environment Variables

- Vite uses `VITE_` prefix for client-side environment variables
- Add `VITE_API_URL` to `.env` if your API runs on a different URL
- Default API URL: `http://localhost:3001` (for development)

## New Project Structure

```
src/
├── App.tsx                 # Main app with routes
├── main.tsx                # React entry point
├── pages/                  # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── SetupCompanyPage.tsx
│   ├── DashboardPage.tsx
│   └── SettingsPage.tsx
├── components/
│   ├── ProtectedRoute.tsx  # Route protection
│   └── ... (other components)
├── server/                 # Backend (unchanged)
└── styles/
    └── globals.css
```

## Development Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run development server**:

   ```bash
   npm run dev          # Frontend (Vite on port 3000)
   npm run server:dev   # Backend (Express on port 3001)
   ```

3. **Build for production**:
   ```bash
   npm run build        # Builds to dist/
   npm run preview      # Preview production build
   ```

## Important Notes

### Authentication

- NextAuth continues to work but sessions are now client-side only
- The Express backend still handles NextAuth API routes
- Session management is handled via `next-auth/react` on the client

### API Routes

- All API routes (`/api/*`) are proxied to the Express backend during development (configured in `vite.config.ts`)
- In production, ensure your Express server is running and update `VITE_API_URL` if needed

### Route Protection

- Routes are protected using the `<ProtectedRoute>` component
- This replaces Next.js middleware functionality
- Unauthenticated users are redirected to `/auth/login` with a `callbackUrl` query parameter

### Navigation

- Use React Router's `Link` component for internal navigation
- Use `useNavigate()` hook for programmatic navigation
- Replace `next/navigation`'s `redirect()` with `navigate()`

## Migration Checklist

- [x] Convert all pages to React components
- [x] Set up React Router
- [x] Convert server components to client components
- [x] Update navigation components
- [x] Set up Vite build system
- [x] Update authentication flow
- [x] Remove Next.js specific code
- [x] Update TypeScript configuration
- [ ] Test all routes
- [ ] Test authentication flow
- [ ] Test API calls
- [ ] Update Docker configuration if needed
- [ ] Update deployment configuration

## Troubleshooting

### Port Conflicts

- Frontend runs on port 3000 (Vite default)
- Backend runs on port 3001 (configured in `src/server.ts`)
- Update vite.config.ts proxy target if backend port is different

### Environment Variables

- Client-side env vars must start with `VITE_`
- Server-side env vars remain unchanged (no prefix)

### Build Issues

- Make sure to run `npm install` after the migration
- Clear `node_modules` and reinstall if you encounter issues
