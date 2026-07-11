import catchAsync from "../../utils/catchAsync";

const createBooking = catchAsync(async () => {});
const getAllBookings = catchAsync(async () => {});
const getASingleBooking = catchAsync(async () => {});
const updateBookingStatus = catchAsync(async () => {});

export const bookingsController = {
  createBooking,
  getAllBookings,
  getASingleBooking,
  updateBookingStatus,
};
