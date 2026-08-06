import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

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

export const categoryController = {
  createCategory,
  getCategories,
};
