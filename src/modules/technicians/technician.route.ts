import { Router } from "express";
import { technicianController } from "./technician.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  availabilitySlotSchema,
  getTechnicianProfilesSchema,
  getTechnicianSchema,
} from "./technician.validation";
import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";

const router = Router();
// We are keeping profiles only for technicians in this platform for assignment simplicity.

// everyone can get/browse all technicians in a page (apply SEARCH + FILTER)
router.get(
  "/technicians",
  validateRequest(getTechnicianProfilesSchema),
  technicianController.getTechnicianProfiles,
);

// anyone can view a specific technician's profile
router.get(
  "/technicians/:id",
  validateRequest(getTechnicianSchema),
  technicianController.getATechnicianProfile,
);

// technicians need to set/update availability slots
router.post(
  "/technicians/me/availability",
  authentication,
  authorization("TECHNICIAN"),
  validateRequest(availabilitySlotSchema),
  technicianController.setAvailability,
);

export const technicianRoutes = router;
