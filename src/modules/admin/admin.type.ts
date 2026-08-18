import z from "zod";
import type {
  banUnbanUserParamsSchema,
  getAllUsersQuerySchema,
} from "./admin.validation";

export type TGetAllUsersQuery = z.infer<typeof getAllUsersQuerySchema>["query"];
export type TBanUnbanUserParams = z.infer<
  typeof banUnbanUserParamsSchema
>["params"];
