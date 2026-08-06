import { prisma } from "../../lib/prisma";
import type { CategoryPayload } from "./category.type";

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

export const categoryService = {
  createCategory,
  getCategories,
};
