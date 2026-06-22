"use server";
import { hc } from "hono/client";
import type { productAppType } from "@/../shared/routerTypes";

const client = hc<productAppType>(
  (process.env.BACKEND || "http://localhost:8000") + "/api/v1/products",
);

export async function getProducts(cursor: string | undefined, limit: number) {
  const res = await client.index.$get({
    query: {
      cursor,
      limit: `${limit}`,
    },
  });
  console.log(res);

  if (res.ok) {
    const result = await res.json();
    console.log(result);
    return result;
  }

  const result = await res.json();

  throw new Error(result?.toString());
}
