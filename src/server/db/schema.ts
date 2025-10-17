import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `afflo_${name}`);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
  updated_at: d
    .timestamp({ mode: "date", withTimezone: false })
    .$onUpdate(() => new Date())
    .notNull(),
  created_at: d
    .timestamp({ mode: "date", withTimezone: false })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  deleted_at: d.timestamp({ mode: "date", withTimezone: false }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
    updated_at: d
      .timestamp({ mode: "date", withTimezone: false })
      .$onUpdate(() => new Date())
      .notNull(),
    created_at: d
      .timestamp({ mode: "date", withTimezone: false })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deleted_at: d.timestamp({ mode: "date", withTimezone: false }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

/**
 * Partners are the entities that we partner with. They are the companies
 * that use our platform to manage their affiliates.
 */
export const partners = createTable("partner", (d) => ({
  id: d
    .varchar({ length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull(),
  domain: d.varchar({ length: 255 }).notNull(),
  shopify_secret: d.varchar({ length: 1024 }).notNull(),
  updated_at: d
    .timestamp({ mode: "date", withTimezone: false })
    .$onUpdate(() => new Date())
    .notNull(),
  created_at: d
    .timestamp({ mode: "date", withTimezone: false })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  deleted_at: d.timestamp({ mode: "date", withTimezone: false }),
}));

export const partnersRelations = relations(partners, ({ many }) => ({
  affiliatesToPartners: many(affiliatesToPartners),
}));

/**
 * Affiliates are the people who sell product for a partner. They are
 * explicitly NOT linked to a partner because they could sell with multiple.
 * We scope events and all surrounding data to a partner, however.
 */
export const affiliates = createTable("affiliate", (d) => ({
  id: d
    .varchar({ length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user_id: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  updated_at: d
    .timestamp({ mode: "date", withTimezone: false })
    .$onUpdate(() => new Date())
    .notNull(),
  created_at: d
    .timestamp({ mode: "date", withTimezone: false })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  deleted_at: d.timestamp({ mode: "date", withTimezone: false }),
}));

export const affiliatesRelations = relations(affiliates, ({ one, many }) => ({
  user: one(users, { fields: [affiliates.user_id], references: [users.id] }),
  affiliatesToPartners: many(affiliatesToPartners),
}));

/**
 * Junction table for the many-to-many relationship between affiliates and partners.
 * This allows affiliates to work with multiple partners and partners to have multiple affiliates.
 */
export const affiliatesToPartners = createTable(
  "affiliate_to_partner",
  (d) => ({
    affiliate_id: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => affiliates.id),
    partner_id: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => partners.id),
    created_at: d
      .timestamp({ mode: "date", withTimezone: false })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: d
      .timestamp({ mode: "date", withTimezone: false })
      .$onUpdate(() => new Date())
      .notNull(),
    deleted_at: d.timestamp({ mode: "date", withTimezone: false }),
  }),
  (t) => [
    primaryKey({ columns: [t.affiliate_id, t.partner_id] }),
    index("affiliate_to_partner_affiliate_idx").on(t.affiliate_id),
    index("affiliate_to_partner_partner_idx").on(t.partner_id),
  ],
);

export const affiliatesToPartnersRelations = relations(
  affiliatesToPartners,
  ({ one }) => ({
    affiliate: one(affiliates, {
      fields: [affiliatesToPartners.affiliate_id],
      references: [affiliates.id],
    }),
    partner: one(partners, {
      fields: [affiliatesToPartners.partner_id],
      references: [partners.id],
    }),
  }),
);

/**
 * Affiliate events are a generic way of recording arbitrary events about an affiliate.
 * For example, you might want to record an event when an affiliate makes a sale,
 * we seed an affiliate with product, or they make a post. This creates a ledger
 * of all affiliate events. Affiliate events should be CREATE ONLY. We may
 * want to accumulate data over time and query it from incremental materializations.
 */
export const affiliate_events = createTable("affiliate_event", (d) => ({
  id: d
    .varchar({ length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  affiliate_id: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => affiliates.id),
  partner_id: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => partners.id),
  type: d.varchar({ length: 255 }).notNull(),
  data: d.jsonb().notNull(),
  created_at: d
    .timestamp({ mode: "date", withTimezone: false })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: d
    .timestamp({ mode: "date", withTimezone: false })
    .$onUpdate(() => new Date())
    .notNull(),
  deleted_at: d.timestamp({ mode: "date", withTimezone: false }),
}));

export const affiliate_eventsRelations = relations(
  affiliate_events,
  ({ one }) => ({
    affiliate: one(affiliates, {
      fields: [affiliate_events.affiliate_id],
      references: [affiliates.id],
    }),
    partner: one(partners, {
      fields: [affiliate_events.partner_id],
      references: [partners.id],
    }),
  }),
);
