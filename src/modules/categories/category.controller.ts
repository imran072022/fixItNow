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

type UpdateCategoryLocals = {
  validatedData: {
    params: TUpdateCategoryParams;
    body: TUpdateCategoryBody;
  };
};

type DeleteCategoryLocals = {
  validatedData: {
    params: TDeleteCategoryParams;
  };
};

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
  async (_req: Request, res: Response<unknown, UpdateCategoryLocals>) => {
    const result = await categoryService.updateCategory(
      res.locals.validatedData.params.id,
      res.locals.validatedData.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Category updated successfully",
      data: result,
    });
  },
);

const deleteCategory = catchAsync(
  async (_req: Request, res: Response<unknown, DeleteCategoryLocals>) => {
    const result = await categoryService.deleteCategory(
      res.locals.validatedData.params.id,
    );
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
