import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { technicianService } from "./technician.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import type {
  TAvailabilitySlot,
  TGetTechnicianProfilesQuery,
  TechnicianProfileId,
} from "./technician.type";

type TechnicianProfilesLocals = {
  validatedData: {
    query: TGetTechnicianProfilesQuery;
  };
};

type TechnicianProfileLocals = {
  validatedData: {
    params: {
      id: TechnicianProfileId;
    };
  };
};

type AvailabilityLocals = {
  validatedData: {
    body: TAvailabilitySlot;
  };
};

const getTechnicianProfiles = catchAsync(
  async (_req: Request, res: Response<unknown, TechnicianProfilesLocals>) => {
    const technicianProfiles = await technicianService.getTechnicianProfiles(
      res.locals.validatedData.query,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Technician profiles fetched successfully ",
      data: technicianProfiles,
    });
  },
);
// more info can be included
const getATechnicianProfile = catchAsync(
  async (_req: Request, res: Response<unknown, TechnicianProfileLocals>) => {
    const technicianProfile = await technicianService.getATechnicianProfile(
      res.locals.validatedData.params.id,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Technician profile fetched successfully ",
      data: technicianProfile,
    });
  },
);

const setAvailability = catchAsync(
  async (req: Request, res: Response<unknown, AvailabilityLocals>) => {
    const slot = await technicianService.setAvailability(
      res.locals.validatedData.body,
      req.user.id,
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Availability slot added successfully",
      data: slot,
    });
  },
);

export const technicianController = {
  getTechnicianProfiles,
  getATechnicianProfile,
  setAvailability,
};
