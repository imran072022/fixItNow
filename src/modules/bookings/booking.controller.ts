import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { bookingService } from "./booking.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.createBooking(req.body, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Booking request sent successfully",
    data: booking,
  });
});

const getAllBookings = catchAsync(async () => {});
const getASingleBooking = catchAsync(async () => {});
const updateBookingStatus = catchAsync(async () => {});

export const bookingController = {
  createBooking,
  getAllBookings,
  getASingleBooking,
  updateBookingStatus,
};
