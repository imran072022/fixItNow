import catchAsync from "../../utils/catchAsync";

const getTechnicians = catchAsync(async () => {});

const getATechnicianProfile = catchAsync(async () => {});

const updateProfile = catchAsync(async () => {});

const setAvailability = catchAsync(async () => {});

export const techniciansController = {
  getTechnicians,
  getATechnicianProfile,
  updateProfile,
  setAvailability,
};
