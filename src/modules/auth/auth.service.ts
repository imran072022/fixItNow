import bcrypt from "bcryptjs";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import config from "../../config";
import type {
  JwtUserPayload,
  UserLoginPayload,
  UserRegisterPayload,
} from "./auth.types";
import { signToken } from "../../utils/jwt";

const registerUser = async (payload: UserRegisterPayload) => {
  const { name, email, password, role } = payload;
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

const login = async (payload: UserLoginPayload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid credentials");
  }
  const hashedPassword = user.password;
  const passwordMatches = await bcrypt.compare(password, hashedPassword);
  if (!passwordMatches) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }
  const jwtPayload: JwtUserPayload = {
    id: user.id,
    email,
    role: user.role,
    status: user.status,
  };

  const accessToken = signToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_token_expiry,
  );
  const refreshToken = signToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_token_expiry,
  );
  return { accessToken, refreshToken };
};

const refreshToken = async () => {};

export const authService = {
  registerUser,
  login,
  refreshToken,
};
