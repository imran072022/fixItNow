import catchAsync from "../../utils/catchAsync";

const createPayment = catchAsync(async (req, res) => {});
const confirmPayment = catchAsync(async (req, res) => {});
const getAllPayments = catchAsync(async (req, res) => {});
const getSinglePayment = catchAsync(async (req, res) => {});

export const paymentsController = {
  createPayment,
  confirmPayment,
  getAllPayments,
  getSinglePayment,
};
