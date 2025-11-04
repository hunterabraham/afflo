import { Router } from "express";
import { z } from "zod";
import { admins } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { type ExpressRequest, requireAuth, loadPartner } from "../middleware";
import { db } from "~/server/db";

const router = Router();

// Note: loadPartner and requireAuth are applied globally in api/index.ts

export const getByUserIdSchema = z.object({
  user_id: z.string().min(1),
});

router.get("/user/:user_id", async (req: ExpressRequest, res, next) => {
  try {
    const input = getByUserIdSchema.parse({ user_id: req.params.user_id });
    const admin = await db.query.admins.findFirst({
      where: eq(admins.user_id, input.user_id),
      with: {
        partner: true,
      },
    });

    res.json(admin ?? null);
  } catch (error) {
    next(error);
  }
});

export default router;
