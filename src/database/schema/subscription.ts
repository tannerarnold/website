import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const subscriptions = sqliteTable('subscriptions', {
  id: integer().primaryKey(),
  email: text().notNull(),
  status: text({ enum: ['subscribed', 'unsubscribed'] }).default('subscribed'),
  unsubscribe_reason: text(),
});

type Subscription = typeof subscriptions.$inferSelect;

export { subscriptions };
export type { Subscription };
