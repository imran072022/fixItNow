import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Logged in successfully",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

const getRefreshToken = catchAsync(async () => {});

export const authController = {
  registerUser,
  login,
  getRefreshToken,
};
