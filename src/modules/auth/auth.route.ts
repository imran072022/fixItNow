import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginSchema, registerSchema } from "./auth.validation";
import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.registerUser,
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/refresh-token", authController.refreshToken);
router.get(
  "/me",
  authentication,
  authorization(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  authController.getMe,
);
router.post(
  "/logout",
  authentication,
  authorization(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER),
  authController.logout,
);

export const authRoutes = router;
