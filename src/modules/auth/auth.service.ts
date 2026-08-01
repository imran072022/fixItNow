import type { Role } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";

type UserRegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: Role;
};
const registerUser = async (payload: UserRegisterPayload) => {
  const { name, email, password, role } = payload;
  const result = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
    },
    select: {
      name: true,
      email: true,
      role: true,
      status: true,
      technicianProfile: true,
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
