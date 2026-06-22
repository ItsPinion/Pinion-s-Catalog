import { eq } from "drizzle-orm";
import { db } from "../db";
import { categoriesTable, productsTable } from "../db/schema";

export const findAll = async () => {
  return await db.select().from(categoriesTable).orderBy(categoriesTable.id);
};

export const create = async (data: { name: string }) => {
  const [category] = await db.insert(categoriesTable).values(data).returning();

  return category;
};

export const findById = async (id: number) => {
  console.log(id);
  const [category] = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, id));

  return category;
};

export const update = async (data: { name: string }, id: number) => {
  const [category] = await db
    .update(categoriesTable)
    .set({ ...data })
    .where(eq(categoriesTable.id, id))
    .returning();

  return category;
};

export const removeProductCategory = async (id: number) => {
  const category = await db
    .delete(productsTable)
    .where(eq(productsTable.category_id, id))
    .returning();

  return category;
};

export const remove = async (id: number) => {
  const [category] = await db
    .delete(categoriesTable)
    .where(eq(categoriesTable.id, id))
    .returning();

  return category;
};
