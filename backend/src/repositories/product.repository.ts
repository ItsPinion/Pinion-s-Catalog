// product.repository.ts

import { db } from "../db";
// import { products } from "../db/schema/product";
import { and, desc, eq, gt, lt, or } from "drizzle-orm";
import { productsTable } from "../db/schema";

export const findMany = async (
  limit: number,
  cursorId?: number,
  cursorUpdatedAt?: Date,
) => {
  if (cursorId === undefined || cursorUpdatedAt === undefined) {
    return db
      .select()
      .from(productsTable)
      .orderBy(desc(productsTable.updated_at), desc(productsTable.id))
      .limit(limit);
  }

  return db
    .select()
    .from(productsTable)
    .orderBy(desc(productsTable.updated_at), desc(productsTable.id))
    .where(
      or(
        lt(productsTable.updated_at, cursorUpdatedAt),
        and(
          eq(productsTable.updated_at, cursorUpdatedAt),
          lt(productsTable.id, cursorId),
        ),
      ),
    )
    .limit(limit);
};

export const findById = async (id: number) => {
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));
  console.log(product);

  return product;
};

export const create = async (data: {
  name: string;
  description: string;
  category_id: number;
  price: number;
}) => {
  const [product] = await db.insert(productsTable).values(data).returning();

  return product;
};

export const findByCategoryId = async (
  categoryId: number,
  limit: number,
  cursorId?: number,
  cursorUpdatedAt?: Date,
) => {
  if (cursorId === undefined || cursorUpdatedAt === undefined) {
    return db
      .select()
      .from(productsTable)
      .where(eq(productsTable.category_id, categoryId))
      .orderBy(desc(productsTable.updated_at), desc(productsTable.id))
      .limit(limit);
  }

  return db
    .select()
    .from(productsTable)
    .where(
      and(
        eq(productsTable.category_id, categoryId),
        or(
          lt(productsTable.updated_at, cursorUpdatedAt),
          and(
            eq(productsTable.updated_at, cursorUpdatedAt),
            lt(productsTable.id, cursorId),
          ),
        ),
      ),
    )
    .orderBy(desc(productsTable.updated_at), desc(productsTable.id))
    .limit(limit);
};

export const update = async (
  data: {
    name: string;
    description: string;
    category_id: number;
    price: number;
  },
  id: number,
) => {
  const [product] = await db
    .update(productsTable)
    .set({ ...data, updated_at: new Date() })
    .where(eq(productsTable.id, id))
    .returning();

  return product;
};

export const remove = async (id: number) => {
  const [product] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, id))
    .returning();

  return product;
};
