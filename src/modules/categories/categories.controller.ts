import catchAsync from "../../utils/catchAsync";

const createCategory = catchAsync(async () => {});
const getAllCategories = catchAsync(async () => {});

export const categoriesController = {
  createCategory,
  getAllCategories,
};
