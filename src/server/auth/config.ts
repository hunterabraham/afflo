import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
// Generate a fallback secret for development if AUTH_SECRET is not provided
const getAuthSecret = () => {
  if (env.AUTH_SECRET) {
    return env.AUTH_SECRET;
  }

  if (env.NODE_ENV === "development") {
    // Use a default secret for development (not secure, but allows the app to run)
    const fallbackSecret = "dev-secret-change-in-production-" + Date.now();
    console.warn(
      "⚠️  WARNING: AUTH_SECRET is not set. Using a fallback secret for development.",
    );
    console.warn(
      "⚠️  This is NOT secure for production. Please set AUTH_SECRET in your environment.",
    );
    return fallbackSecret;
  }

  throw new Error(
    "AUTH_SECRET is required in production. Please set it in your environment variables.",
  );
};

export const authConfig = {
  secret: getAuthSecret(),
  session: {
    strategy: "jwt", // Use JWT sessions
  },
  providers: [
    // Only add Google provider if credentials are available
    ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: env.AUTH_GOOGLE_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user) {
          return null;
        }

        // For now, we'll assume password is stored in a separate field
        // You might want to add a password field to your users table
        // or use a separate credentials table
        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password ?? "",
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  // No adapter needed for JWT sessions
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
      },
    }),
    async signIn({ user, account, profile }) {
      // Allow OAuth sign-ins for configured providers
      if (
        account?.provider === "google" &&
        env.AUTH_GOOGLE_ID &&
        env.AUTH_GOOGLE_SECRET
      ) {
        return true;
      }
      if (
        account?.provider === "shopify" &&
        env.AUTH_SHOPIFY_ID &&
        env.AUTH_SHOPIFY_SECRET
      ) {
        return true;
      }

      // Allow credentials sign-ins
      if (account?.provider === "credentials") {
        return true;
      }

      return false;
    },
    async jwt({ token, user, account }) {
      // Persist the user data to the token right after signin
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // We'll handle partner creation through our custom signup flow
      // instead of automatically creating partners
    },
  },
} satisfies NextAuthConfig;
