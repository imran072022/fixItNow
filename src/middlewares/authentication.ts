import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../utils/jwt";
import config from "../config";
import { getUserById } from "../modules/auth/auth.helper";
import catchAsync from "../utils/catchAsync";

export const authentication = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You need to login first");
    }
    const verifiedToken = verifyToken(token, config.jwt_access_secret);
    await getUserById(verifiedToken.id);
    req.user = verifiedToken;
    next();
  },
);
