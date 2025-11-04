import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET:
    process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  AUTH_SHOPIFY_ID: z.string().optional(),
  AUTH_SHOPIFY_SECRET: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
});

function validateEnv() {
  if (process.env.SKIP_ENV_VALIDATION) {
    return process.env;
  }

  const parsed = envSchema.safeParse({
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    AUTH_SHOPIFY_ID: process.env.AUTH_SHOPIFY_ID,
    AUTH_SHOPIFY_SECRET: process.env.AUTH_SHOPIFY_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
  });

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = validateEnv();
