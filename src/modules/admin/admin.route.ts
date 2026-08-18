import { Router } from "express";
import { adminController } from "./admin.controller";
import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";
import { Role } from "../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  banUnbanUserParamsSchema,
  getAllUsersQuerySchema,
} from "./admin.validation";

const router = Router();

// admin can get all users
router.get(
  "/users",
  authentication,
  authorization(Role.ADMIN),
  validateRequest(getAllUsersQuerySchema),
  adminController.getAllUsers,
);

// admin can ban/unban a user
router.patch(
  "/users/:id",
  authentication,
  authorization(Role.ADMIN),
  validateRequest(banUnbanUserParamsSchema),
  adminController.banUnbanUser,
);
export const adminRoutes = router;
