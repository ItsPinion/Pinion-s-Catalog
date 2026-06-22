// routes/category.route.ts
import { Hono } from "hono";
import * as categoryService from "../services/category.service";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

export const categoryRoutes = new Hono();

categoryRoutes
  .get("/", async (c) => {
    try {
      const categories = await categoryService.getCategories();
      return c.json(categories);
    } catch (error) {
      return c.json(error, 500);
    }
  })
  .get("/:id", async (c) => {
    const id = Number(c.req.param("id"));

    try {
      const category = await categoryService.getCategoriesById(id);
      return c.json(category);
    } catch (error) {
      return c.json(error, 500);
    }
  })
  .post(
    "/",
    zValidator("json", z.object({ name: z.string().min(1) })),
    async (c) => {
      const body = c.req.valid("json");

      try {
        const category = await categoryService.createCategory(body);
        return c.json(category, 201);
      } catch (error) {
        return c.json(error, 500);
      }
    },
  )
  .patch(
    "/:id",
    zValidator("json", z.object({ name: z.string().min(1) })),
    async (c) => {
      const body = c.req.valid("json");
      const id = Number(c.req.param("id"));

      try {
        const category = await categoryService.getCategoriesById(id);
        console.log(category);
        if (!category) {
          return c.json({ error: "Category not found" }, 400);
        }

        const newCategory = await categoryService.updateCategory(body, id);
        return c.json(newCategory, 201);
      } catch (error) {
        return c.json(error, 500);
      }
    },
  )
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));

    try {
      await categoryService.deleteCategory(id);
      return c.json({ success: true }, 200);
    } catch (error) {
      return c.json(error, 500);
    }
  });
