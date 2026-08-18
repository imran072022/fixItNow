import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type { CategoryPayload, TUpdateCategoryBody } from "./category.type";
import httpStatus from "http-status";

const createCategory = async (payload: CategoryPayload) => {
  const result = await prisma.category.create({
    data: {
      name: payload.categoryName,
    },
    include: {
      services: true,
    },
  });
  return result;
};

const getCategories = async () => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return categories;
};
const updateCategory = async (
  categoryId: string,
  payload: TUpdateCategoryBody,
) => {
  const { name } = payload;
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const result = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name,
    },
  });
  return result;
};
const deleteCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  const result = await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
  return result;
};

export const categoryService = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
