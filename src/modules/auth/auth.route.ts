import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.registerUser,
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/refresh-token", authController.refreshToken);

export const authRoutes = router;
