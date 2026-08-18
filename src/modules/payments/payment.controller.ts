import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { paymentsService } from "./payment.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { stripe } from "../../lib/stripe";
import config from "../../config";

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

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];
  if (!signature) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing Stripe signature");
  }

  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    config.stripe_webhook_secret,
  );

  await paymentsService.handleStripeWebhook(event);
});

const getAllPayments = catchAsync(async (req, res) => {
  const payments = await paymentsService.getAllPayments(req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payment history retrieved successfully",
    data: payments,
  });
});

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  getAllPayments,
};
