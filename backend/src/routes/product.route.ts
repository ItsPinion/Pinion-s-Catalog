// routes/product.route.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import * as productService from "../services/product.service";
import { getCategoriesById } from "../services/category.service";

export const productRoutes = new Hono()
  .get("/", async (c) => {
    const cursor = c.req.query("cursor");
    const limit = Math.min(Number(c.req.query("limit") ?? 10), 100);

    try {
      console.log(cursor, limit);
      const products = await productService.getProducts(cursor, limit);
      return c.json(products);
    } catch (error) {
      return c.json(error, 500);
    }
  })
  .get("/:id", async (c) => {
    const id = Number(c.req.param("id"));

    const product = await productService.getProductById(id);
    console.log(product);

    if (!product) {
      return c.json({ error: "Product not found at ID:" + id }, 404);
    }

    return c.json(product);
  })
  .get("/category/:id", async (c) => {
    const categoryId = Number(c.req.param("id"));
    const cursor = c.req.query("cursor");
    const limit = Math.min(Number(c.req.query("limit") ?? 10), 100);
    try {
      const category = await getCategoriesById(categoryId);
      console.log(category);
      if (!category) {
        return c.json({ error: "Category not found" }, 400);
      }

      const products = await productService.getProductsByCategoryId(
        categoryId,
        cursor,
        limit,
      );
      return c.json(products);
    } catch (error) {
      return c.json(error, 500);
    }
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        category_id: z.number().min(1),
        price: z.number().min(1),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");

      try {
        const category = await getCategoriesById(body.category_id);
        console.log(category);
        if (!category) {
          return c.json({ error: "Category not found" }, 400);
        }
      } catch (error) {
        return c.json(error, 500);
      }

      try {
        const product = await productService.createProduct(body);
        return c.json(product, 201);
      } catch (error) {
        return c.json(error, 500);
      }
    },
  )
  .patch(
    "/:id",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        category_id: z.number().min(1),
        price: z.number().min(1),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");
      const id = Number(c.req.param("id"));

      try {
        const category = await getCategoriesById(body.category_id);
        console.log(category);
        if (!category) {
          console.log("category not found");
          return c.json({ error: "Category not found" }, 400);
        }

        const product = await productService.updateProduct(body, id);
        return c.json(product, 201);
      } catch (error) {
        return c.json(error, 500);
      }
    },
  )
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));

    try {
      await productService.deleteProduct(id);
      return c.json({ success: true }, 200);
    } catch (error) {
      return c.json(error, 500);
    }
  });
