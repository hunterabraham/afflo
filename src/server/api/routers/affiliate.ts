import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { affiliates } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NotFoundError } from "~/server/api/error";

export const affiliateRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        user_id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [affiliate] = await ctx.db
        .insert(affiliates)
        .values({
          user_id: input.user_id,
        })
        .returning();

      return {
        affiliate,
        success: true,
      };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const affiliate = await ctx.db.query.affiliates.findFirst({
        where: eq(affiliates.id, input.id),
      });

      if (!affiliate) {
        throw new NotFoundError("Affiliate not found");
      }

      return affiliate ?? null;
    }),
});
