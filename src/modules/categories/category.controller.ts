import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import type {
  TDeleteCategoryParams,
  TUpdateCategoryBody,
  TUpdateCategoryParams,
} from "./category.type";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.getCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Categories fetched successfully",
    data: categories,
  });
});

const updateCategory = catchAsync(
  async (
    req: Request<TUpdateCategoryParams, {}, TUpdateCategoryBody>,
    res: Response,
  ) => {
    const result = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Category updated successfully",
      data: result,
    });
  },
);

const deleteCategory = catchAsync(
  async (req: Request<TDeleteCategoryParams>, res: Response) => {
    const result = await categoryService.deleteCategory(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Category deleted successfully",
      data: result,
    });
  },
);
export const categoryController = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
