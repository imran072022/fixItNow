import { UserStatus } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.status === UserStatus.BANNED) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account has been banned");
  }

  return user;
};
