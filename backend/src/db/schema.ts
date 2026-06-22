import { sql } from "drizzle-orm";
import {
  index,
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

export const productsTable = pgTable(
  "products",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    price: integer().notNull(),
    category_id: integer()
      .references(() => categoriesTable.id)
      .notNull(),
    updated_at: timestamp({ precision: 3 })
      .default(sql`now()`)
      .notNull(),
    created_at: timestamp({ precision: 3 })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    index("products_feed_idx").on(table.updated_at, table.id),

    index("products_category_feed_idx").on(
      table.category_id,
      table.updated_at,
      table.id,
    ),
  ],
);
