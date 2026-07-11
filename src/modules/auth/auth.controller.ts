import catchAsync from "../../utils/catchAsync";

const registerUser = catchAsync(async () => {});

const login = catchAsync(async () => {});

const getRefreshToken = catchAsync(async () => {});

export const authController = {
  registerUser,
  login,
  getRefreshToken,
};
