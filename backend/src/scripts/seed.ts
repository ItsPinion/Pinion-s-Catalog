import { nanoid } from "nanoid";
import { db } from "../db";
import { categoriesTable, productsTable } from "../db/schema";

export const createProducts = async (numberOfProducts: number) => {
  const categories = await db.select().from(categoriesTable);
  console.log(categories);
  if (categories.length === 0) {
    return;
  }

  const batchSize = 1000;
  const totalBatches = Math.ceil(numberOfProducts / batchSize);

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const start = batchIndex * batchSize;
    const end = Math.min(start + batchSize, numberOfProducts);
    const batchCount = end - start;

    const products: {
      name: string;
      description: string;
      category_id: number;
      price: number;
    }[] = [];

    for (let i = 0; i < batchCount; i++) {
      const name = nanoid(10);
      products.push({
        name: `${name}`,
        description: `Description of ${name}`,
        category_id:
          categories[Math.floor(Math.random() * categories.length)].id,
        price: 100,
      });
    }
    await db.insert(productsTable).values(products);
    console.log(
      `Batch ${batchIndex + 1}/${totalBatches} inserted ${batchCount} products`,
    );
  }
};

// createProducts(200_000);

const createCategories = async (numberOfCategories: number) => {
  const categories: {
    name: string;
  }[] = [];

  for (let i = 0; i < numberOfCategories; i++) {
    categories.push({
      name: nanoid(10),
    });
  }

  const category = await db
    .insert(categoriesTable)
    .values(categories)
    .returning();

  console.log(category);
  return category;
};
// createCategories(100);
