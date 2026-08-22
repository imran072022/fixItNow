import { BookingStatus } from "../../../prisma/generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import type { TReview } from "./review.type";
import httpStatus from "http-status";

const createReview = async (payload: TReview, userId: string) => {
  const { bookingId, rating, review } = payload;

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking doesn't exist");
  }

  if (booking.customerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to review");
  }

  if (booking.status !== BookingStatus.COMPLETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only completed bookings can be reviewed",
    );
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId,
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This booking has already been reviewed",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const createdReview = await tx.review.create({
      data: {
        reviewerId: userId,
        bookingId,
        rating,
        review,
      },
    });

    const technicianProfile = await tx.technicianProfile.findUniqueOrThrow({
      where: {
        id: booking.technicianProfileId,
      },
      select: {
        ratingAverage: true,
        reviewCount: true,
      },
    });

    const newReviewCount = technicianProfile.reviewCount + 1;

    const newRatingAverage =
      (technicianProfile.ratingAverage * technicianProfile.reviewCount +
        rating) /
      newReviewCount;

    await tx.technicianProfile.update({
      where: {
        id: booking.technicianProfileId,
      },
      data: {
        ratingAverage: newRatingAverage,
        reviewCount: newReviewCount,
      },
    });

    return createdReview;
  });

  return result;
};

export const reviewsService = {
  createReview,
};
