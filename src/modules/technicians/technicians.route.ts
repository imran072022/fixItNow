import { Router } from "express";
import { techniciansController } from "./technicians.controller";

const router = Router();
// We are keeping profiles only for technicians in this platform for assignment simplicity.

// everyone can get/browse all technicians in a page (apply SEARCH + FILTER)
router.get("/technicians", techniciansController.getTechnicians);

// anyone can view a specific technician's profile
router.get("/technicians/:id", techniciansController.getATechnicianProfile);

// technicians can update their own profile.
router.patch("/technicians/me", techniciansController.updateProfile);

// technicians need to set/update availability slots
router.patch(
  "/technicians/me/availability",
  techniciansController.setAvailability,
);

export const technicianRoutes = router;
