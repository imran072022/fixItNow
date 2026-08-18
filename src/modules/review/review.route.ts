import { Router } from "express";
import { reviewsController } from "./review.controller";
import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";
import { Role } from "../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { reviewSchema } from "./review.validation";

// We are keeping only one single POST api for reviews
const router = Router();

// logged in users can review a technician profile
router.post(
  "/reviews",
  authentication,
  authorization(Role.CUSTOMER),
  validateRequest(reviewSchema),
  reviewsController.createReview,
);

export const reviewRoutes = router;
