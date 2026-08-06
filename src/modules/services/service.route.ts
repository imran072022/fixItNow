import { Router } from "express";
import { serviceController } from "./service.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { serviceSchema } from "./service.validation";
import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";

const router = Router();
// As a small product, I won't keep so much info about service, so no need an endpoint for "view service details"

// technicians will create services what they offer/can provide
router.post(
  "/services",
  validateRequest(serviceSchema),
  authentication,
  authorization("TECHNICIAN"),
  serviceController.createService,
);

// Customers/everyone can browse services in a dedicated page. (CAN FILTER + SEARCH)
router.get("/services", serviceController.getServices);

export const serviceRoutes = router;
