import { Request, Response, NextFunction } from "express";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { admins } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { UnauthorizedError, ForbiddenError } from "./express-error";

export interface ExpressRequest extends Request {
  session?: Awaited<ReturnType<typeof auth>>;
  partner?: any;
}

/**
 * Middleware to load session from NextAuth
 */
export async function loadSession(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    // Create a Request object for NextAuth from Express request
    const url = new URL(req.url, `http://${req.headers.host}`);
    const nextReq = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers as Record<string, string>),
    });

    const session = await auth();
    req.session = session;
    next();
  } catch (error) {
    console.error("Error loading session:", error);
    req.session = null;
    next();
  }
}

/**
 * Middleware to load partner information for authenticated users
 */
export async function loadPartner(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session?.user?.id) {
    return next();
  }

  try {
    const admin = await db.query.admins.findFirst({
      where: eq(admins.user_id, req.session.user.id),
      with: {
        partner: true,
      },
    });

    req.partner = admin?.partner ?? null;
  } catch (error) {
    console.error("Error fetching partner", error);
    req.partner = null;
  }

  next();
}

/**
 * Middleware to require authentication
 */
export function requireAuth(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session?.user) {
    throw new UnauthorizedError();
  }
  next();
}

/**
 * Middleware to require partner (user must be admin of a partner)
 */
export function requirePartner(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.session?.user) {
    throw new UnauthorizedError();
  }
  if (!req.partner) {
    throw new ForbiddenError(
      "You must be an admin of a partner to access this resource",
    );
  }
  next();
}

/**
 * Timing middleware for logging requests
 */
export function timingMiddleware(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();
  const path = req.path;
  const method = req.method;

  // Log the incoming request
  console.log(`[Express] ${method} ${path}`, {
    input: process.env.NODE_ENV === "development" ? req.body : "[HIDDEN]",
    timestamp: new Date().toISOString(),
  });

  // Add artificial delay in dev
  if (process.env.NODE_ENV === "development") {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    setTimeout(() => {
      next();
    }, waitMs);
  } else {
    next();
  }

  // Log response
  res.on("finish", () => {
    const end = Date.now();
    const duration = end - start;
    console.log(`[Express] ${method} ${path} completed`, {
      duration: `${duration}ms`,
      status: res.statusCode,
      timestamp: new Date().toISOString(),
    });
  });
}
