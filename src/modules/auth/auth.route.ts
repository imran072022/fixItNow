import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.registerUser,
);
router.post("/login", authController.login);
router.post("/refresh-token", authController.getRefreshToken);

export const authRoutes = router;
