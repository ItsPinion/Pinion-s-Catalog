"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "../utils/api";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  updated_at: string;
};

type ProductsResponse = {
  products: Product[];
  nextCursor: string | null;
};

export default function ProductTable() {
  const [limit, setLimit] = useState(100);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ProductsResponse>({
    queryKey: ["products", limit],

    queryFn: ({ pageParam }) =>
      getProducts(pageParam as string | undefined, limit),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const products = data?.pages.flatMap((page) => page.products ?? []) ?? [];

  const handleLoadMore = async () => {
    if (!hasNextPage) return;

    await fetchNextPage();
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-violet-500" />

        <h2 className="mt-6 text-2xl font-bold text-white">Loading Catalog</h2>

        <p className="mt-2 text-slate-400">Fetching products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
        <h2 className="text-xl font-semibold text-red-400">
          Failed to load products
        </h2>

        <p className="mt-2 text-slate-300">{(error as Error)?.message}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center">
        <div className="text-7xl">📦</div>

        <h2 className="mt-4 text-3xl font-bold text-white">
          No Products Found
        </h2>

        <p className="mt-2 text-slate-400">The catalog is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-5xl font-bold tracking-tight">SnapCatalog</h1>

              <p className="mt-3 text-lg text-slate-400">
                High-performance catalog powered by cursor pagination.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-2xl bg-slate-950/50 p-4">
                <p className="text-xs uppercase text-slate-500">
                  Products Loaded
                </p>

                <p className="mt-2 text-2xl font-bold">{products.length}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-950/50 p-4">
                <label className="text-xs text-slate-500">
                  PRODUCTS PER PAGE
                </label>

                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className=" rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-white outline-none transition focus:border-violet-500"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="rounded-2xl bg-slate-950/50 p-4">
                <p className="text-xs uppercase text-slate-500">Pagination</p>

                <p className="mt-2 text-lg font-semibold text-violet-400">
                  Cursor
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950/50 p-4">
                <p className="text-xs uppercase text-slate-500">Status</p>

                <p className="mt-2 text-lg font-semibold text-emerald-400">
                  Online
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-xl font-semibold">Products</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400">
                  <th className="px-6 py-4 text-left">ID</th>

                  <th className="px-6 py-4 text-left">Name</th>

                  <th className="px-6 py-4 text-left">Description</th>

                  <th className="px-6 py-4 text-left">Price</th>

                  <th className="px-6 py-4 text-left">Category</th>

                  <th className="px-6 py-4 text-left">Updated</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-800 transition-colors hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4 font-mono">{product.id}</td>

                    <td className="px-6 py-4 font-medium">{product.name}</td>

                    <td className="px-6 py-4 text-slate-400">
                      {product.description}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-400">
                        ${product.price}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-500/15 px-3 py-1 text-sm text-blue-400">
                        #{product.category_id}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {new Date(product.updated_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Load More */}
        {hasNextPage && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              className="
                rounded-2xl
                bg-linear-to-r
                from-violet-600
                to-indigo-600
                px-8
                py-4
                font-semibold
                text-white
                shadow-lg
                shadow-violet-500/20
                transition-all
                duration-300
                hover:scale-105
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isFetchingNextPage ? "Loading More..." : "Load More Products"}
            </button>
          </div>
        )}

        {!hasNextPage && products.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-slate-500">
              {`You've reached the end of the catalog.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
