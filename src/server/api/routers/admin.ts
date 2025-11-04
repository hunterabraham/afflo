import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { admins } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const adminRouter = createTRPCRouter({
  getByUserId: protectedProcedure
    .input(
      z.object({
        user_id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const admin = await ctx.db.query.admins.findFirst({
        where: eq(admins.user_id, input.user_id),
        with: {
          partner: true,
        },
      });

      return admin ?? null;
    }),
});
