import bcrypt from "bcryptjs";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import config from "../../config";
import type { UserRegisterPayload } from "./auth.types";

const registerUser = async (payload: UserRegisterPayload) => {
  const { name, email, password, role } = payload;

  if (role === "ADMIN") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Admin registration isn't allowed",
    );
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round),
  );
  const result = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "TECHNICIAN" && {
        technicianProfile: {
          create: {},
        },
      }),
    },
    select: {
      name: true,
      email: true,
      role: true,
      status: true,
      ...(role === "TECHNICIAN" && {
        technicianProfile: true,
      }),
    },
  });
  return result;
};

const login = async () => {};

const getRefreshToken = async () => {};

export const authService = {
  registerUser,
  login,
  getRefreshToken,
};
