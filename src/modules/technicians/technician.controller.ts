import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { technicianService } from "./technician.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import type { TechnicianProfileId } from "./technician.type";

// searching + filtering left
const getTechnicianProfiles = catchAsync(
  async (req: Request, res: Response) => {
    const technicianProfiles = await technicianService.getTechnicianProfiles();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Technician profiles fetched successfully ",
      data: technicianProfiles,
    });
  },
);
// more info can be included
const getATechnicianProfile = catchAsync(
  async (req: Request, res: Response) => {
    const technicianProfile = await technicianService.getATechnicianProfile(
      req.params.id as TechnicianProfileId,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Technician profile fetched successfully ",
      data: technicianProfile,
    });
  },
);

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const updatedProfile = await technicianService.updateProfile(
    req.body,
    req.user.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Technician profile updated successfully",
    data: updatedProfile,
  });
});

const setAvailability = catchAsync(async () => {});

export const technicianController = {
  getTechnicianProfiles,
  getATechnicianProfile,
  updateProfile,
  setAvailability,
};
