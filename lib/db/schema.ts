import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  piUid: text('pi_uid').unique().notNull(),
  username: text('username').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  piUid: text('pi_uid').notNull(),
  amount: integer('amount').notNull(),
  status: text('status').notNull(), // 'pending', 'completed', 'failed'
  transactionId: text('transaction_id').unique(),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

export const farmingData = pgTable('farming_data', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  soilMoisture: integer('soil_moisture'),
  temperature: integer('temperature'),
  humidity: integer('humidity'),
  timestamp: timestamp('timestamp').defaultNow(),
});
