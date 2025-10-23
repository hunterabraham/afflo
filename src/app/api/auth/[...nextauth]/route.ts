import { handlers } from "~/server/auth";

export const { GET, POST } = handlers;

// Force Node.js runtime for NextAuth API routes
export const runtime = "nodejs";
