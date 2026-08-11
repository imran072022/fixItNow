import { Router } from "express";
import { categoryController } from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { categorySchema } from "./category.validation";
import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";

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

export const categoryRoutes = router;
