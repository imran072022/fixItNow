import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { serviceService } from "./service.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createService = catchAsync(async (req: Request, res: Response) => {
  const result = await serviceService.createService(req.body, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Service created successfully",
    data: result,
  });
});

const getServices = catchAsync(async (req: Request, res: Response) => {
  const services = await serviceService.getServices();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Services fetched successfully",
    data: services,
  });
});

export const serviceController = {
  createService,
  getServices,
};
