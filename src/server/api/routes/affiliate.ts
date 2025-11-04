import { Router } from "express";
import { z } from "zod";
import { affiliates } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../express-error";
import { type ExpressRequest, requireAuth, loadPartner } from "../middleware";
import { db } from "~/server/db";

const router = Router();

// Apply middleware to all routes
router.use(loadPartner);
router.use(requireAuth);

const createAffiliateSchema = z.object({
  user_id: z.string().min(1),
});

const getByIdSchema = z.object({
  id: z.string(),
});

// POST /api/affiliate
router.post("/", async (req: ExpressRequest, res, next) => {
  try {
    const input = createAffiliateSchema.parse(req.body);
    const [affiliate] = await db
      .insert(affiliates)
      .values({
        user_id: input.user_id,
      })
      .returning();

    res.json({
      affiliate,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/affiliate/:id
router.get("/:id", async (req: ExpressRequest, res, next) => {
  try {
    const input = getByIdSchema.parse({ id: req.params.id });
    const affiliate = await db.query.affiliates.findFirst({
      where: eq(affiliates.id, input.id),
    });

    if (!affiliate) {
      throw new NotFoundError("Affiliate not found");
    }

    res.json(affiliate);
  } catch (error) {
    next(error);
  }
});

export default router;
