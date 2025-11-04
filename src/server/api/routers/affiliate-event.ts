import { z } from "zod";

import {
  createTRPCRouter,
  partnerProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { affiliate_events } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NotFoundError } from "~/server/api/error";

export const affiliateEventRouter = createTRPCRouter({
  create: partnerProcedure
    .input(
      z.object({
        type: z.string().min(1),
        data: z.any(),
        affiliate_id: z.string().min(1),
        // Add your input fields here
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [affiliate_event] = await ctx.db
        .insert(affiliate_events)
        .values({
          type: input.type,
          data: input.data,
          affiliate_id: input.affiliate_id,
          partner_id: ctx.partner.id,
          // Map your input fields here
        })
        .returning();

      return {
        affiliate_event,
        success: true,
      };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const affiliate_event = await ctx.db.query.affiliate_events.findFirst({
        where: eq(affiliate_events.id, input.id),
      });

      if (!affiliate_event) {
        throw new NotFoundError("Affiliate event not found");
      }

      return affiliate_event ?? null;
    }),
  get: partnerProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.query.affiliate_events.findMany({
      where: eq(affiliate_events.partner_id, ctx.partner.id),
      with: {
        affiliate: true,
      },
    });

    return events ?? null;
  }),
});
