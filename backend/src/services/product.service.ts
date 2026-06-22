// product.service.ts

import { ca } from "zod/locales";
import * as productRepo from "../repositories/product.repository";
import { decodeCursor, encodeCursor } from "../utils/encryption.util";

export const getProducts = async (
  cursor: string | undefined,
  limit: number,
) => {
  let cursorId: number | undefined;
  let cursorUpdatedAt: Date | undefined;
  console.log(cursor, limit);

  if (cursor) {
    console.log("");
    const decoded = decodeCursor(cursor);

    cursorId = decoded.id;
    cursorUpdatedAt = decoded.updated_at;

    console.log(cursorId, cursorUpdatedAt);
  }

  const products = await productRepo.findMany(limit, cursorId, cursorUpdatedAt);

  const lastProduct = products.at(-1);

  const nextCursor =
    lastProduct &&
    encodeCursor({
      id: lastProduct.id,
      updated_at: lastProduct.updated_at,
    });

  return {
    products,
    nextCursor,
  };
};

export const getProductById = async (id: number) => {
  return productRepo.findById(id);
};

export const createProduct = async (data: {
  name: string;
  description: string;
  category_id: number;
  price: number;
}) => {
  return productRepo.create(data);
};

export const getProductsByCategoryId = async (
  categoryId: number,
  cursor: string | undefined,
  limit: number,
) => {
  let cursorId: number | undefined;
  let cursorUpdatedAt: Date | undefined;
  console.log(cursorId, cursorUpdatedAt);

  if (cursor) {
    const decoded = decodeCursor(cursor);

    cursorId = decoded.id;
    cursorUpdatedAt = decoded.updated_at;

    console.log(cursorId, cursorUpdatedAt);
  }

  const products = await productRepo.findByCategoryId(
    categoryId,
    limit,
    cursorId,
    cursorUpdatedAt,
  );

  const lastProduct = products.at(-1);

  const nextCursor =
    lastProduct &&
    encodeCursor({
      id: lastProduct.id,
      updated_at: lastProduct.updated_at,
    });

  return {
    products,
    nextCursor,
  };
};

export const updateProduct = async (
  data: {
    name: string;
    description: string;
    category_id: number;
    price: number;
  },
  id: number,
) => {
  return productRepo.update(data, id);
};

export const deleteProduct = async (id: number) => {
  return productRepo.remove(id);
};
