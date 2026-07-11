import { Router } from "express";
import { servicesController } from "./services.controller";

const router = Router();
// As a small product, I won't keep so much info about service, so no need an endpoint for "view service details"

// technicians will create services what they offer/can provide
router.post("/services", servicesController.createService);

// Customers/everyone can browse services in a dedicated page. (CAN FILTER + SEARCH)
router.get("/services", servicesController.getServices);

export const serviceRoutes = router;
