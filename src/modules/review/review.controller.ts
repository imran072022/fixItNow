import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { reviewsService } from "./review.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewsService.createReview(req.body, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

export const reviewsController = {
  createReview,
};
