import type Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import {
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
} from "../../../prisma/generated/prisma/enums";

export const handleCheckoutSessionCompleted = async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session;

  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    console.error("Booking ID is missing from Stripe session metadata", {
      sessionId: session.id,
    });
    return;
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    console.error("Booking doesn't exist", {
      bookingId,
      sessionId: session.id,
    });
    return;
  }

  const paymentIntentId = session.payment_intent;

  if (!paymentIntentId || typeof paymentIntentId !== "string") {
    console.error("Payment intent is missing", {
      sessionId: session.id,
      bookingId,
    });
    return;
  }

  const amount = session.amount_total;

  if (amount === null) {
    console.error("Payment amount is missing from Stripe session", {
      sessionId: session.id,
      bookingId,
    });
    return;
  }

  // Stripe may deliver the same webhook more than once.
  // transactionId is unique, so don't create another Payment.
  const existingPayment = await prisma.payment.findUnique({
    where: {
      transactionId: paymentIntentId,
    },
  });

  if (existingPayment) {
    return;
  }

  await prisma.$transaction([
    prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount,
        provider: PaymentProvider.STRIPE,
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

export const handlePaymentIntentFailed = async (event: Stripe.Event) => {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  const bookingId = paymentIntent.metadata?.bookingId;

  if (!bookingId) {
    console.error("Payment failed without bookingId metadata", {
      paymentIntentId: paymentIntent.id,
    });
    return;
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    console.error("Booking doesn't exist", {
      bookingId,
      paymentIntentId: paymentIntent.id,
    });
    return;
  }

  // Prevent duplicate payment records if Stripe sends the event again.
  const existingPayment = await prisma.payment.findUnique({
    where: {
      transactionId: paymentIntent.id,
    },
  });

  if (existingPayment) {
    return;
  }

  await prisma.payment.create({
    data: {
      bookingId,
      amount: paymentIntent.amount,
      provider: PaymentProvider.STRIPE,
      transactionId: paymentIntent.id,
      status: PaymentStatus.FAILED,
    },
  });
};
