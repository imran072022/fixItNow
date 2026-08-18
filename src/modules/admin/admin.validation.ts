import z from "zod";
import { Role } from "../../../prisma/generated/prisma/enums";

export const getAllUsersQuerySchema = z.object({
  query: z.object({
    role: z.enum(Role).optional(),
  }),
});

export const banUnbanUserParamsSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid params"),
  }),
});
