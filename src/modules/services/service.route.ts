import { Router } from "express";
import { serviceController } from "./service.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { getServicesSchema, createServiceSchema } from "./service.validation";
import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";

const router = Router();
// technicians will create services what they offer/can provide
router.post(
  "/services",
  authentication,
  authorization("TECHNICIAN"),
  validateRequest(createServiceSchema),
  serviceController.createService,
);

// Customers/everyone can browse services in a dedicated page. (CAN FILTER + SEARCH)
router.get(
  "/services",
  validateRequest(getServicesSchema),
  serviceController.getServices,
);

export const serviceRoutes = router;
