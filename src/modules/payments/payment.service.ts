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

const createCheckoutSession = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
      payment: true,
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
  if (booking.payment?.status === PaymentStatus.COMPLETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This booking has already been paid",
    );
  }
  const amountInCents = booking.service.price;
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
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId },
    success_url: `${config.frontend_url}/payment/success?bookingId=${bookingId}`,
    cancel_url: `${config.frontend_url}/payment/cancel?bookingId=${bookingId}`,
  });
  return { checkoutUrl: session.url };
};

const handleWebhook = async (event: Stripe.Event) => {
  console.log("Event", event);
  console.log("Data object", event.data.object);
  if (event.type !== "checkout.session.completed") {
    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;
  // validate the booking
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking ID is missing from Stripe session metadata",
    );
  }
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      payment: true,
    },
  });
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking doesn't exist");
  }
  if (booking.payment?.status === PaymentStatus.COMPLETED) {
    return;
  }
  // validate the payment intent ID
  const paymentIntentId = session.payment_intent;
  if (!paymentIntentId || typeof paymentIntentId !== "string") {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment intent is missing");
  }
  // validate the amount
  const amount = session.amount_total;
  if (amount === null) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment amount is missing from Stripe session",
    );
  }
  // Query "Payment" and "Booking" tables
  await prisma.$transaction([
    prisma.payment.upsert({
      where: {
        bookingId: booking.id,
      },
      create: {
        bookingId: booking.id,
        amount,
        provider: PaymentProvider.STRIPE,
        transactionId: paymentIntentId,
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
      update: {
        transactionId: paymentIntentId,
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    }),

    prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        status: BookingStatus.PAID,
      },
    }),
  ]);
};

const confirmPayment = async () => {};
const getAllPayments = async () => {};
const getSinglePayment = async () => {};

export const paymentsService = {
  createCheckoutSession,
  handleWebhook,
  confirmPayment,
  getAllPayments,
  getSinglePayment,
};
