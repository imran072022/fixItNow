import catchAsync from "../../utils/catchAsync";

const getAllUsers = catchAsync(async () => {});

const banUnbanUser = catchAsync(async () => {});

export const adminController = {
  getAllUsers,
  banUnbanUser,
};
