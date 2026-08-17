import { Router } from "express";
import { profileController } from "./profile.controller";
import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";
import { Role } from "../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateProfileSchema } from "./profile.validation";

const router = Router();
// users can view their own profile
router.get(
  "/profile/me",
  authentication,
  authorization(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  profileController.getMyProfile,
);
// users can update their profile
router.patch(
  "/profile/me",
  authentication,
  authorization(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  validateRequest(updateProfileSchema),
  profileController.updateMyProfile,
);

export const profileRoutes = router;
