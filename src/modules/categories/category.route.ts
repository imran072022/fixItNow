import { Router } from "express";
import { categoryController } from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  categoryDeleteParamsSchema,
  categorySchema,
  categoryUpdateSchema,
} from "./category.validation";
import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

// only admin can create a category
router.post(
  "/categories",
  authentication,
  authorization("ADMIN"),
  validateRequest(categorySchema),
  categoryController.createCategory,
);

// get all categories for frontend
router.get("/categories", categoryController.getCategories);

// update categories
router.patch(
  "/categories/:id",
  authentication,
  authorization(Role.ADMIN),
  validateRequest(categoryUpdateSchema),
  categoryController.updateCategory,
);

// delete categories
router.delete(
  "/categories/:id",
  authentication,
  authorization(Role.ADMIN),
  validateRequest(categoryDeleteParamsSchema),
  categoryController.deleteCategory,
);

export const categoryRoutes = router;
