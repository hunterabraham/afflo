import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { affiliate_events } from "~/server/db/schema";

export async function fetchAffiliateEvents(partnerId: string) {
  return db.query.affiliate_events.findMany({
    where: eq(affiliate_events.partner_id, partnerId),
    with: {
      affiliate: true,
    },
  });
}
