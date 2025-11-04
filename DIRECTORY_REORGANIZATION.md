# Directory Reorganization Summary

The codebase has been reorganized to separate frontend code from server code.

## New Structure

```
src/
├── ui/                    # All frontend/client-side code
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── trpc/              # tRPC client-side code
│   ├── hooks/             # React hooks
│   ├── lib/               # Frontend utilities
│   ├── styles/            # CSS/styling files
│   ├── _components/       # Shared component utilities
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # React entry point
│   └── vite-env.d.ts      # Vite type definitions
├── server/                # All server/backend code (unchanged)
│   ├── api/               # tRPC routers and routes
│   ├── auth/              # Authentication
│   ├── db/                # Database
│   └── helpers/           # Server helpers
├── env.js                 # Environment variables (shared)
└── server.ts              # Express server entry point
```

## Path Aliases

- `~` points to `src/`
- `@` points to `src/ui/` (alternative alias)

## Import Paths

### Frontend Code (src/ui/)

- Use `~/ui/components/...` for components
- Use `~/ui/pages/...` for pages
- Use `~/ui/lib/...` for utilities
- Use `~/ui/hooks/...` for hooks
- Use `~/ui/trpc/...` for tRPC client code

### Server Code (src/server/)

- Use `~/server/api/...` for API code
- Use `~/server/auth/...` for auth code
- Use `~/server/db/...` for database code

## Changes Made

1. **Moved all frontend files** from `src/` to `src/ui/`:
   - `pages/` → `ui/pages/`
   - `components/` → `ui/components/`
   - `trpc/` → `ui/trpc/`
   - `hooks/` → `ui/hooks/`
   - `lib/` → `ui/lib/`
   - `styles/` → `ui/styles/`
   - `App.tsx` → `ui/App.tsx`
   - `main.tsx` → `ui/main.tsx`

2. **Updated all import paths**:
   - Changed `~/components/...` → `~/ui/components/...`
   - Changed `~/pages/...` → `~/ui/pages/...`
   - Changed `~/trpc/...` → `~/ui/trpc/...`
   - Changed `~/lib/...` → `~/ui/lib/...`
   - Changed `~/hooks/...` → `~/ui/hooks/...`
   - Server imports remain `~/server/...`

3. **Updated configuration files**:
   - `vite.config.ts` - Added `@` alias for `src/ui`
   - `tsconfig.json` - Updated include path for vite-env.d.ts
   - `components.json` - Updated all aliases to use `~/ui/...`
   - `index.html` - Updated entry point to `src/ui/main.tsx`

4. **Cleaned up**:
   - Removed duplicate/leftover files from old structure
   - Removed old Next.js `src/app/` API routes (no longer needed in React app)

## Notes

- Server code structure remains unchanged
- All server imports continue to work with `~/server/...`
- Frontend code now uses `~/ui/...` prefix for clarity
- The `app/` directory may still contain some old Next.js files that can be cleaned up later if not needed

## Verification

To verify the reorganization:

1. Check that all imports use the new paths (`~/ui/...` for frontend)
2. Ensure server imports still work (`~/server/...`)
3. Run `npm run dev` to test the frontend
4. Run `npm run server:dev` to test the backend
