import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

// admin can get all users
router.get("/users", adminController.getAllUsers);

// admin can ban/unban a user
router.patch("/users/:id", adminController.banUnbanUser);
export const adminRoutes = router;
