import type { Role } from "../../../prisma/generated/prisma/enums";

export type UserRegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: Role;
};
