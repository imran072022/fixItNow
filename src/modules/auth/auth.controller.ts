import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  sendResponse(res, {
    statusCode: 201,
    message: "User created successfully",
    data: result,
  });
});

const login = catchAsync(async () => {});

const getRefreshToken = catchAsync(async () => {});

export const authController = {
  registerUser,
  login,
  getRefreshToken,
};
