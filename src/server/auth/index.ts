import NextAuth from "next-auth";
import { authConfig } from "./config";

console.log("[NextAuth] Initializing NextAuth...");
console.log("[NextAuth] Config secret present:", !!authConfig.secret);
console.log("[NextAuth] Config secret length:", authConfig.secret?.length || 0);
console.log("[NextAuth] Providers count:", authConfig.providers?.length || 0);
console.log("[NextAuth] NODE_ENV:", process.env.NODE_ENV);

let auth: ReturnType<typeof NextAuth>["auth"];
let handlers: ReturnType<typeof NextAuth>["handlers"];
let signIn: ReturnType<typeof NextAuth>["signIn"];
let signOut: ReturnType<typeof NextAuth>["signOut"];

try {
  const nextAuth = NextAuth(authConfig);
  auth = nextAuth.auth;
  handlers = nextAuth.handlers;
  signIn = nextAuth.signIn;
  signOut = nextAuth.signOut;

  console.log("[NextAuth] NextAuth initialized successfully");
  console.log("[NextAuth] Handlers available:", {
    GET: !!handlers.GET,
    POST: !!handlers.POST,
  });
} catch (error) {
  console.error("[NextAuth] Failed to initialize NextAuth:", error);
  if (error instanceof Error) {
    console.error("[NextAuth] Error stack:", error.stack);
  }
  throw error;
}

export { auth, handlers, signIn, signOut };
