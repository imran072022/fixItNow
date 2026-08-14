import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { paymentsService } from "./payment.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentsService.createCheckoutSession(
      req.user.id,
      req.body.id as string,
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Checkout Completed",
      data: result,
    });
  },
);

const confirmPayment = catchAsync(async (req, res) => {});
const getAllPayments = catchAsync(async (req, res) => {});
const getSinglePayment = catchAsync(async (req, res) => {});

export const paymentsController = {
  createCheckoutSession,
  confirmPayment,
  getAllPayments,
  getSinglePayment,
};
