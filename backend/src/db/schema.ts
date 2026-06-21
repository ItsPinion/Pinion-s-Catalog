import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  PgUpdateBase,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  created_at: timestamp().default(sql`now()`),
});

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  price: integer().notNull(),
  category_id: integer().references(() => categoriesTable.id),
  created_at: timestamp().default(sql`now()`),
  updated_at: timestamp().default(sql`now()`),
});
