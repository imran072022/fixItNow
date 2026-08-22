import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { serviceService } from "./service.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import type { TGetServicesQuery } from "./service.type";

type ServiceLocals = {
  validatedData: {
    query: TGetServicesQuery;
  };
};

const createService = catchAsync(async (req: Request, res: Response) => {
  const result = await serviceService.createService(req.body, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Service created successfully",
    data: result,
  });
});

const getServices = catchAsync(
  async (_req: Request, res: Response<unknown, ServiceLocals>) => {
    const services = await serviceService.getServices(
      res.locals.validatedData.query,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Services fetched successfully",
      data: services,
    });
  },
);

export const serviceController = {
  createService,
  getServices,
};
