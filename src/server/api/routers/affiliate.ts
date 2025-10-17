import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { partners } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NotFoundError } from "~/server/api/error";

export const partnerRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        domain: z.string().min(1),
        shopify_secret: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [partner] = await ctx.db
        .insert(partners)
        .values({
          name: input.name,
          domain: input.domain,
          shopify_secret: input.shopify_secret,
        })
        .returning();

      return {
        partner,
        success: true,
      };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const partner = await ctx.db.query.partners.findFirst({
        where: eq(partners.id, input.id),
      });

      if (!partner) {
        throw new NotFoundError("Partner not found");
      }

      return partner ?? null;
    }),
});
