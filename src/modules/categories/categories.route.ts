import { Router } from "express";
import { categoriesController } from "./categories.controller";

const router = Router();

// only admin can create a category
router.post("/categories", categoriesController.createCategory);

// get all categories for frontend
router.get("/categories", categoriesController.getAllCategories);

export const categoryRoutes = router;
