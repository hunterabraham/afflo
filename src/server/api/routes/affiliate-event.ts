import { Router } from "express";
import { z } from "zod";
import { affiliate_events } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../express-error";
import {
  type ExpressRequest,
  requireAuth,
  requirePartner,
  loadPartner,
} from "../middleware";
import { db } from "~/server/db";

const router = Router();

// Apply middleware to all routes
router.use(loadPartner);

export const createAffiliateEventSchema = z.object({
  type: z.string().min(1),
  data: z.any(),
  affiliate_id: z.string().min(1),
});

export const getByIdSchema = z.object({
  id: z.string(),
});

router.post(
  "/",
  requireAuth,
  requirePartner,
  async (req: ExpressRequest, res, next) => {
    try {
      const input = createAffiliateEventSchema.parse(req.body);
      const [affiliate_event] = await db
        .insert(affiliate_events)
        .values({
          type: input.type,
          data: input.data,
          affiliate_id: input.affiliate_id,
          partner_id: req.partner!.id,
        })
        .returning();

      res.json({
        affiliate_event,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get("/:id", requireAuth, async (req: ExpressRequest, res, next) => {
  try {
    const input = getByIdSchema.parse({ id: req.params.id });
    const affiliate_event = await db.query.affiliate_events.findFirst({
      where: eq(affiliate_events.id, input.id),
    });

    if (!affiliate_event) {
      throw new NotFoundError("Affiliate event not found");
    }

    res.json(affiliate_event);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/",
  requireAuth,
  requirePartner,
  async (req: ExpressRequest, res, next) => {
    try {
      const events = await db.query.affiliate_events.findMany({
        where: eq(affiliate_events.partner_id, req.partner!.id),
        with: {
          affiliate: true,
        },
      });

      res.json(events ?? null);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
