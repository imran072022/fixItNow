import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { profileService } from "./profile.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const myProfile = await profileService.getMyProfile(req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: myProfile,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const updatedProfile = await profileService.updateMyProfile(
    req.body,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: updatedProfile,
  });
});

export const profileController = {
  getMyProfile,
  updateMyProfile,
};
