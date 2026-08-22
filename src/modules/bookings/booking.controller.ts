import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { bookingService } from "./booking.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import type { TBookingParams } from "./booking.type";

type BookingLocals = {
  validatedData: {
    params: TBookingParams;
  };
};

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.createBooking(req.body, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Booking request sent successfully",
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const bookingResult = await bookingService.getAllBookings(req.user);
  const { total, bookings } = bookingResult;
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    data: {
      total,
      bookings,
    },
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await bookingService.updateBookingStatus(
    id as string,
    status,
    req.user.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Booking status updated successfully",
    data: result,
  });
});

const getABooking = catchAsync(
  async (req: Request, res: Response<unknown, BookingLocals>) => {
    const { id } = res.locals.validatedData.params;
    const result = await bookingService.getABooking(id, req.user.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Booking retrieved successfully",
      data: result,
    });
  },
);

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  getABooking,
};
