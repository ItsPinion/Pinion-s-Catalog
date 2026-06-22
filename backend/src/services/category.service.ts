import * as categoryRepo from "../repositories/category.repository";

export const getCategories = async () => {
  const categories = await categoryRepo.findAll();

  return categories;
};

export const createCategory = async (data: { name: string }) => {
  return categoryRepo.create(data);
};

export const getCategoriesById = async (id: number) => {
  return categoryRepo.findById(id);
};

export const updateCategory = async (data: { name: string }, id: number) => {
  return categoryRepo.update(data, id);
};

export const deleteCategory = async (id: number) => {
  const products = await categoryRepo.removeProductCategory(id);

  console.log(`Removed ${products.length} products`);

  return await categoryRepo.remove(id);
};
