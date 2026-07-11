import { Router } from "express";
import { reviewsController } from "./reviews.controller";

// We are keeping only one single POST route for reviews
const router = Router();

// logged in users can review a technician profile
router.post("/reviews", reviewsController.createReview);

export const reviewRoutes = router;
