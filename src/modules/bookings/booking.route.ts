import { Router } from "express";

import { authentication } from "../../middlewares/authentication";
import { authorization } from "../../middlewares/authorization";
import { bookingController } from "./booking.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createBookingSchema,
  getBookingParamSchema,
} from "./booking.validation";

const router = Router();

// users will send a request of booking to a technician
router.post(
  "/bookings",
  authentication,
  authorization("CUSTOMER"),
  validateRequest(createBookingSchema),
  bookingController.createBooking,
);

// users or technicians can see all their bookings. Admin can see all bookings (role based)
router.get(
  "/bookings",
  authentication,
  authorization("ADMIN", "CUSTOMER", "TECHNICIAN"),
  bookingController.getAllBookings,
);

// technician can either accept or decline request and it will change booking status
router.patch(
  "/bookings/:id/status",
  authentication,
  authorization("TECHNICIAN", "CUSTOMER"),
  bookingController.updateBookingStatus,
);

// customers can track their booking status
router.get(
  "/bookings/:id",
  authentication,
  authorization("CUSTOMER"),
  validateRequest(getBookingParamSchema),
  bookingController.getABooking,
);
export const bookingRoutes = router;
