import { Hono } from "hono";
import { cors } from "hono/cors";
import { timing } from "hono/timing";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { compress } from "hono/compress";
import z from "zod";
import { zValidator } from "@hono/zod-validator";
import { productRoutes } from "./routes/product.route";
import { categoryRoutes } from "./routes/category.route";

const app = new Hono()
  .use("*", compress())
  .use("*", cors())
  .use("*", timing())
  .use("*", logger())
  .use("*", prettyJSON())
  .use("*", secureHeaders());

const api = new Hono();

api.route("/products", productRoutes);
api.route("/categories", categoryRoutes);

app.route("/api/v1", api);

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "API running",
  });
});

export const route = app;

export default {
  port: 8000,
  fetch: app.fetch,
};
