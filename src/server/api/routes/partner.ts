import { Router } from "express";
import { z } from "zod";
import { partners } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../express-error";
import { ExpressRequest, requireAuth, loadPartner } from "../middleware";
import { db } from "~/server/db";

const router = Router();

// Apply middleware to all routes
router.use(loadPartner);
router.use(requireAuth);

const createPartnerSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  shopify_secret: z.string().min(1),
});

const getByIdSchema = z.object({
  id: z.string(),
});

// POST /api/partner
router.post("/", async (req: ExpressRequest, res, next) => {
  try {
    const input = createPartnerSchema.parse(req.body);
    const [partner] = await db
      .insert(partners)
      .values({
        name: input.name,
        domain: input.domain,
        shopify_secret: input.shopify_secret,
      })
      .returning();

    res.json({
      partner,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/partner/:id
router.get("/:id", async (req: ExpressRequest, res, next) => {
  try {
    const input = getByIdSchema.parse({ id: req.params.id });
    const partner = await db.query.partners.findFirst({
      where: eq(partners.id, input.id),
    });

    if (!partner) {
      throw new NotFoundError("Partner not found");
    }

    res.json(partner);
  } catch (error) {
    next(error);
  }
});

// GET /api/partner
router.get("/", async (req: ExpressRequest, res, next) => {
  try {
    // Partner is automatically loaded in context for authenticated users
    res.json(req.partner);
  } catch (error) {
    next(error);
  }
});

export default router;
