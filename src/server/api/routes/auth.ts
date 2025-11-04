import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "~/server/db";
import { users, partners, admins } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { type ExpressRequest, requireAuth, loadPartner } from "../middleware";
import { handlers } from "~/server/auth";
import { NextRequest } from "next/server";

const router = Router();

// NextAuth handlers - convert Express req/res to Next.js format
// This needs to be before the other routes
async function handleNextAuth(
  req: Request,
  res: Response,
  next: (error?: any) => void,
) {
  try {
    console.log(`[NextAuth] Handling ${req.method} ${req.path}`);
    console.log(`[NextAuth] Original URL: ${req.url}`);
    console.log(`[NextAuth] Host: ${req.get("host")}`);
    console.log(`[NextAuth] Protocol: ${req.protocol}`);

    // Convert Express request to Next.js format for NextAuth
    // NextAuth expects the full URL including the API prefix
    const protocol = req.protocol || (req.secure ? "https" : "http");
    const host = req.get("host") || "localhost:8080"; // Use server port, not frontend port
    const baseUrl = `${protocol}://${host}`;

    // Construct the full URL - NextAuth routes need the full path
    const fullUrl = req.url.startsWith("/")
      ? `${baseUrl}${req.url}`
      : `${baseUrl}/${req.url}`;

    console.log(`[NextAuth] Constructed URL: ${fullUrl}`);

    let url: URL;
    try {
      url = new URL(fullUrl);
    } catch (urlError) {
      console.error("[NextAuth] URL construction error:", urlError);
      throw new Error(`Failed to construct URL: ${fullUrl} - ${urlError}`);
    }

    // Create a proper Request object
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        headers.set(key, Array.isArray(value) ? value.join(",") : value);
      }
    });

    let body: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      console.log(`[NextAuth] Request body length: ${body.length}`);
    }

    const nextReq = new NextRequest(url, {
      method: req.method,
      headers,
      body,
    });

    console.log(
      `[NextAuth] NextRequest created: ${nextReq.method} ${nextReq.url}`,
    );

    const handler = req.method === "GET" ? handlers.GET : handlers.POST;
    if (!handler) {
      throw new Error(`No handler found for method ${req.method}`);
    }

    console.log(`[NextAuth] Calling handler for ${req.method} ${req.path}`);
    const nextRes = await handler(nextReq);
    console.log(`[NextAuth] Handler returned status ${nextRes.status}`);
    console.log(
      `[NextAuth] Response headers:`,
      Object.fromEntries(nextRes.headers.entries()),
    );

    // Convert Next.js response to Express
    res.status(nextRes.status);
    nextRes.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    const text = await nextRes.text();
    console.log(`[NextAuth] Response body length: ${text.length}`);
    res.send(text);
  } catch (error) {
    console.error("=".repeat(80));
    console.error("[NextAuth] Handler error:", new Date().toISOString());
    console.error("Method:", req.method);
    console.error("Path:", req.path);
    console.error("URL:", req.url);
    console.error("Headers:", req.headers);
    console.error("Error:", error);
    if (error instanceof Error) {
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
      if (error.cause) {
        console.error("Error Cause:", error.cause);
      }
    }
    console.error("=".repeat(80));
    // Pass to error handler middleware
    next(error);
  }
}

// Handle NextAuth routes
router.all("/callback/*", handleNextAuth);
router.all("/signin/*", handleNextAuth);
router.all("/signout/*", handleNextAuth);
router.all("/session", handleNextAuth);
router.all("/csrf", handleNextAuth);
router.all("/providers", handleNextAuth);

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const setupCompanySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  domain: z.string().min(1, "Domain is required"),
  shopifySecret: z.string().optional(),
});

router.post("/signup", async (req: Request, res: Response, next) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser[0]?.id, email: newUser[0]?.email },
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/setup-company",
  loadPartner,
  requireAuth,
  async (req: ExpressRequest, res: Response, next) => {
    try {
      if (!req.session?.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { companyName, domain, shopifySecret } = setupCompanySchema.parse(
        req.body,
      );

      // Check if user already has a partner
      const existingAdmin = await db.query.admins.findFirst({
        where: (admins, { eq }) => eq(admins.user_id, req.session!.user!.id),
      });

      if (existingAdmin) {
        return res.status(400).json({
          message: "User already has a company setup",
        });
      }

      // Create the partner
      const newPartner = await db
        .insert(partners)
        .values({
          name: companyName,
          domain,
          shopify_secret: shopifySecret || "",
        })
        .returning();

      if (!newPartner[0]) {
        throw new Error("Failed to create partner");
      }

      // Create admin relationship
      await db.insert(admins).values({
        user_id: req.session.user.id,
        partner_id: newPartner[0].id,
      });

      res.status(201).json({
        message: "Company setup completed successfully",
        partner: {
          id: newPartner[0].id,
          name: newPartner[0].name,
          domain: newPartner[0].domain,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
