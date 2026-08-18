import {
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
} from "../../../prisma/generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import type Stripe from "stripe";
import {
  handleCheckoutSessionCompleted,
  handlePaymentIntentFailed,
} from "./payment.utils";

const createCheckoutSession = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
      payments: true,
      customer: {
        select: {
          email: true,
        },
      },
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
  const completedPayment = booking.payments.find(
    (payment) => payment.status === PaymentStatus.COMPLETED,
  );

  if (completedPayment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This booking has already been paid",
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: booking.customer.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: booking.service.name,
          },
          unit_amount: booking.service.price,
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId },
    payment_intent_data: {
      metadata: {
        bookingId,
      },
    },
    success_url: `${config.frontend_url}/payment/success?bookingId=${bookingId}`,
    cancel_url: `${config.frontend_url}/payment/cancel?bookingId=${bookingId}`,
  });
  return { checkoutUrl: session.url };
};

const handleStripeWebhook = async (event: Stripe.Event) => {
  console.log("Event", event);
  switch (event.type) {
    case "checkout.session.completed":
      return handleCheckoutSessionCompleted(event);
    case "payment_intent.payment_failed":
      return handlePaymentIntentFailed(event);
    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
      return;
  }
};

const getAllPayments = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        customerId: userId,
      },
    },
  });
  return payments;
};

export const paymentsService = {
  createCheckoutSession,
  handleStripeWebhook,
  getAllPayments,
};
