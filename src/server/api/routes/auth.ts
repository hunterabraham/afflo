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
async function handleNextAuth(req: Request, res: Response) {
  try {
    // Convert Express request to Next.js format for NextAuth
    const protocol = req.protocol || (req.secure ? "https" : "http");
    const host = req.get("host") || "localhost:3000";
    const url = new URL(req.url, `${protocol}://${host}`);

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
    }

    const nextReq = new NextRequest(url, {
      method: req.method,
      headers,
      body,
    });

    const handler = req.method === "GET" ? handlers.GET : handlers.POST;
    const nextRes = await handler(nextReq);

    // Convert Next.js response to Express
    res.status(nextRes.status);
    nextRes.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    const text = await nextRes.text();
    res.send(text);
  } catch (error) {
    console.error("NextAuth handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Handle NextAuth routes
router.all("/callback/*", handleNextAuth);
router.all("/signin/*", handleNextAuth);
router.all("/signout/*", handleNextAuth);
router.all("/session", handleNextAuth);
router.all("/csrf", handleNextAuth);
router.all("/providers", handleNextAuth);

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const setupCompanySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  domain: z.string().min(1, "Domain is required"),
  shopifySecret: z.string().optional(),
});

// POST /api/auth/signup
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

// POST /api/auth/setup-company
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
