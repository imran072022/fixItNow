import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import { adminService } from "./admin.service";
import sendResponse from "../../utils/sendResponse";
import type { TBanUnbanUserParams, TGetAllUsersQuery } from "./admin.type";

const getAllUsers = catchAsync(
  async (req: Request<{}, {}, {}, TGetAllUsersQuery>, res: Response) => {
    const { role } = req.query;
    const users = await adminService.getAllUsers(role);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: users,
    });
  },
);

const banUnbanUser = catchAsync(
  async (req: Request<TBanUnbanUserParams>, res: Response) => {
    const { id } = req.params;
    const result = await adminService.banUnbanUser(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "User banned/unbanned successfully",
      data: result,
    });
  },
);

export const adminController = {
  getAllUsers,
  banUnbanUser,
};
