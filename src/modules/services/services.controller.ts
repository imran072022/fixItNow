import catchAsync from "../../utils/catchAsync";

const createService = catchAsync(async () => {});

const getServices = catchAsync(async () => {});

export const servicesController = {
  createService,
  getServices,
};
