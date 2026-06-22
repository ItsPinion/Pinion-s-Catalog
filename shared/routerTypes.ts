import { productRoutes } from "../backend/src/routes/product.route";
import { categoryRoutes } from "../backend/src/routes/category.route";

export type productAppType = typeof productRoutes;
export type categoryAppType = typeof categoryRoutes;
