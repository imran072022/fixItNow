import {
  BookingStatus,
  PaymentStatus,
} from "../../../prisma/generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { stripe } from "../../lib/stripe";
import config from "../../config";

const createCheckoutSession = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
      payment: true,
    },
  });
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking doesn't exist");
  }
  if (booking.customerId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to pay for this booking",
    );
  }
  if (booking.status !== "ACCEPTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only accepted bookings can be paid",
    );
  }
  if (booking.payment?.status === PaymentStatus.COMPLETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This booking has already been paid",
    );
  }
  const amount = booking.service.price;
  const amountInCents = Math.round(Number(amount.toString()) * 100);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: booking.service.name,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${config.frontend_url}/payment/success?bookingId=${bookingId}`,
    cancel_url: `${config.frontend_url}/payment/cancel?bookingId=${bookingId}`,
  });
  return { checkoutUrl: session.url };
};

const confirmPayment = async () => {};
const getAllPayments = async () => {};
const getSinglePayment = async () => {};

export const paymentsService = {
  createCheckoutSession,
  confirmPayment,
  getAllPayments,
  getSinglePayment,
};
