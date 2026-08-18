import { UserStatus, type Role } from "../../../prisma/generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";

const getAllUsers = async (role?: Role) => {
  const users = await prisma.user.findMany({
    ...(role && { where: { role } }),
  });

  return users;
};

const banUnbanUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      status: true,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status:
        user.status === UserStatus.BANNED
          ? UserStatus.ACTIVE
          : UserStatus.BANNED,
    },
  });

  return result;
};

export const adminService = {
  getAllUsers,
  banUnbanUser,
};
