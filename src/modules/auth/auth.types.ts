import z from "zod";
import type { loginSchema, registerSchema } from "./auth.validation";
import type { Role, UserStatus } from "../../../prisma/generated/prisma/enums";
export type UserRegisterPayload = z.infer<typeof registerSchema>["body"];
export type UserLoginPayload = z.infer<typeof loginSchema>["body"];
export type JwtUserPayload = {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
};
