import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../utils/jwt";
import config from "../config";
import { getUserById } from "../modules/auth/auth.helper";
import catchAsync from "../utils/catchAsync";
import { UserStatus } from "../../prisma/generated/prisma/enums";

export const authentication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You need to login first");
    }
    const verifiedToken = verifyToken(token, config.jwt_access_secret);
    const user = await getUserById(verifiedToken.id);
    if (user.status === UserStatus.BANNED) {
      throw new AppError(httpStatus.FORBIDDEN, "Your account has been banned");
    }
    req.user = verifiedToken;
    next();
  },
);
