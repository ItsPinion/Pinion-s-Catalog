import { productRoutes } from "../backend/src/routes/product.route";
import { categoryRoutes } from "../backend/src/routes/category.route";
import { route } from "../backend/src/index";

export type productAppType = typeof productRoutes;
export type categoryAppType = typeof categoryRoutes;

export type AppType = typeof route;
